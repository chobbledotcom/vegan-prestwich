(import
  (
    let
      lock = builtins.fromJSON (builtins.readFile ./flake.lock);
      flake-compat = fetchTarball {
        url = "https://github.com/edolstra/flake-compat/archive/refs/tags/v1.0.1.tar.gz";
        # sha256 = "sha256-8S58zrdpzGhax6tmn1iABR3AA0N9DJMu5FQI8JkA0NNU";
      };
    in
    flake-compat
  )
  {
    src = ./.;
  }
).defaultNix.packages.${builtins.currentSystem}.site
