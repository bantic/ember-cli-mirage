import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';

module('mirage:model');

test('it can be instantiated', function(assert) {
  var db = new Db();
  var schema = new Schema(db);
  var model = new Model(schema, 'user');
  assert.ok(model);
});

test('it cannot be instantiated without a schema', function(assert) {
  assert.throws(function() {
    new Model();
  }, /requires a schema/);
});

test('it cannot be instantiated without a type', function(assert) {
  var db = new Db();
  var schema = new Schema(db);
  assert.throws(function() {
    new Model(schema);
  }, /requires a type/);
});

var db, schema, User;
module('mirage:model#attrs', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link', evil: false}
    ]);
    schema = new Schema(db);
    User = Model.extend();
    schema.register('user', User);
  }
});

test('attrs returns the models attributes', function(assert) {
  var user = new User(schema, 'user', db.users.find(1));

  assert.deepEqual(user.attrs, {id: 1, name: 'Link', evil: false});
});

test('attributes can be read via plain property access', function(assert) {
  var user = new User(schema, 'user', db.users.find(1));

  assert.equal(user.name, 'Link');
});

test('setting an attribute updates a models attrs', function(assert) {
  var user = new User(schema, 'user', db.users.find(1));

  user.name = 'Young link';

  assert.deepEqual(user.attrs, {id: 1, name: 'Young link', evil: false});
});

var db, schema, User, Address;
module('mirage:model#save', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link', evil: false}
    ]);
    db.createCollection('addresses');
    schema = new Schema(db);

    User = Model.extend();
    Address = Model.extend();

    schema.register('user', User);
    schema.register('address', Address);
  }
});

test('new models can be saved', function(assert) {
  var user = new User(schema, 'user', {name: 'Zelda'});
  var address = new Address(schema, 'address', {name: '123 Hyrule Way'});

  assert.deepEqual(user.attrs, {name: 'Zelda'});
  assert.deepEqual(address.attrs, {name: '123 Hyrule Way'});

  user.save();
  address.save();

  assert.deepEqual(user.attrs, {id: 2, name: 'Zelda'});
  assert.deepEqual(address.attrs, {id: 1, name: '123 Hyrule Way'});
});

test('saving an updated model updates the database', function(assert) {
  var link = new User(schema, 'user', db.users.find(1));

  assert.deepEqual(link.attrs, {id: 1, name: 'Link', evil: false});

  link.evil = true;

  assert.deepEqual(db.users.find(1), {id: 1, name: 'Link', evil: false});

  link.save();

  assert.deepEqual(db.users.find(1), {id: 1, name: 'Link', evil: true});
});

var db, schema, User, Address;
module('mirage:model#update', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link', evil: false}
    ]);
    schema = new Schema(db);

    User = Model.extend();

    schema.register('user', User);
  }
});

test('can update a single attr', function(assert) {
  var link = new User(schema, 'user', db.users.find(1));

  assert.deepEqual(link.attrs, {id: 1, name: 'Link', evil: false});

  link.update('evil', true);
  assert.deepEqual(db.users.find(1), {id: 1, name: 'Link', evil: true});
});

test('can update a hash of attrs', function(assert) {
  var link = new User(schema, 'user', db.users.find(1));

  assert.deepEqual(link.attrs, {id: 1, name: 'Link', evil: false});

  link.update({name: 'Evil link', evil: true});
  assert.deepEqual(db.users.find(1), {id: 1, name: 'Evil link', evil: true});
});

var db, schema, User, Address;
module('mirage:model#destroy', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link', evil: false}
    ]);
    schema = new Schema(db);

    User = Model.extend();

    schema.register('user', User);
  }
});

test('removes the record from the db', function(assert) {
  var link = new User(schema, 'user', db.users.find(1));

  assert.deepEqual(link.attrs, {id: 1, name: 'Link', evil: false});

  link.destroy()

  assert.deepEqual(db.users.find(1), null);
  assert.deepEqual(db.users.all(), []);
});
