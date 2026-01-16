import { readdirSync, statSync, existsSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { root, fs, git, bun, rsync } from "./utils.js";
import { templateRepo, buildDir } from "./consts.js";

const excludePatterns = [
	".git",
	"node_modules",
	"package.json",
	"bun.lock",
	"package-lock.json",
	".envrc",
	".gitignore",
	"flake.nix",
	"flake.lock",
	"README.md",
	"LICENSE",
];

export const copyDir = (src, dest, exclude = []) => {
	if (!existsSync(dest)) {
		mkdirSync(dest, { recursive: true });
	}

	const entries = readdirSync(src);
	for (const entry of entries) {
		if (exclude.includes(entry)) continue;

		const srcPath = join(src, entry);
		const destPath = join(dest, entry);
		const stat = statSync(srcPath);

		if (stat.isDirectory()) {
			copyDir(srcPath, destPath, exclude);
		} else {
			fs.cp(srcPath, destPath);
		}
	}
};

export const deleteByExt = (dir, ext) => {
	if (!existsSync(dir)) return;

	const entries = readdirSync(dir);
	for (const entry of entries) {
		const fullPath = join(dir, entry);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			deleteByExt(fullPath, ext);
		} else if (entry.endsWith(ext)) {
			fs.rm(fullPath);
		}
	}
};

export const createTempDir = (prefix = "chobble-") => {
	const { mkdtempSync } = require("fs");
	const { tmpdir } = require("os");
	return mkdtempSync(join(tmpdir(), prefix));
};

export const cloneTemplate = (dest) => {
	console.log("Cloning template repository...");
	git.clone(templateRepo, dest);
};

export const installDeps = (dir) => {
	console.log("Installing dependencies...");
	bun.install(dir);
};

export const mergeSiteContent = (templateDir, siteDir) => {
	console.log("Merging site content...");
	deleteByExt(join(templateDir, "src"), ".md");
	copyDir(siteDir, join(templateDir, "src"), excludePatterns);
};

export const cleanup = (dir) => {
	console.log("Cleaning up...");
	fs.rm(dir);
};

export const setupTemplate = async (opts = {}) => {
	const { installDependencies = true, mergeSite = true } = opts;
	const devDir = root(buildDir, "dev");

	try {
		if (!existsSync(root(buildDir, "template"))) {
			cloneTemplate(root(buildDir, "template"));
		}

		fs.rm(devDir);
		copyDir(root(buildDir, "template"), devDir, [".git"]);

		if (mergeSite) {
			mergeSiteContent(devDir, root("src"));
		}

		if (installDependencies && !existsSync(join(devDir, "node_modules"))) {
			installDeps(devDir);
		}

		return {
			dir: devDir,
			cleanup: () => cleanup(devDir),
		};
	} catch (error) {
		fs.rm(devDir);
		throw error;
	}
};

export const runTemplateScript = (script, dir) => {
	console.log(`Running template script: ${script}`);
	bun.run(script, dir);
};
