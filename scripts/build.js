import { root, fs, bun } from "./utils.js";
import { prep } from "./prepare-dev.js";
import { buildDir } from "./consts.js";

const devDir = root(buildDir, "dev");
const outputDir = root("_site");

const build = async () => {
	await prep();

	console.log("Building site...");
	fs.rm(outputDir);

	bun.run("build", devDir);

	// Move _site from dev to root
	fs.mv(root(buildDir, "dev", "_site"), outputDir);

	console.log("Build complete! Output in _site/");
};

build();
