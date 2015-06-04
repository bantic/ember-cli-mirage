import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, db, child1, child2, newChild, newParent;
module('mirage:integration:schema:hasMany#new-child-new-parent', {
  beforeEach: function() {
    db = new Db({
      users: [],
      addresses: [
        {id: 1, name: '123 Hyrule Way'},
        {id: 2, name: '12 Goron City'},
      ]
    });
    schema = new Schema(db);

    var User = Model.extend({
      addresses: Mirage.hasMany()
    });
    var Address = Model.extend();

    schema.registerModels({
      user: User,
      address: Address
    });

    child1 = schema.address.find(1);
    child2 = schema.address.find(2);
    newChild = schema.address.new({name: '99 Way'});
    newParent = schema.user.new({addresses: [newChild]});
  }
});

// Create
test('the parent can create a new saved child model', function(assert) {
  var newSavedChild = newParent.createAddress({name: 'Lorem ipsum'});

  assert.ok(newSavedChild.id, 'the child was persisted');
  assert.equal(newSavedChild.name, 'Lorem ipsum');
  assert.deepEqual(newParent.address_ids, [undefined, newSavedChild.id]);
});

// test('the child can create a new unsaved parent model', function(assert) {
//   var ganon = address.newUser({name: 'Ganon'});

//   assert.ok(!ganon.id, 'the parent was not persisted');
//   assert.deepEqual(address.user, ganon);
//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.attrs, {user_id: null});
// });

// Read
test('the parent references the model', function(assert) {
  assert.deepEqual(newParent.addresses, [newChild]);
  assert.deepEqual(newParent.address_ids, [undefined]);
});

// // Update
// test('the child can update its relationship to a saved parent via parent_id', function(assert) {
//   address.user_id = 1;

//   assert.equal(address.user_id, 1);
//   assert.deepEqual(address.user, link);
//   assert.deepEqual(address.attrs, {user_id: 1});
// });

// test('the child can update its relationship to a saved parent via parent', function(assert) {
//   address.user = link;

//   assert.equal(address.user_id, 1);
//   assert.deepEqual(address.user, link);
//   assert.deepEqual(address.attrs, {user_id: 1});
// });

// test('the child can update its relationship to a new parent via parent', function(assert) {
//   var ganon = schema.user.new({name: 'Ganon'});
//   address.user = ganon;

//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.user, ganon);
//   assert.deepEqual(address.attrs, {user_id: null});
// });

// test('the child can update its relationship to null via parent', function(assert) {
//   address.user = null;

//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.user, null);
//   assert.deepEqual(address.attrs, {user_id: null});
// });
