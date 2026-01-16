import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync, spawn as nodeSpawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const root = (...paths) => join(__dirname, "..", ...paths);
export const path = (...paths) => join(...paths);

export const read = (filePath) => Bun.file(filePath).text();
export const write = (filePath, content) => Bun.write(filePath, content);
export const readJson = async (filePath) => JSON.parse(await read(filePath));

export const fs = {
	exists: (p) => Bun.file(p).exists(),
	rm: (p) => {
		try {
			const { rmSync } = require("fs");
			rmSync(p, { recursive: true, force: true });
		} catch {}
	},
	mkdir: (p) => {
		const { mkdirSync } = require("fs");
		mkdirSync(p, { recursive: true });
	},
	cp: (src, dest) => {
		const { cpSync } = require("fs");
		cpSync(src, dest, { recursive: true });
	},
	mv: (src, dest) => {
		const { renameSync } = require("fs");
		renameSync(src, dest);
	},
};

export const run = (cmd, args = [], opts = {}) => {
	const result = spawnSync(cmd, args, {
		stdio: "inherit",
		cwd: opts.cwd || root(),
		...opts,
	});
	if (result.status !== 0) {
		throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
	}
	return result;
};

export const shell = (cmd, opts = {}) => {
	return run("sh", ["-c", cmd], opts);
};

export const spawn = (cmd, args = [], opts = {}) => {
	return nodeSpawn(cmd, args, {
		stdio: "inherit",
		cwd: opts.cwd || root(),
		...opts,
	});
};

export const git = {
	clone: (repo, dest, opts = {}) => {
		const args = ["clone", "--depth", "1"];
		if (opts.branch) args.push("-b", opts.branch);
		args.push(repo, dest);
		return run("git", args);
	},
	pull: (cwd) => run("git", ["pull"], { cwd }),
	reset: (cwd) => run("git", ["reset", "--hard"], { cwd }),
};

export const rsync = (src, dest, opts = {}) => {
	const args = ["-av", "--delete"];
	if (opts.exclude) {
		for (const ex of opts.exclude) {
			args.push("--exclude", ex);
		}
	}
	if (opts.include) {
		for (const inc of opts.include) {
			args.push("--include", inc);
		}
	}
	args.push(src, dest);
	return run("rsync", args);
};

export const bun = {
	install: (cwd) => run("bun", ["install"], { cwd }),
	run: (script, cwd) => run("bun", ["run", script], { cwd }),
	test: (cwd) => run("bun", ["test"], { cwd }),
	spawn: (script, cwd) =>
		spawn("bun", ["run", script], { cwd, stdio: "inherit" }),
};

export const ext = (filename) => {
	const parts = filename.split(".");
	return parts.length > 1 ? parts.pop() : "";
};

export const debounce = (fn, delay = 300) => {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
};

export const loadEnv = () => {
	const envPath = root(".env");
	if (fs.exists(envPath)) {
		const content = require("fs").readFileSync(envPath, "utf8");
		for (const line of content.split("\n")) {
			const [key, ...valueParts] = line.split("=");
			if (key && valueParts.length) {
				process.env[key.trim()] = valueParts.join("=").trim();
			}
		}
	}
};
