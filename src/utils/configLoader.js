// src/utils/configLoader.js

// In dev, any option can be overridden by a DEV_ prefix (e.g. DEV_POSTS_DIR). If run as Node, use NOUGHT_DEV=1 in npm dev script.

//When is_dev, build a config where each key can be replaced by DEV_<key>. Else return config unchanged
function applyDevOverrides(config, is_dev) {
  if (!is_dev) return config;
  const out = {};
  for (const key of Object.keys(config)) {
    if (key.startsWith("DEV_")) continue;
    const devVal = config["DEV_" + key];
    out[key] = devVal !== undefined && devVal !== null ? devVal : config[key];
  }
  return out;
}

export async function configLoader() {
  let config;
  let is_dev;
  // Dev mode: Node uses NOUGHT_DEV=1 (set in npm dev script). Astro/vite uses import.meta.env.DEV.
  // Check if running in Node.js environment
  if (
    typeof process !== "undefined" &&
    process.versions?.node &&
    typeof import.meta.env === "undefined" // Add check to prevent Astro build from running this section
  ) {
    const path = await import("path");
    const { pathToFileURL } = await import("url");

    const baseDir = path.dirname(new URL(import.meta.url).pathname);
    const configDir = path.resolve(baseDir, "../config");

    for (const name of ["config.js", "config.example.js"]) {
      try {
        const url = pathToFileURL(path.join(configDir, name)).href;
        const mod = await import(url);
        if (mod?.CONFIG) {
          config = mod.CONFIG;
          // If Node: dev when NOUGHT_DEV=1 (e.g. predev and dev scripts in package.json)
          is_dev = process.env.NOUGHT_DEV === "1";
          break;
        }
      } catch {
        // try next, which should be fallback example file.
      }
    }
    if (!config) throw new Error("No usable config file with CONFIG export");
  }

  // Astro fallback
  else {
    const configModules = import.meta.glob("../config/config*.js", { eager: true });
    config = configModules["../config/config.js"]?.CONFIG ?? configModules["../config/config.example.js"].CONFIG;
    // If Astro/vite: dev when running astro dev (import.meta.env.DEV)
    is_dev = import.meta.env.DEV;
  }

  // apply DEV_ overrides when in dev mode. Calling files/funcs don't need to be env aware!
  return applyDevOverrides(config, is_dev);
}
