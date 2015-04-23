import Model from 'ember-cli-mirage/orm/model';
import {module, test} from 'qunit';

module('mirage:model');

test('it can be instantiated', function(assert) {
  var model = new Model({}, 'user');
  assert.ok(model);
});

test('it cannot be instantiated without a schema', function(assert) {
  assert.throws(function() {
    new Model();
  }, /requires a schema/);
});

test('it cannot be instantiated without a type', function(assert) {
  assert.throws(function() {
    new Model({});
  }, /requires a type/);
});

test('it can get passed-in attrs', function(assert) {
  var model = new Model({}, 'user', {name: 'Sam'});

  assert.equal(model.name, 'Sam');
});

test('defineAttribute adds an attr to the attrs hash with a value of null', function(assert) {
  var model = new Model({}, 'user', {firstName: 'Sam'});

  model.defineAttribute('lastName');
  assert.deepEqual(model.attrs, {firstName: 'Sam', lastName: null});
});
