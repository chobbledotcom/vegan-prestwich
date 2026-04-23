import { resolve } from "node:path";
import { sourceExcludes, templateExcludes } from "./consts.js";
import { fs, mergeTemplateAndSource } from "./utils.js";

const [templateDir, sourceDir, combinedDir] = process.argv.slice(2);

if (!templateDir || !sourceDir || !combinedDir) {
  console.error(
    "Usage: bun scripts/ci-merge.js <template> <source> <combined>",
  );
  process.exit(1);
}

const template = resolve(templateDir);
const source = resolve(sourceDir);
const combined = resolve(combinedDir);

console.log(`Merging template and source into ${combined}...`);
fs.mkdir(combined);
mergeTemplateAndSource(template, source, combined, {
  delete: true,
  templateExcludes,
  sourceExcludes,
});

console.log("Merge complete.");
