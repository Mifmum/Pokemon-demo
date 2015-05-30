'use strict';

var glob = require('glob');
var fs = require('graceful-fs');
var assert = require('assert');
var path = require('path');
var chalk = require('chalk');

module.exports = function clean(args) {
    var files = glob.sync(path.join(args.output, "/*.html"));

    assert.equal(
      Array.isArray(files), true,
      chalk.bold.red('expected: files to be an Array') +
      chalk.bold.yellow(', actual: ' + typeof files)
    );

    files.forEach(function(file) {
      console.info(
        chalk.bold.yellow('[Pokemon Generator]') +
        chalk.bold.red(' cleaning pokemon file ') +
        chalk.bold.blue(file)
      );
      fs.unlinkSync(file);
    });
};
