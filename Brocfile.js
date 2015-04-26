/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

/*
  This Brocfile specifes the options for the dummy test app of this
  addon, located in `/tests/dummy`

  This Brocfile does *not* influence how the addon or the app using it
  behave. You most likely want to be modifying `./index.js` or app's Brocfile
*/

var app = new EmberAddon();

if (app.env !== 'production') {
  app.import(app.bowerDirectory + '/sinonjs/sinon.js', { type: 'test' } );
  // app.import('vendor/sinon-qunit.js', { type: 'test' } );
}

module.exports = app.toTree();
