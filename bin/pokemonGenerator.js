'use strict';

/*
  Pokemon Static HTML Generator
  - from a pokedex.json and using a pokemon.jade template,
    create static HTML for each Object in the pokedex Array.
*/

var argv = require('minimist')(process.argv.slice(2));
var os = require('osenv');
var assert = require('assert');
var fs = require('graceful-fs');
var glob = require('glob');
var mkdirp = require('mkdirp');
var watch = require('glob-watcher');
var path = require('path');
var jade = require('jade');
var chalk = require('chalk');
var pkg = require('../package.json');

var output = './public/pokemon';

// Parse CLI
if (argv.clean || argv.c)
{
  clean();
}
else if (argv.generate || argv.g) {
  generate();
}
else if (argv.watch || argv.w) {
  watcher();
}
else if (argv.help || argv.h || argv['?'] || (Object.keys(argv).length === 1 && argv._ && argv._.length === 0))
{
  help();
}

function clean() {
  var files = glob.sync(path.join(output, "/*.html"));
  assert.equal(Array.isArray(files), true, chalk.bold.red('expected: files to be an Array') + chalk.bold.yellow(', actual: ' + typeof files));

  files.forEach(function(file) {
    console.info(chalk.bold.yellow('[Pokemon Generator]') + chalk.bold.red(' cleaning pokemon file ') + chalk.bold.blue(file));
    fs.unlinkSync(file);
  });
}

function generate() {

  console.info('\n' + chalk.bold.yellow('[Pokemon Generator]') + chalk.green(' Beginning generation\n'));

  // Nodes' require will JSON.parse the pokedex.json file,
  //   converting the JSON into an Array of Objects
  var pokedex = require('../pokedex.json');
  // Make sure that pokedex is indeed an Array.
  assert.equal(Array.isArray(pokedex), true, chalk.bold.red('expected: pokedex.json to return an Array')+ chalk.bold.yellow(', actual: ' + typeof pokedex));

  // Convert the .jade template into a string of html,
  // the pretty attribute adds double spaces to make the html human readable
  var render = jade.compileFile('./templates/pokemon.jade', {
    pretty: true
  });

  // instantiate but do not set the variables yet
  var html;

  // pokedex is an Array, lets loop through it to access each Pokemon Object within
  pokedex.forEach(function(pokemon) {
    // make sure each pokemon is an object
    assert.equal(typeof pokemon, 'object', chalk.bold.red('expected:  pokemon to be an object') + chalk.bold.yellow(', actual: ' + typeof pokemon));

    // check the properties on the pokemon object
    assert.equal(typeof pokemon.name, 'string', chalk.bold.red('expected: pokemon.name to be a string') + chalk.bold.yellow(', actual: ' + typeof pokemon.string));
    assert.equal(typeof pokemon.description, 'string', chalk.bold.red('expected: pokemon.description to be a string') + chalk.bold.yellow(', actual: ' + typeof pokemon.description));

    // and than output the HTML with the pokemon information
    html = render(pokemon);

    // create the directory if it doens't exist
    mkdirp.sync(output, { fs: fs });

    // write the html file
    console.info(chalk.bold.yellow('[Pokemon Generator]') + chalk.bold.green(' writing pokemon file for: ') + chalk.bold.blue(pokemon.name));
    fs.writeFileSync(path.join(output, pokemon.name + '.html'), html);
  });
}

function watcher() {
  console.log(chalk.bold.yellow('[Pokemon Generator]') + chalk.green(' watching pokedex.json and template/pokemon.jade for changes'));
  watch(['./pokedex.json', './templates/pokemon.jade'], function() {
    console.log(chalk.bold.yellow('[Pokemon Generator]') + chalk.green(' file changed. Regenerating'));
    clean();
    generate();
  });
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
