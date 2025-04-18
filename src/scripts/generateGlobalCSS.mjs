import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { configLoader } from "../utils/configLoader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONFIG = await configLoader();

// Set CSS section for DaisyUI themes, based on config file
const daisy_block = (() => {
  const light_theme = CONFIG.LIGHT_THEME ? CONFIG.LIGHT_THEME : "light";
  const dark_theme = CONFIG.DARK_THEME ? CONFIG.DARK_THEME : "dracula";
  const theme_switch_mode = CONFIG.THEME_SWITCH_MODE
    ? CONFIG.THEME_SWITCH_MODE
    : "light";

  if (theme_switch_mode === "light") {
    return `themes: ${light_theme} --default;`;
  } else if (theme_switch_mode === "dark") {
    return `themes: ${dark_theme} --default, ${dark_theme} --prefersdark;`;
  } else if (theme_switch_mode === "all") {
    return `themes: all;`;
  } else {
    return `themes: ${light_theme} --default, ${dark_theme} --prefersdark;`;
  }
})();

// Custom theme packaged with Nought. Needs to be set as --prefersdark to
// be used, but if left like this, it overrides everything else. Conditionally
// set --prefersdark if required.
const dark_nought_prefersdark = (() => {
  const dark_theme = CONFIG.DARK_THEME;
  const theme_switch_mode = CONFIG.THEME_SWITCH_MODE;

  if (theme_switch_mode !== "light" && dark_theme === "dark-nought") {
    return `true`;
  } else {
    return `false`;
  }
})();

// Set paths. Output to global.css, build from global.template.css
const template_path = path.join(__dirname, "../styles/global.template.css");
const output_path = path.join(__dirname, "../styles/global.css");

let template = await fs.readFile(template_path, "utf8");
template = template.replace("{{DAISY_BLOCK}}", daisy_block);
template = template.replace(
  "{{DARK_NOUGHT_PREFERSDARK}}",
  dark_nought_prefersdark
);
// Remove DaisyUI overrides if OVERRIDE_CODE_STYLING is false
const remove_daisyui_overrides = CONFIG.OVERRIDE_CODE_STYLING ? false : true; // Example condition
if (remove_daisyui_overrides) {
  template = template.replace(
    /\/\*START-MARKER-DAISY[\s\S]*?\/\*END-MARKER-DAISY\*\//g,
    ""
  );
}

await fs.writeFile(output_path, template);
console.log("🌼 DaisyUI themes updated -> global.css (generateGlobalCSS.mjs)");
