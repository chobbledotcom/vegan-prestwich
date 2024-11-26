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
    sass
    lightningcss
    nodejs_22
    yarn
    cacert
    curl
    glib
    html-minifier
  ];

  SSL_CERT_FILE = "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt";
  NIX_SSL_CERT_FILE = "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt";
  GIT_SSL_CAINFO = "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt";

  configurePhase = ''
    export HOME=$TMPDIR
    mkdir -p _site/style

    # Copy node_modules instead of linking
    cp -r ${nodeModules}/node_modules .
    chmod -R +w node_modules
    cp ${packageJSON} package.json
  '';

  buildPhase = ''
    # Compile SCSS
    echo 'Compiling SCSS'
    sass style/style.scss _site/style/style.css

    # Minify CSS
    echo 'Minifying CSS'
    lightningcss --minify --targets '> 0.25%, not IE 11' _site/style/*.css -o _site/style/*.css

    # Build site with 11ty
    echo 'Building site'
    yarn eleventy

    # Minify HTML
    echo 'Minifying HTML'
    html-minifier --input-dir _site --output-dir _site --collapse-whitespace --file-ext html
  '';

  installPhase = ''
    # Create output directory and copy files
    mkdir -p $out
    cp -r _site/* $out/

    # Clean up
    rm -rf node_modules _site package.json
  '';

  dontFixup = true;
  dontPatch = true;
}
