# VeganPrestwich.co.uk

We want to catalog the best places for vegan food and vegan-friendly shops in Prestwich.

Feel free to make a pull request, or join the discussion on [Facebook](https://www.facebook.com/groups/veganprestwich/)

* [VeganPrestwich.co.uk](https://veganprestwich.co.uk)
* [Facebook Group](https://www.facebook.com/groups/veganprestwich/)
* [Instagram Page](https://www.instagram.com/veganprestwich/)

## Building This Site

This site is built with [Eleventy](https://www.11ty.dev) and deployed using [Nix / Nixos](https://nixos.org/)

### default.nix [(link)](https://git.chobble.com/chobble/vegan-prestwich/src/branch/master/default.nix)

- deletes `_site` folder
- creates `_site/style`
- compiles the SCSS in `style` to CSS in `_site/style`
- minifies and adds vendor prefixes to the CSS using `lightningcss`
- builds the site to HTML using Eleventy, into `_site`
- minifies the HTML using `html-minifier`
- copies the output to `$out`

### shell.nix [(link)](https://git.chobble.com/chobble/vegan-prestwich/src/branch/master/shell.nix)

- if you call `serve`:
  - deletes `_site` folder
  - creates `_site/style`
  - compiles the SCSS in `style` to CSS in `_site/style`
  - builds the site to HTML using Eleventy, into `_site`
  - serves it up on http://localhost:8080
- if you call `upgrade_deps`:
  - upgrades the `yarn.lock` file to the latest version of Eleventy
