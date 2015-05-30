'use strict';

var chalk = require('chalk');
var assert = require('assert');
var dust = require('dustjs-linkedin');
var mkdirp = require('mkdirp');
var fs = require('graceful-fs');
var path = require('path');

module.exports = function generate(args) {

  console.info(
    chalk.bold.yellow('\n[Pokemon Generator]') +
    chalk.green(' Beginning generation at ') +
    chalk.bold.green(args.output + '\n')
  );

  // Nodes' require will JSON.parse the pokedex.json file,
  //   converting the JSON into an Array of Objects
  var pokedex = require('../data/pokedex.json');
  // Make sure that pokedex is indeed an Array.
  assert.equal(
    Array.isArray(pokedex), true,
    chalk.bold.red('expected: pokedex.json to return an Array') +
    chalk.bold.yellow(', actual: ' + typeof pokedex)
  );

  var templates = {
    page: fs.readFileSync(path.resolve('./templates/page.dust')).toString(),
    index: fs.readFileSync(path.resolve('./templates/index.dust')).toString(),
    pokemon: fs.readFileSync(path.resolve('./templates/pokemon.dust')).toString()
  };

  var tmpls = {
    page: dust.compile(templates.page, "page"),
    index: dust.compile(templates.index, "index"),
    pokemon: dust.compile(templates.pokemon, "pokemon")
  };

  dust.loadSource(tmpls.page);
  dust.loadSource(tmpls.index);
  dust.loadSource(tmpls.pokemon);

  dust.render("index", {}, function(err, out) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(
      chalk.yellow("['Pokemon Generator'] generating index page")
    );
    fs.writeFileSync(path.resolve('./public/index.html'), out);
  })

  // instantiate but do not set the variables yet
  var html;

  // pokedex is an Array, lets loop through it to access each Pokemon Object within
  pokedex.forEach(function(pokemon) {
    // make sure each pokemon is an object
    assert.equal(
      typeof pokemon, 'object',
      chalk.bold.red('expected:  pokemon to be an object') +
      chalk.bold.yellow(', actual: ' + typeof pokemon)
    );

    // check the properties on the pokemon object
    assert.equal(
      typeof pokemon.name, 'string',
      chalk.bold.red('expected: pokemon.name to be a string') +
      chalk.bold.yellow(', actual: ' + typeof pokemon.string)
    );

    assert.equal(
      typeof pokemon.description, 'string',
      chalk.bold.red('expected: pokemon.description to be a string') +
      chalk.bold.yellow(', actual: ' + typeof pokemon.description)
    );

    // create the directory if it doens't exist
    mkdirp.sync(args.output, { fs: fs });

    dust.render("pokemon", {
      data: pokemon
    }, function(err, out) {
      if (err) {
        return console.error(err);
      }
      // write the html file
      console.info(
        chalk.bold.yellow('[Pokemon Generator]') +
        chalk.bold.green(' writing pokemon file for: ') +
        chalk.bold.blue(pokemon.name + ' ') +
        chalk.blue('at ' + args.output)
      );

      fs.writeFileSync(path.join(args.output, pokemon.name + '.html'), out);
    });
  });
};
