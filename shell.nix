{ pkgs ? import <nixpkgs> {} }:

let
  nodeDeps = import ./node-deps.nix { inherit pkgs; };
  inherit (nodeDeps) packageJSON nodeModules;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    yarn
    sass
    lightningcss
  ];

  shellHook = ''
    rm -rf node_modules
    rm -rf package.json

    ln -sf ${packageJSON} package.json
    ln -sf ${nodeModules}/node_modules .

    serve() {
      mkdir -p _site/style

      sass --watch style/style.scss:_site/style/style.css &
      SASS_PID=$!

      yarn eleventy --serve &
      ELEVENTY_PID=$!

      cleanup_serve() {
        echo "Cleaning up serve processes..."
        kill $SASS_PID 2>/dev/null
        kill $ELEVENTY_PID 2>/dev/null
        wait $SASS_PID 2>/dev/null
        wait $ELEVENTY_PID 2>/dev/null
      }

      trap cleanup_serve EXIT INT TERM

      wait -n

      cleanup_serve

      trap - EXIT INT TERM
    }

    upgrade_deps() {
      local mode=''${1:-"minor"}

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
    export -f serve

    cleanup() {
      echo "Cleaning up..."
      rm -rf node_modules _site package.json
    }

    trap cleanup EXIT

    echo "Development environment ready!"
    echo "Run 'serve' to start development server"
    echo "Run 'upgrade_deps [major|minor|patch]' to upgrade your dependencies"
  '';
}
