# node-deps.nix
{
  pkgs ? import <nixpkgs> { },
}:

let
  packageJSON = pkgs.writeTextFile {
    name = "package.json";
    text = builtins.toJSON {
      name = "veganprestwich-co-uk";
      version = "1.0.0";
      dependencies = {
        "fast-glob" = "^3.3.2";
        "@11ty/eleventy" = "^3.0.0";
        "@11ty/eleventy-img" = "^5.0.0";
      };
    };
  };

  nodeModules = pkgs.mkYarnModules {
    pname = "veganprestwich-co-uk-deps";
    version = "1.0.0";
    packageJSON = packageJSON;
    yarnLock = ./yarn.lock;
    yarnFlags = [ "--frozen-lockfile" ];
  };
in
{
  inherit packageJSON nodeModules;
}
