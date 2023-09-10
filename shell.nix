with (import <nixpkgs> {});
  mkShell {
    buildInputs = [
      bundler
      ruby
      bun
    ];
    shellHook = ''
      mkdir -p .nix-gems

      export GEM_HOME=$PWD/.nix-gems
      export GEM_PATH=$GEM_HOME
      export PATH=$GEM_HOME/bin:$PATH
      export PATH=$PWD/bin:$PATH

      gem list -i ^neocities$ || gem install neocities --no-document
    '';
  }
