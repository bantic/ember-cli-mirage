import Model from 'ember-cli-mirage/model';
import Schema from 'ember-cli-mirage/schema';
import Db from 'ember-cli-mirage/db';

module('mirage:model');

test('it can be instantiated', function(assert) {
  var model = new Model();
  assert.ok(model);
});

//test('it cannot be instantiated without a db', function(assert) {
