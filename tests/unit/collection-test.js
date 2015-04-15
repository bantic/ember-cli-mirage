import Collection from 'ember-cli-mirage/orm/collection';
import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

module('mirage:collection');

test('it can be instantiated', function(assert) {
  var collection = new Collection();
  assert.ok(collection);
});

var db, collection;
module('mirage:collection#update', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    var schema = new Schema(db);

    var User = Model.extend();
    schema.register('user', User);

    collection = new Collection([
      schema.user.create({name: 'Link', location: 'Hyrule', evil: false}),
      schema.user.create({name: 'Zelda', location: 'Hyrule', evil: false}),
    ]);
  }
});

test('it can update its models with a key and value', function(assert) {
  assert.deepEqual(db.users.all(), [
    {id: 1, name: 'Link', location: 'Hyrule', evil: false},
    {id: 2, name: 'Zelda', location: 'Hyrule', evil: false},
  ]);

  collection.update('evil', true);

  assert.deepEqual(db.users.all(), [
    {id: 1, name: 'Link', location: 'Hyrule', evil: true},
    {id: 2, name: 'Zelda', location: 'Hyrule', evil: true},
  ]);
  assert.deepEqual(collection[0].attrs, {id: 1, name: 'Link', location: 'Hyrule', evil: true});
  assert.deepEqual(collection[1].attrs, {id: 2, name: 'Zelda', location: 'Hyrule', evil: true});
});

test('it can update its models with a hash of attrs', function(assert) {
  assert.deepEqual(db.users.all(), [
    {id: 1, name: 'Link', location: 'Hyrule', evil: false},
    {id: 2, name: 'Zelda', location: 'Hyrule', evil: false},
  ]);

  collection.update({location: 'The water temple', evil: true});

  assert.deepEqual(db.users.all(), [
    {id: 1, name: 'Link', location: 'The water temple', evil: true},
    {id: 2, name: 'Zelda', location: 'The water temple', evil: true},
  ]);
  assert.deepEqual(collection[0].attrs, {id: 1, name: 'Link', location: 'The water temple', evil: true});
  assert.deepEqual(collection[1].attrs, {id: 2, name: 'Zelda', location: 'The water temple', evil: true});
});

var db, collection;
module('mirage:collection#destroy', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    var schema = new Schema(db);

    var User = Model.extend();
    schema.register('user', User);

    collection = new Collection([
      schema.user.create({name: 'Link', location: 'Hyrule', evil: false}),
      schema.user.create({name: 'Zelda', location: 'Hyrule', evil: false}),
    ]);
  }
});

test('it can destroy its models', function(assert) {
  assert.deepEqual(db.users.all(), [
    {id: 1, name: 'Link', location: 'Hyrule', evil: false},
    {id: 2, name: 'Zelda', location: 'Hyrule', evil: false},
  ]);

  collection.destroy();

  assert.deepEqual(db.users.all(), []);
});
