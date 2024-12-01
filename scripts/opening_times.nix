{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
    nodePackages.npm
  ];

  shellHook = ''
    # Create a temporary npm project if package.json doesn't exist
    if [ ! -f package.json ]; then
      npm init -y
    fi

    # Install required dependencies if they're not already installed
    if [ ! -d node_modules ]; then
      npm install gray-matter axios cheerio
    fi

    # Run the script
    node opening_times.js

    # Exit the shell after the script completes
    exit
  '';
}

