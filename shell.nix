{ pkgs ? import <nixpkgs> {} }:

let
  nodeDeps = import ./node-deps.nix { inherit pkgs; };
  inherit (nodeDeps) packageJSON nodeModules;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    yarn
    nodejs_22
  ];

  shellHook = ''
    # Use the same package.json and node_modules as the build
    rm -rf node_modules
    rm -rf package.json

    ln -sf ${packageJSON} package.json
    ln -sf ${nodeModules}/node_modules .

    upgrade_deps() {
      local mode=''${1:-"minor"}  # default to minor updates

      case $mode in
        "major")
          echo "Upgrading to latest major versions..."
          yarn upgrade --latest 2>/dev/null
          ;;
        "minor")
          echo "Upgrading to latest minor versions..."
          yarn upgrade 2>/dev/null
          ;;
        "patch")
          echo "Upgrading patch versions only..."
          yarn upgrade --pattern "*" --target patch 2>/dev/null
          ;;
        *)
          echo "Unknown mode: $mode"
          echo "Usage: upgrade_deps [major|minor|patch]"
          return 1
          ;;
      esac

      yarn install 2>/dev/null

      echo "Done! Don't forget to commit the updated yarn.lock file."
      exit 0
    }

    export -f upgrade_deps

    # Cleanup function
    cleanup() {
      echo "Cleaning up..."
      rm -rf node_modules package.json
    }

    # Register the cleanup function to run when the shell exits
    trap cleanup EXIT

    # If no arguments were passed, show the help message
    if [ $# -eq 0 ]; then
      echo "Development environment ready!"
      echo "Run 'upgrade_deps [major|minor|patch]' to upgrade your dependencies"
    fi
  '';
}
