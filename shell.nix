with (import <nixpkgs> {});
  mkShell {
    buildInputs = [
      html-minifier
      lightningcss
      neocities-cli
      nodejs
      nodePackages.pnpm
      sass
    ];
  }
