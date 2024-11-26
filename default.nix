{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "your-website";
  src = ./.;

  buildInputs = with pkgs; [
    sass
    lightningcss
    nodejs
    nodePackages.pnpm
    html-minifier
  ];

  # Allow network access during build
  __noChroot = true;

  buildPhase = ''
    mkdir -p _site/style

    sass style/style.scss _site/style/style.css

    lightningcss --minify --targets '> 0.25%, not IE 11' _site/style/*.css -o _site/style/*.css

    # Install dependencies
    pnpm install --offline
    pnpm eleventy

    html-minifier --input-dir _site --output-dir _site --collapse-whitespace --file-ext html
  '';

  installPhase = ''
    mkdir -p $out
    cp -r _site/* $out/
  '';
}
