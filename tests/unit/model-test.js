import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';

module('mirage:model');

test('it can be instantiated', function(assert) {
  var db = new Db();
  var schema = new Schema(db);
  var model = new Model(schema);
  assert.ok(model);
});

test('it cannot be instantiated without a schema', function(assert) {
  assert.throws(function() {
    new Model();
  }, /requires a schema/);
});

module('mirage:model#save');

test('new models can be saved', function(assert) {
  var db = new Db();
  db.createCollection('users');
  db.createCollection('addresses');
  var schema = new Schema(db);

  var User = Model.extend();
  var Address = Model.extend();

  schema.register('user', User);
  schema.register('address', Address);

  var user = schema.user.new({name: 'Link'});
  // debugger;
  var user = new User(schema, {name: '123 Hyrule Way'});
  // var address = new Address(schema, {name: '123 Hyrule Way'});

  // assert.deepEqual(user.attrs, {name: 'Link'});
  // assert.deepEqual(address.attrs, {name: '123 Hyrule Way'});

  user.save();
  // address.save();

  // assert.deepEqual(user.attrs, {id: 1, name: 'Link'});
  // assert.deepEqual(address.attrs, {id: 1, name: '123 Hyrule Way'});
});
