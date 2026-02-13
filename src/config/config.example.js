export const YEAR = new Date().getFullYear();

export const CONFIG = {
  TITLE: "Nought",
  LOGO_TEXT: "nought.", // IF DIFFERENT FROM TITLE
  DESCRIPTION: "An Astro 5 starter with Tailwind CSS",
  DEFAULT_AUTHOR: "ml",
  POSTS_DIR: "src/dummy_posts", // RELATIVE TO PROJECT DIRECTORY
  TAG_PAGES_DIR: "src/dummy_tag-pages", // RELATIVE TO PROJECT DIRECTORY. For custom content on tag page, i.e. /tags/<tag-name>

  // DAISYUI THEME SETTINGS //
  LIGHT_THEME: "winter", // DAISYUI LIGHT THEME NAME. SEE THEME SWITCHER FOR OPTIONS
  DARK_THEME: "aqua", // DAISYUI DARK THEME NAME. SEE THEME SWITCHER FOR OPTIONS
  THEME_SWITCH_MODE: "all", // 'light', 'dark', 'auto' (uses system preference), 'all' (loads all DaisyUI themes, for demo theme-switcher).
  STROKE_STYLE_LIGHT: true, // true = border + shadow, false = minimal (shadow only for most elements).
  STROKE_STYLE_DARK: true, // true = border + shadow, false = minimal (shadow only for most elements).

  // EXPRESSIVE-CODE THEME SETTINGS //
  LIGHT_CODE_THEME: "nord", // EXPRESSIVE-CODE LIGHT THEME NAME
  DARK_CODE_THEME: "nord", // EXPRESSIVE-CODE DARK THEME NAME
  OVERRIDE_CODE_STYLING: false, // true or false. OVERRIDE EXPRESSIVE-CODE STYLING WITH DAISYUI STYLING

  // EXPRESSIVE-CODE PLUGINS //
  EC_WRAP_DEFAULT_ON: true, // true or false. WRAP DEFAULT ON - CAN BE ENABLED/DISABLED WITH ```js wrap=true/false
  EC_PRESERVE_INDENT_DEFAULT_ON: true, // true or false. PRESERVE INDENT DEFAULT ON - CAN BE ENABLED/DISABLED WITH ```js preserveIndent=true/false
  EC_LINE_NUMBERS_DEFAULT_ON: false, // true or false. LINE NUMBERS DEFAULT ON - CAN BE ENABLED/DISABLED WITH ```js showLineNumbers=true/false
  EC_COLLAPSE_STYLE: "github", // 'github', 'collapsible-start', 'collapsible-end', 'collapsible-auto'. DEFAULTS TO GITHUB IF NOT SET. See https://expressive-code.com/plugins/collapsible-sections/
  EC_OVERRIDES_BY_LANGUAGE: {
    js: { showLineNumbers: true },
  },
  // OVERRIDES FOR EXPRESSIVE-CODE DEFAULTS/STYLING BY LANGUAGE. PASSED DIRECTLY INTO EXPRESSIVE-CODE CONFIG.
  // E.g.:
  // {
  //   "bash,sh,zsh": { wrap: false, showLineNumbers: true, preserveIndent: true },
  // },
  EC_STYLE_OVERRIDES: {
    frames: { frameBoxShadowCssValue: "0.0rem 0.0rem 0.0rem" },
  },
  // STYLING OVERRIDES FOR EXPRESSIVE-CODE. PASSED DIRECTLY INTO EXPRESSIVE-CODE CONFIG. See sections, e.g. https://expressive-code.com/key-features/frames/ for options.
  // E.g.:
  // {
  //   codeFontSize: "0.9rem",
  //   frames: {
  //     frameBoxShadowCssValue: "0.3rem 0.3rem 0.0rem",
  //     shadowColor: "var(--color-accent)",
  //   },
  // },

  // DESCRIPTION_SIDEBAR defaults to DESCRIPTION if not set. Set to false for no sidebar description. Can contain HTML.
  // DESCRIPTION_SIDEBAR: false,//Can contain HTML, e.g. '<h2>An Astro 5 starter with Tailwind CSS. <a href="https://github.com/sec-ml/nought">More info</a>.</h2>',
  DESCRIPTION_SIDEBAR:
    '<h2>An Astro 5 SSG blog theme, utilising TailwindCSS & DaisyUI. <a class="decoration-primary underline decoration-2 underline-offset-3" href="https://github.com/sec-ml/nought"><strong>More info</strong></a>.</h2>',

  URL: "https://nought.vercel.app", // URL OF SITE FOR METADATA, SITEMAP, ETC.

  // DEFAULT IF NOT SET: '© YEAR TITLE. All rights reserved. CAN CONTAIN HTML'
  COPYRIGHT:
    "© " +
    YEAR +
    ' - Nought. All rights reserved. <a class="decoration-primary underline decoration-2 underline-offset-3" href="https://github.com/sec-ml/nought"><strong>More info</strong></a>',

  SIDEBAR_TAGS: true, // true or false. SHOW TAGS IN SIDEBAR
  SIDEBAR_TAGS_MIN_POST_QTY: 1, // MINIMUM NUMBER OF POSTS ASSOCIATED WITH TAG FOR IT TO BE DISPLAYED IN SIDEBAR
  SIDEBAR_TAGS_MAX: 10, // MAX NUMBER OF TAGS TO DISPLAY IN SIDEBAR
  SIDEBAR_TAGS_SUPPRESS: [
    "maybe some tags are too long or look weird",
    "or you just don't want some shown",
  ], // TAGS TO SUPPRESS FROM SIDEBAR
  SIDEBAR_TAGS_SHOW_COUNT: true, // true or false. SHOW NUMBER OF POSTS ASSOCIATED WITH TAG IN SIDEBAR

  NAV_LINKS: [
    { label: "Home", url: "/", suppress: false },
    { label: "Styling Examples", url: "/styling-examples", suppress: false },
    {
      label: "Theme Repo",
      url: "https://github.com/sec-ml/nought",
      suppress: false,
    },
  ],

  // BLOG POST //
  BLOG_POST_SHOW_AUTHOR: true, // true or false. SHOW AUTHOR ON FULL BLOG POST PAGE
  BLOG_POST_SHOW_DATE: true, // true or false. SHOW DATE ON FULL BLOG POST PAGE

  // POST LISTING - HOMEPAGE, TAG PAGE //
  POST_LISTING_SHOW_AUTHOR: true, // true or false. SHOW AUTHOR ON POST LISTING PAGES
  POST_LISTING_SHOW_DATE: true, // true or false. SHOW DATE ON POST LISTING PAGES

  SUPPORT_TWITTER_META: true, // true or false. ADD TWITTER META TAGS

  // PAGINATION //
  PAGINATION_ITEMS_PER_PAGE: 4, // NUMBER OF POSTS PER PAGE
  PAGINATION_OLDER_POSTS_LABEL: "Older Posts >", // TEXT FOR OLDER POSTS LINK
  PAGINATION_NEWER_POSTS_LABEL: "< Newer Posts", // TEXT FOR NEWER POSTS LINK

  SCHEDULED_POSTS: true, // true or false. POSTS WITH FUTURE dateCreated WILL BE HIDDEN UNTIL PUBLISH DATE
  SCHEDULED_POSTS_SEE_IN_DEV: true, // true or false. SHOW SCHEDULED POSTS IN DEV MODE
  // ROBOTS.TXT //
  // Set to blank string/remove to use default.
  // Default is:
  //// User-agent: *
  //// Allow: /
  //// Sitemap: CONFIG.URL (as set above)

  // Making changes in astro.config.mjs will break config option, but might be required for more specific use cases.
  // See https://www.npmjs.com/package/astro-robots-txt#usage for more info.
  ROBOTS_OVERRIDE:
    "User-agent: *\nDisallow: /\nSitemap: https://nought.vercel.app/sitemap-index.xml",

  // IMAGE SETTINGS //
  // LIST OF DOMAINS FOR ASTRO IMAGE OPTIMIZATION
  IMAGE_REMOTE_DOMAINS: [], // NOTE: [''] essentially wildcards all remote images. Use empty array, or comment out to disable.

  // STYLING OVERRIDES //
  // CSS/TAILWINDCSS/DAISYUI CLASSES/OVERRIDES
  // ! Note: TailwindCSS doesn't set precedence by order.
  //   Prefix a class with `!` to force it.
  TAGS_SIDEBAR_OVERRIDE: "",
  TAGS_POST_OVERRIDE: "",
  TAGS_ALL_OVERRIDE: "",

  NAV_LINKS_OVERRIDE: "",

  LOGO_ALL_OVERRIDE: "",
  LOGO_SIDEBAR_OVERRIDE: "",
  LOGO_BODY_OVERRIDE: "",

  // TABLE OF CONTENTS //

  TOC_ENABLE: true, // true or false. ENABLE TABLE OF CONTENTS
  TOC_MIN_DEPTH: 2, // MINIMUM DEPTH OF TABLE OF CONTENTS
  TOC_MAX_DEPTH: 3, // MAXIMUM DEPTH OF TABLE OF CONTENTS
  TOC_MIN_HEADING_QTY: 3, // MINIMUM NUMBER OF HEADINGS REQUIRED FOR TABLE OF CONTENTS TO BE DISPLAYED
  TOC_DESKTOP_STYLE_OVERRIDES: "", // DESKTOP STYLE OVERRIDE CLASSES FOR TABLE OF CONTENTS. ! to force precedence, e.g. '!shadow-accent'
  TOC_MOBILE_STYLE_OVERRIDES: "", // MOBILE STYLE OVERRIDE CLASSES FOR TABLE OF CONTENTS

  // DEMO SITE SPECIFIC OPTIONS //
  DISABLE_THEME_SWITCHER: false, // true or false. DISABLE THEME SWITCHER. Defaults to true if not set.

  // TODO FEATURE (script: scripts/buildTodos.js; component: mdx/Todo.nought.astro) //
  TODOS_ENABLED: true, // true = show <Todo> blocks. If wanted in production, set PUBLIC_SHOW_TODOS=1 to show blocks.
};
