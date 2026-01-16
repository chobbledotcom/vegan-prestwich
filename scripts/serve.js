import { root, spawn, bun } from "./utils.js";
import { prep } from "./prepare-dev.js";
import { buildDir } from "./consts.js";

const devDir = root(buildDir, "dev");

const serve = async () => {
	await prep();

	console.log("Starting development server...");

	// Start file watcher
	const watcher = spawn("bun", ["scripts/watch.js"], { cwd: root() });

	// Start Eleventy dev server
	const server = spawn("bun", ["run", "serve"], { cwd: devDir });

	// Handle graceful shutdown
	process.on("SIGINT", () => {
		console.log("\nShutting down...");
		watcher.kill();
		server.kill();
		process.exit(0);
	});
};

serve();
