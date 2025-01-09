{
  description = "vegan-prestwich";
  inputs = {
    flake-utils.url = "github:numtide/flake-utils/11707dc2f618dd54ca8739b309ec4fc024de578b?narHash=sha256-l0KFg5HjrsfsO/JpG%2Br7fRrqm12kzFHyUHqHCVpMMbI%3D";
  };
  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        nodeDeps = import ./node-deps.nix { inherit pkgs; };
        inherit (nodeDeps) packageJSON nodeModules;
        projectName = builtins.baseNameOf ./.;

        commonBuildInputs = with pkgs; [
          djlint
          rubyPackages_3_4.htmlbeautifier
          sass
          vscode-langservers-extracted
          yarn
          yarn2nix
        ];

        setupNodeModules = ''
          rm -rf node_modules package.json
          ln -sf ${packageJSON} package.json
          ln -sf ${nodeModules}/node_modules .
        '';

        siteDrv = pkgs.stdenv.mkDerivation {
          name = projectName;

          src = builtins.filterSource (
            path: type:
            !(builtins.elem (baseNameOf path) [
              "_site"
              "node_modules"
              ".git"
            ])
          ) ./.;

          nativeBuildInputs =
            with pkgs;
            [
              cacert
              lightningcss
            ]
            ++ commonBuildInputs;

          configurePhase = ''
            export HOME=$TMPDIR
            mkdir -p _site/style
            ${setupNodeModules}
          '';

          buildPhase = ''
            ${./bin/build}
          '';

          installPhase = ''
            mkdir -p $out
            cp -r _site/* $out/
            rm -rf node_modules _site package.json
          '';
        };

        mkScript =
          name:
          (pkgs.writeScriptBin name (builtins.readFile ./bin/${name})).overrideAttrs (old: {
            buildCommand = "${old.buildCommand}\n patchShebangs $out";
          });

        mkPackage =
          name:
          pkgs.symlinkJoin {
            inherit name;
            paths = [ (mkScript name) ] ++ commonBuildInputs;
            buildInputs = [ pkgs.makeWrapper ];
            postBuild = "wrapProgram $out/bin/${name} --prefix PATH : $out/bin";
          };

        scripts = [
          "build"
          "serve"
        ];

        scriptPackages = builtins.listToAttrs (
          map (name: {
            inherit name;
            value = mkPackage name;
          }) scripts
        );

      in
      {
        defaultPackage = siteDrv;
        packages = scriptPackages // {
          site = siteDrv;
        };

        devShells = rec {
          default = dev;
          dev = pkgs.mkShell {
            buildInputs = commonBuildInputs ++ (builtins.attrValues scriptPackages);
            shellHook = ''
              ${setupNodeModules}
              echo "Development environment ready!"
              echo "Run 'serve' to start development server"
              echo "Run 'build' to build the site in the _site directory"
            '';
          };
        };
      }
    );
}
