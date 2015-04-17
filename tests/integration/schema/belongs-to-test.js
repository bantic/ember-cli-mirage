import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var db, schema, User, Address;
module('mirage:integration:schema:belongsTo', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link'},
      {id: 2, name: 'Zelda'}
    ]);
    db.createCollection('addresses');
    db.addresses.insert([
      {id: 1, user_id: 1, name: '123 Hyrule Way'},
      {id: 2, name: '456 Goron City'}
    ]);
    schema = new Schema(db);

    User = Model.extend();
    Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);
  }
});

test('the child can read the parent model', function(assert) {
  var address = schema.address.find(1);
  var link = schema.user.find(1);

  assert.deepEqual(address.user, link);
});

test('it returns null if no parent model is found', function(assert) {
  var address = schema.address.find(2);

  assert.deepEqual(address.user, null);
});

test('the child can update the parent model', function(assert) {
  var address = schema.address.find(1);
  var link = schema.user.find(1);
  var zelda = schema.user.find(2);

  assert.deepEqual(address.user, link);

  address.user = zelda;

  assert.deepEqual(address.user, zelda);
});

test('the child can create its parent model', function(assert) {
  var address = schema.address.find(1);
  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id);
  assert.deepEqual(ganon, schema.user.find(ganon.id));
  assert.equal(address.user_id, ganon.id);
});
