'use strict';

/*

  Pokemon Static HTML Generator
  - from a pokedex.json and using a pokemon.jade template,
    create static HTML for each Object in the pokedex Array.

    Usage:

    running the script via node from Pokemon-demo `node ./bin/pokemonGenerator.js`

    Option
    --output, -o determin the output location (default ./public/pokemon)

*/

var argv = require('minimist')(process.argv.slice(2));
var os = require('osenv');
var assert = require('assert');
var fs = require('graceful-fs');
var path = require('path');
var jade = require('jade');

console.info('[Pokemon Generator] Beginning generation');

// Nodes' require will JSON.parse the pokedex.json file,
//   converting the JSON into an Array of Objects
var pokedex = require('../pokedex.json');
// Make sure that pokedex is indeed an Array.
assert.equal(Array.isArray(pokedex), true, 'expected: pokedex.json to return an Array, actual: ' + typeof pokedex);


var render = jade.compileFile('./templates/pokemon.jade', {
  pretty: true
});

// instantiate but do not set the variables yet
var html;
var output = (argv.output || argv.o) || './public/pokemon';

// pokedex is an Array, lets loop through it to access each Pokemon Object within
pokedex.forEach(function(pokemon) {
  // make sure each pokemon is an object
  assert.equal(typeof pokemon, 'object', 'expected:  pokemon to be an object, actual: ' + typeof pokemon);

  // check the properties on the pokemon object
  assert.equal(typeof pokemon.name, 'string', 'expected: pokemon.name to be a string, actual: ' + typeof pokemon.string);
  assert.equal(typeof pokemon.description, 'string', 'expected: pokemon.description to be a string, actual: ' + typeof pokemon.description);

  // and than output the HTML with the pokemon information
  html = render(pokemon);

  // write the html file
  console.info('[Pokemon Generator] writing pokemon file for: ' + pokemon.name);
  fs.writeFileSync(path.join(output, pokemon.name + '.html'), html);
});
