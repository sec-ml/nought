// src/utils/configLoader.js
export async function configLoader() {
  // Check if running in Node.js environment
  if (typeof process !== "undefined" && process.versions?.node) {
    const path = await import("path");
    const { pathToFileURL } = await import("url");

    const baseDir = path.dirname(new URL(import.meta.url).pathname);
    const configDir = path.resolve(baseDir, "../config");

    for (const name of ["config.js", "config.example.js"]) {
      try {
        const url = pathToFileURL(path.join(configDir, name)).href;
        const mod = await import(url);
        if (mod?.CONFIG) return mod.CONFIG;
      } catch {
        // try next, which should be fallback example file.
      }
    }
    throw new Error("No usable config file with CONFIG export");
  }

  // Astro fallback
  const configModules = import.meta.glob("../config/config*.js", {
    eager: true,
  });

  if ("../config/config.js" in configModules) {
    return configModules["../config/config.js"].CONFIG;
  } else {
    return configModules["../config/config.example.js"].CONFIG;
  }
}
