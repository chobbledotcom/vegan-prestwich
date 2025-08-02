const sass = require("sass");
const path = require("path");

const createScssCompiler = (inputContent, inputPath) => {
	const dir = path.dirname(inputPath);

	return function (data) {
		return sass.compileString(inputContent, {
			loadPaths: [dir],
		}).css;
	};
};

const compileScss = (inputContent, inputPath) => {
	const compiler = createScssCompiler(inputContent, inputPath);
	return compiler({});
};

const configureScss = (eleventyConfig) => {
	eleventyConfig.addTemplateFormats("scss");
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",
		useLayouts: false,
		compile: function (inputContent, inputPath) {
			// Skip partials (files starting with underscore)
			const parsed = path.parse(inputPath);
			if (parsed.name.startsWith("_")) {
				return false;
			}
			return createScssCompiler(inputContent, inputPath);
		},
	});
};

module.exports = {
	createScssCompiler,
	compileScss,
	configureScss,
};