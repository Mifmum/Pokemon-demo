'use strict';

/*
  Pokemon Static HTML Generator
  - from a pokedex.json and using a pokemon.jade template,
    create static HTML for each Object in the pokedex Array.
*/

var argv = require('minimist')(process.argv.slice(2));
var assert = require('assert');
var pkg = require('../package.json');
var path = require('path');
var clean = require('../lib/clean');
var generate = require('../lib/generate');
var watch = require('../lib/watch');

var args = {};

// Parse CLI Args
if ((argv.output || argv.o))
{
  args.output = path.resolve((argv.output || argv.o));
} else {
  args.output = path.resolve('./public/pokemon');
}

// Parse CLI Commands
if (argv.clean || argv.c)
{
  clean(args);
}
else if (argv.generate || argv.g)
{
  generate(args);
}
else if (argv.watch || argv.w)
{
  watch(args);
}
else if (argv.help || argv.h || argv['?'] || (Object.keys(argv).length === 1 && argv._ && argv._.length === 0))
{
  help();
}

function help() {
  console.log([
    "",
    chalk.bold.yellow("[Pokemon Generator]"),
    chalk.bold.gray("- version ") + pkg.version,
    "",
    chalk.bold.gray("Options"),
    chalk.bold.gray("======="),
    "",
    chalk.bold.green("--clean, -c") +  chalk.green(" clean the public/pokemon directory of HTML files"),
    chalk.bold.green("--generate, -g") +  chalk.green(" generate the HTML using the pokedex.json and pokemon.jade template"),
    chalk.bold.green("--watch, -w") + chalk.green(" watch the pokemon.jade template and the pokedex.json files for changes and upon a change event, call generate()"),
    ""
  ].join("\n"));
}
