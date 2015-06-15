import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

module('mirage:integration:schema:belongsTo#accessor', {
  beforeEach: function() {
    this.db = new Db();
    this.schema = new Schema(this.db);

    var User = Model;
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    this.schema.registerModels({
      user: User,
      address: Address
    });
  }
});

/*
  #association behavior works regardless of the state of the child
*/

test('a saved child with no parent', function(assert) {
  this.db.loadData({
    users: [],
    addresses: [
      {id: 1, name: 'foo'},
    ]
  });
  var address = this.schema.address.find(1);

  assert.equal(address.user, null);
});

test('a saved child with a new parent', function(assert) {
  this.db.loadData({
    users: [],
    addresses: [
      {id: 1, name: 'foo'},
    ]
  });
  var address = this.schema.address.find(1);
  var newUser = this.schema.user.new({name: 'Newbie'});
  address.user = newUser;

  assert.deepEqual(address.user, newUser);
});

test('a saved child with a saved parent', function(assert) {
  this.db.loadData({
    users: [
      {id: 1, name: 'some user'},
    ],
    addresses: [
      {id: 1, name: 'foo', user_id: 1},
    ]
  });
  var address = this.schema.address.find(1);
  var user = this.schema.user.find(1);

  assert.deepEqual(address.user, user);
});

// test('a new child with no parent', function(assert) {
//   this.db.loadData({
//     users: [],
//     addresses: []
//   });
//   var address = this.schema.address.new({name: 'New addr'});

//   var ganon = address.newUser({name: 'Ganon'});

//   assert.ok(!ganon.id, 'the parent was not persisted');
//   assert.deepEqual(address.user, ganon);
//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.attrs, {name: 'New addr', user_id: null});
// });

// test('a new child with a new parent', function(assert) {
//   this.db.loadData({
//     users: [],
//     addresses: []
//   });
//   var address = this.schema.address.new({name: 'New addr'});
//   address.user = this.schema.user.new({name: 'Newbie'});

//   var ganon = address.newUser({name: 'Ganon'});

//   assert.ok(!ganon.id, 'the parent was not persisted');
//   assert.deepEqual(address.user, ganon);
//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.attrs, {name: 'New addr', user_id: null});
// });

// test('a new child with a saved parent', function(assert) {
//   this.db.loadData({
//     users: [
//       {id: 1, name: 'some user'}
//     ],
//     addresses: []
//   });
//   var address = this.schema.address.new({name: 'New addr'});
//   address.user = this.schema.user.find(1);

//   var ganon = address.newUser({name: 'Ganon'});

//   assert.ok(!ganon.id, 'the parent was not persisted');
//   assert.deepEqual(address.user, ganon);
//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.attrs, {name: 'New addr', user_id: null});
// });
