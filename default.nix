{ pkgs ? import <nixpkgs> {} }:

let
  # Input source files
  src = ./.;
  nodeDeps = import ./node-deps.nix { inherit pkgs; };
  inherit (nodeDeps) packageJSON nodeModules;

in
pkgs.stdenv.mkDerivation {
  name = "veganprestwich-co-uk";

  src = builtins.filterSource
    (path: type: !(builtins.elem (baseNameOf path) [
      "_site"
      "node_modules"
      ".git"
    ]))
    src;

  nativeBuildInputs = with pkgs; [
    cacert
    minify
    lightningcss
    sass
    yarn
  ];

  configurePhase = ''
    export HOME=$TMPDIR
    mkdir -p _site/style

    cp -r ${nodeModules}/node_modules .
    chmod -R +w node_modules
    cp ${packageJSON} package.json
  '';

  buildPhase = ''
    echo 'Compiling SCSS'
    sass style/style.scss _site/style/style.css

    echo 'Minifying CSS'
    lightningcss --minify --targets '> 0.25%, not IE 11' _site/style/*.css -o _site/style/*.css

    echo 'Building site'
    yarn --offline eleventy

    echo 'Minifying HTML'
    minify --all --recursive --output . _site
  '';

  installPhase = ''
    mkdir -p $out
    cp -r _site/* $out/
    rm -rf node_modules _site package.json
  '';
}
