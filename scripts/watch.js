import { watch } from "fs";
import { root, debounce } from "./utils.js";
import { sync } from "./prepare-dev.js";

console.log("Watching for file changes in src/...");

const debouncedSync = debounce(() => {
	console.log("Files changed, syncing...");
	sync();
}, 500);

watch(root("src"), { recursive: true }, (eventType, filename) => {
	if (filename && !filename.includes("node_modules")) {
		debouncedSync();
	}
});
