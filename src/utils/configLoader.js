export async function configLoader() {
  try {
    const config = await import('../config/config.js');
    return config.CONFIG;
  } catch (error) {
    const exampleConfig = await import('../config/config.example.js');
    return exampleConfig.CONFIG;
  }
}