import { join } from "node:path";
import {
  buildDir,
  sourceExcludes,
  templateExcludes,
  templateRepo,
} from "./consts.js";
import {
  bun,
  copyDir,
  find,
  fs,
  git,
  mergeTemplateAndSource,
  path,
  root,
} from "./utils.js";

const build = path(buildDir);
const template = path(buildDir, "template");
const dev = path(buildDir, "dev");
const localTemplate = join(root, "..", "chobble-template");

export const prep = () => {
  console.log("Preparing build...");
  fs.mkdir(build);

  if (fs.exists(localTemplate)) {
    console.log("Using local template from ../chobble-template...");
    copyDir(localTemplate, template, {
      delete: true,
      exclude: templateExcludes,
    });
  } else if (!fs.exists(join(template, ".git"))) {
    console.log("Cloning template...");
    fs.rm(template);
    git.clone(templateRepo, template);
  } else {
    console.log("Updating template...");
    git.reset(template, { hard: true });
    git.pull(template);
  }

  find.deleteByExt(dev, ".md");
  mergeTemplateAndSource(template, root, dev, {
    delete: true,
    templateExcludes,
    sourceExcludes,
  });

  sync();

  if (!fs.exists(join(dev, "node_modules"))) {
    console.log("Installing dependencies...");
    bun.install(dev);
  }

  fs.rm(join(dev, "_site"));
  console.log("Build ready.");
};

export const sync = () => {
  copyDir(root, join(dev, "src"), {
    update: true,
    exclude: sourceExcludes,
  });
};

if (import.meta.main) prep();
