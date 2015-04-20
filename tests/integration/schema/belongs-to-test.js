import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema;
module('mirage:integration:schema:belongsTo#create', {
  beforeEach: function() {
    var db = new Db();
    db.loadData({
      users: [],
      addresses: [
        {id: 1, name: '123 Hyrule Way'}
      ]
    });
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);
  }
});

test('the child can create its parent model', function(assert) {
  var address = schema.address.find(1);

  assert.equal(address.user, null);
  assert.equal(schema.user.all().length, 0);

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id);
  assert.deepEqual(ganon, schema.user.find(ganon.id));
  assert.equal(address.user_id, ganon.id);
});


var schema, db;
module('mirage:integration:schema:belongsTo#read', {
  beforeEach: function() {
    db = new Db();
    db.loadData({
      users: [
        {id: 1, name: 'Link'},
        {id: 2, name: 'Zelda'}
      ],
      addresses: [
        {id: 1, user_id: 1, name: '123 Hyrule Way'},
        {id: 2, name: '456 Goron City'}
      ]
    });
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
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


var schema, db;
module('mirage:integration:schema:belongsTo#update', {
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

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);
  }
});

test('the child can update the parent model', function(assert) {
  var address = schema.address.find(1);
  var link = schema.user.find(1);
  var zelda = schema.user.find(2);

  assert.deepEqual(address.user, link);

  address.user = zelda;

  assert.deepEqual(address.user, zelda);
  assert.equal(schema.address.find(1).user_id, link.id, "the data hasn't been saved");

  address.save();

  assert.deepEqual(address.user, zelda);
  assert.equal(schema.address.find(1).user.id, zelda.id, "the data was saved");
});
