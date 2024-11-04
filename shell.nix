with (import <nixpkgs> {});
  mkShell {
    buildInputs = [
      html-minifier
      lightningcss
      neocities-cli
      nodejs
      nodePackages_latest.npm
      sass
    ];
  }
