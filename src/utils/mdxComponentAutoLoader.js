// Use glob to load all components in the mdx directory
const component_files = import.meta.glob("../components/mdx/*.astro", {
  eager: true,
});

// Create empty components object
const components = {};

// Loop through the files in our mdx components directory
for (const [path, module] of Object.entries(component_files)) {
  // Extract the file name without the directory or extension
  const componentName = path.split("/").pop().replace(".astro", "");

  // Add the component to the components object
  components[componentName] = module.default;
}

// Export the final components object
export { components };
