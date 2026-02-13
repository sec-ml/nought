// Parses posts containing <Todo> custom component if TODOS_ENABLED, and generates a meta store file.
// When TODOS_ENABLED, also syncs the "todo" tag into each post's frontmatter (using gray-matter)
// so the rest of the site treats it as a normal tag.
// 
// This approach was chosen to avoid hardcoding logic (for what is quite a niche feature) in half of the files.
// This way, it can be easily removed if desired.
// 
// If TODOS_ENABLED is false: read todo-meta.js for slugs that had the tag, remove "todo" from those posts'
// frontmatter, then delete todo-meta.js. NOTE: If you delete the todo-meta.js file, the cleanup function won't
// be able to find the slugs that had the todo tag. So... don't do that? And don't commit #todo tags that shouldn't
// be in posts. 
// 
// Run via predev/prebuild or when an .mdx post changes (vite-plugin-run monitors the posts directory).
// Usage: node buildTodos.js [--file <path>]
// --file - Incremental, update only this post and merge into existing generated data.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { configLoader } from "../utils/configLoader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

// get slug from frontmatter (first line that looks like slug: "value" or slug: value)
const slug_RE = /^slug:\s*["']?([^\s"'\]\n]+)["']?/m;
// match <Todo content="..."/> or <Todo>...</Todo>; allow nested tags/components, although
// I imagine a nested Todo will be broken...huh, it's actually not THAT bad.
const todo_RE =
  /<[Tt]odo\s+content=["']([^"']*)["'][^/]*\/?>|<[Tt]odo[^>]*>([\s\S]*?)<\/[Tt]odo>/g;

// strip inner HTML from todo text so list labels are plain
function normalizeContent(content) {
  let s = (content || "TODO").trim();
  if (s.includes("<")) {
    s = s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || s;
  }
  return s;
}

// Read one post file and return its slug plus all Todo entries (id + content). Use for full and incremental runs.
// Takes path to post file as arg, returns slug and todo entries.
async function extractTodosFromFile(file_path) {
  const absolute_path = path.isAbsolute(file_path) ? file_path : path.join(ROOT, file_path);
  const file_name = path.basename(absolute_path);
  if (!/\.mdx$/.test(file_name)) return null;
  let raw = "";
  try {
    raw = await fs.readFile(absolute_path, "utf-8");
  } catch {
    return null;
  }
  // Split on first `---` so we only parse frontmatter (post content can contain `---` in codeblocks, etc.)
  const parts = raw.split(/\n---\n/);
  if (parts.length < 2) return null;
  const frontmatter = parts[0].replace(/^---\n?/, "");
  const body = parts.slice(1).join("\n---\n") || "";
  const slug_match = frontmatter.match(slug_RE);
  const slug = slug_match[1].trim();

  const entries = [];
  let index = 0;
  let match;
  todo_RE.lastIndex = 0;
  // loop extracts all <Todo> tags from body of post, and adds them to the entries array
  while ((match = todo_RE.exec(body)) !== null) {
    //match[1] is from content="...", match[2] is from <Todo>...</Todo> slot
    const content = normalizeContent(match[1] ?? match[2]);
    entries.push({ id: `todo-${index + 1}`, content });
    index++;
  }
  return { slug, entries };
}

// Scan all .mdx in posts_path and build a map slug -> todo entries. Only includes posts that have at least one Todo.
// Takes path to posts dir as arg.
async function extractTodosFromPosts(posts_path) {
  const dir = path.join(ROOT, posts_path);
  let files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    files = entries
      .filter((e) => e.isFile() && /\.mdx$/.test(e.name))
      .map((e) => e.name);
  } catch {
    return {};
  }

  const out = {};
  for (const file of files) {
    const result = await extractTodosFromFile(path.join(dir, file));
    // only include posts that have at least one Todo
    if (result && result.entries.length) out[result.slug] = result.entries;
  }
  return out;
}

// Only replace the tags key in the raw frontmatter.. don't use matter.stringify or we'd
// rewrite the whole thing, ended up with full date obj instead of just yyyy-mm-dd
function replaceTagsInFrontmatter(frontmatter_str, new_tags) {
  const block_re = /^tags:\s*\n((?:\s+-\s*[^\n]*\n)*)/m;
  const flow_re = /^tags:\s*\[[^\]]*\]/m;
  if (block_re.test(frontmatter_str)) {
    const block = "tags:\n" + new_tags.map((t) => "  - " + t).join("\n") + (new_tags.length ? "\n" : "");
    return frontmatter_str.replace(block_re, block);
  }
  if (flow_re.test(frontmatter_str)) {
    return frontmatter_str.replace(flow_re, "tags: [" + new_tags.join(", ") + "]");
  }
  return frontmatter_str;
}

// Used by vite-plugin-run: when only one post is saved, we only re-parse that file and merge into existing todo-meta
function getFileFromArgv() {
  const i = process.argv.indexOf("--file");
  if (i === -1 || !process.argv[i + 1]) return null;
  return process.argv[i + 1].trim();
}

// Write src/generated/todo-meta.js so the Todo component and any consumers can call getTodos(slug), getPostSlugsWithTodos(), etc.
function writeGenerated(gen_dir, todos_by_slug) {
  return fs.writeFile(
    path.join(gen_dir, "todo-meta.js"),
    `// Generated by scripts/buildTodos.js; do not edit.
const todos_by_slug = ${JSON.stringify(todos_by_slug)};

export function getTodos(slug) {
  return todos_by_slug[slug] ?? [];
}

export function getPostSlugsWithTodos() {
  return Object.keys(todos_by_slug);
}

export function getTodoTagCount() {
  return Object.keys(todos_by_slug).length;
}
`
  );
}

// When TODOS_ENABLED is false: read todo-meta.js for slugs that had the tag (if not found, use []),
// remove "todo" from those posts' frontmatter, then write an empty todo-meta.js so the Todo component's import resolves.
async function cleanupWhenDisabled(gen_dir, posts_path) {
  const meta_path = path.join(gen_dir, "todo-meta.js");
  let slugs = [];
  try {
    const raw = await fs.readFile(meta_path, "utf-8");
    const match = raw.match(/const todos_by_slug = ([\s\S]*?);\n\n/);
    if (match) slugs = Object.keys(JSON.parse(match[1]));
  } catch {
    // No file or parse error: nothing to clean; slugs stays []
  }
  const dir = path.join(ROOT, posts_path);
  let files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    files = entries.filter((e) => e.isFile() && /\.mdx$/.test(e.name)).map((e) => e.name);
  } catch {
    // no posts dir
  }
  const slug_set = new Set(slugs);
  for (const file of files) {
    const file_path = path.join(dir, file);
    let raw = "";
    try {
      raw = await fs.readFile(file_path, "utf-8");
    } catch {
      continue;
    }
    const idx = raw.indexOf("\n---\n");
    if (idx === -1) continue;
    const frontmatter_str = raw.slice(0, idx).replace(/^---\n?/, "");
    const body = raw.slice(idx + 5);
    // matter() only to read slug and tags. then just replace the tags line
    const parsed = matter("---\n" + frontmatter_str + "\n---");
    const slug = (parsed.data.slug ?? file.replace(/\.mdx$/, "")).trim();
    if (!slug_set.has(slug)) continue;
    let tags = Array.isArray(parsed.data.tags) ? [...parsed.data.tags] : [];
    const has_todo = tags.some((t) => String(t).toLowerCase() === "todo");
    if (has_todo) {
      const new_tags = tags.filter((t) => String(t).toLowerCase() !== "todo");
      const new_frontmatter = replaceTagsInFrontmatter(frontmatter_str, new_tags);
      await fs.writeFile(file_path, "---\n" + new_frontmatter + "\n---\n" + body);
    }
  }
  await fs.mkdir(gen_dir, { recursive: true });
  await writeGenerated(gen_dir, {});
}

// Sync the "todo" tag into each post's frontmatter: add it if the post has todos, remove it if not.
// Rest of site then just reads tags as normal. Takes paths to posts and slugs with todos as args.
async function syncTodoTagInPostFiles(posts_path, slugs_with_todos) {
  const dir = path.join(ROOT, posts_path);
  let files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    files = entries
      .filter((e) => e.isFile() && /\.mdx$/.test(e.name))
      .map((e) => e.name);
  } catch {
    return;
  }
  const slug_set = new Set(slugs_with_todos);
  for (const file of files) {
    const file_path = path.join(dir, file);
    let raw = "";
    try {
      raw = await fs.readFile(file_path, "utf-8");
    } catch {
      continue;
    }
    const idx = raw.indexOf("\n---\n");
    if (idx === -1) continue;
    const frontmatter_str = raw.slice(0, idx).replace(/^---\n?/, "");
    const body = raw.slice(idx + 5);
    // matter() only to read slug and tags. then replace just the tags line
    const parsed = matter("---\n" + frontmatter_str + "\n---");
    const slug = (parsed.data.slug ?? file.replace(/\.mdx$/, "")).trim();
    let tags = Array.isArray(parsed.data.tags) ? [...parsed.data.tags] : [];
    const has_todo = tags.some((t) => String(t).toLowerCase() === "todo");
    const should_have_todo = slug_set.has(slug);
    let new_tags = tags;
    if (should_have_todo && !has_todo) {
      new_tags = [...tags, "todo"];
    } else if (!should_have_todo && has_todo) {
      new_tags = tags.filter((t) => String(t).toLowerCase() !== "todo");
    }
    if (new_tags !== tags) {
      const new_frontmatter = replaceTagsInFrontmatter(frontmatter_str, new_tags);
      await fs.writeFile(file_path, "---\n" + new_frontmatter + "\n---\n" + body);
    }
  }
}

async function main() {
  const CONFIG = await configLoader();
  const gen_dir = path.join(ROOT, "src/generated");
  const posts_path = CONFIG.POSTS_DIR ?? "src/posts";

  if (!CONFIG.TODOS_ENABLED) {
    await cleanupWhenDisabled(gen_dir, posts_path);
    // nothing to generate or sync.. exit without writing
    process.exit(0);
  }

  await fs.mkdir(gen_dir, { recursive: true });

  const single_file = getFileFromArgv();
  let todos_by_slug;

  if (single_file) {
    // Incremental. Re-use existing todo-meta, only update the one post that was saved
    const meta_path = path.join(gen_dir, "todo-meta.js");
    let existing = {};
    try {
      const raw = await fs.readFile(meta_path, "utf-8");
      const match = raw.match(/const todos_by_slug = ([\s\S]*?);\n\n/);
      if (match) existing = JSON.parse(match[1]);
    } catch {
      // No existing file or parse error.. merge into empty object.
    }

    const result = await extractTodosFromFile(single_file);
    // single_file wasn't a valid .mdx post or wasn't readable
    if (!result) {
      process.exit(0);
    }
    // merge.. update or remove this slug in the existing map
    todos_by_slug = { ...existing };
    if (result.entries.length) {
      todos_by_slug[result.slug] = result.entries;
    } else {
      delete todos_by_slug[result.slug];
    }
  } else {
    // Full run. Scan all posts and build todo map from scratch.
    const posts_path = CONFIG.POSTS_DIR ?? "src/posts";
    todos_by_slug = await extractTodosFromPosts(posts_path);
  }

  await writeGenerated(gen_dir, todos_by_slug);

  // Prod build without PUBLIC_SHOW_TODOS: strip "todo" from frontmatter so the tag never appears (no other files touched).
  const show_todos_at_build =
    process.env.NODE_ENV !== "production" ||
    ["true", "1", "yes"].includes(String(process.env.PUBLIC_SHOW_TODOS ?? ""));
  const slugs_with_todo_tag = show_todos_at_build ? Object.keys(todos_by_slug) : [];
  await syncTodoTagInPostFiles(posts_path, slugs_with_todo_tag);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
