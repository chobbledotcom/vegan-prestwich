import { existsSync } from "fs";
import { join } from "path";
import { root, fs, git, rsync, bun } from "./utils.js";
import { templateRepo, buildDir } from "./consts.js";

const devDir = root(buildDir, "dev");
const templateDir = root(buildDir, "template");

const excludes = [
	".git",
	"node_modules",
	"package.json",
	"bun.lock",
	"package-lock.json",
	".envrc",
	"flake.nix",
	"flake.lock",
	"README.md",
	"LICENSE",
	".pages.yml",
	"scripts",
];

export const prep = async () => {
	console.log("Preparing development environment...");

	// Create build directory
	fs.mkdir(root(buildDir));

	// Clone or update template
	if (!existsSync(templateDir)) {
		console.log("Cloning template repository...");
		git.clone(templateRepo, templateDir);
	} else {
		console.log("Updating template repository...");
		git.reset(templateDir);
		git.pull(templateDir);
	}

	// Remove old dev directory and copy fresh template
	fs.rm(devDir);
	console.log("Copying template to dev directory...");
	rsync(templateDir + "/", devDir + "/", {
		exclude: [".git"],
	});

	// Sync site content (src folder)
	console.log("Syncing site content...");
	rsync(root("src") + "/", join(devDir, "src") + "/", {
		exclude: excludes,
	});

	// Install dependencies if needed
	if (!existsSync(join(devDir, "node_modules"))) {
		console.log("Installing dependencies...");
		bun.install(devDir);
	}

	// Remove old _site if it exists
	fs.rm(join(devDir, "_site"));

	console.log("Development environment ready!");
};

export const sync = () => {
	console.log("Syncing files...");
	rsync(root("src") + "/", join(devDir, "src") + "/", {
		exclude: excludes,
	});
};

// Run prep if this file is executed directly
if (import.meta.main) {
	prep();
}
