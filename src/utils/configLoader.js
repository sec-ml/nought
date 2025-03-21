const configModules = import.meta.glob('../config/config*.js', { eager: true });

export async function configLoader() {
  if ('../config/config.js' in configModules) {
    return configModules['../config/config.js'].CONFIG;
  } else {
    return configModules['../config/config.example.js'].CONFIG;
  }
}