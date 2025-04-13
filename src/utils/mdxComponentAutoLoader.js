// Use glob to load all components in the mdx directory

// We now do this twice... for components that come with
// the theme, they are named .nought.astro. This is to
// prevent conflicts with components that are user-added.
// While this is unlikely, components may be based on HTML
// or display elements, and so given simple names, increasing
// the chance of issus. User added components will take
// precendence in the event of the same basename.

// User-added components are .astro files
const component_files = import.meta.glob("../components/mdx/*.astro", {
  eager: true,
});

// Theme-supplied components are .nought.astro files
const nought_component_files = import.meta.glob(
  "../components/mdx/*.nought.astro",
  {
    eager: true,
  }
);

// Create empty components object
const components = {};

// Loop through the files in our mdx components directory
// Process .astro files first
for (const [path, module] of Object.entries(component_files)) {
  // Extract the file name without the directory or extension
  const componentName = path.split("/").pop().replace(".astro", "");

  // Add the component to the components object
  components[componentName] = module.default;
}

// Process .nought.astro files. Add to components only if base name
// doesn't already exist
for (const [path, module] of Object.entries(nought_component_files)) {
  const componentName = path.split("/").pop().replace(".nought.astro", "");
  if (!components[componentName]) {
    components[componentName] = module.default;
  }
}

// Export the final components object
export { components };
