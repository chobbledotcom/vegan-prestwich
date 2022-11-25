module.exports = function(config) {
  if (process.env.NOWATCH) {
    config.setBrowserSyncConfig({
      snippetOptions: {
       blacklist: ["**/*.html"],
      }
    })
  }

  // Aliases are in relation to the _includes folder
  config.addLayoutAlias('default', 'layouts/default.html');
  config.addLayoutAlias('home', 'layouts/home.html');
  config.addLayoutAlias('page', 'layouts/page.html');
  config.addLayoutAlias('place', 'layouts/place.html');
  config.addLayoutAlias('tag', 'layouts/tag.html');
  config.addLayoutAlias('tags', 'layouts/tags.html');

  config.addCollection("shops", (api) => api.getAll().filter((a) => a.data.shop));
  config.addCollection("restaurants", (api) => api.getAll().filter((a) => a.data.restaurant));
  config.addCollection("deliveries", (api) => api.getAll().filter((a) => a.data.delivery));
  return {
    dir: {
      input: "./",      // Equivalent to Jekyll's source property
      output: "./_site" // Equivalent to Jekyll's destination property
    }
  };
};
