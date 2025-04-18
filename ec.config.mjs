import { configLoader } from "./src/utils/configLoader";
const CONFIG = await configLoader();

const show_line_numbers = CONFIG.EC_LINE_NUMBERS_DEFAULT_ON ? true : false;
const wrap_on = CONFIG.EC_WRAP_DEFAULT_ON ? true : false;
const preserve_indent = CONFIG.EC_PRESERVE_INDENT_DEFAULT_ON ? true : false;
const collapse_style = CONFIG.EC_COLLAPSE_STYLE
  ? CONFIG.EC_COLLAPSE_STYLE
  : "github";
const overrides_by_lang =
  typeof CONFIG.EC_OVERRIDES_BY_LANGUAGE === "object"
    ? CONFIG.EC_OVERRIDES_BY_LANGUAGE
    : {};
const style_overrides =
  typeof CONFIG.EC_STYLE_OVERRIDES === "object"
    ? CONFIG.EC_STYLE_OVERRIDES
    : {};

const light_code_theme = CONFIG.LIGHT_CODE_THEME
  ? CONFIG.LIGHT_CODE_THEME
  : null;
const dark_code_theme = CONFIG.DARK_CODE_THEME ? CONFIG.DARK_CODE_THEME : null;
const theme_array = [light_code_theme, dark_code_theme].filter(
  (theme) => theme !== null
);
if (theme_array.length === 0) {
  theme_array.push("material-theme");
}

import { defineEcConfig } from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default defineEcConfig({
  themes: theme_array,
  defaultProps: {
    wrap: wrap_on,
    preserveIndent: preserve_indent,
    showLineNumbers: show_line_numbers,
    collapseStyle: collapse_style,
    overridesByLang: overrides_by_lang,
  },

  styleOverrides: style_overrides,

  shiki: {
    wrap: true,
  },

  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
});
