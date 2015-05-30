'use strict';

var chalk = require('chalk');
var watch = require('glob-watcher');
var clean = require('./clean');
var generate = require('./generate');

module.exports = function watch(args) {

  console.log(
    chalk.bold.yellow('[Pokemon Generator]') +
    chalk.green(' watching pokedex.json and template/pokemon.jade for changes')
  );

  watch(['../data/pokedex.json', '../templates/*.dust'], function() {
    console.log(
      chalk.bold.yellow('[Pokemon Generator]') +
      chalk.green(' file changed. Regenerating')
    );
    clean(args);
    generate(args);
  });
}
