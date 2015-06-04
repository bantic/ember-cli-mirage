import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, db, child1, child2, newChild, parent;
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
    parent = schema.user.new({addresses: [newChild]});
  }
});

// Create
test('the parent can create a new saved child model', function(assert) {
  var springfield = parent.createAddress({name: '1 Springfield ave'});

  assert.ok(springfield.id, 'the child was persisted');
  assert.equal(springfield.name, '1 Springfield ave');
  assert.deepEqual(parent.address_ids, [undefined, springfield.id]);
});

test('the parent can create a new unsaved child model', function(assert) {
  var hudson = parent.newAddress({name: '2 Hudson st'});

  assert.ok(!hudson.id, 'the child was not persisted');
  assert.equal(hudson.name, '2 Hudson st');
  assert.deepEqual(parent.address_ids, [undefined, undefined]);
});

// Read
test('the parent references the model', function(assert) {
  assert.deepEqual(parent.addresses, [newChild]);
  assert.deepEqual(parent.address_ids, [undefined]);
});

// Update
test('the parent can update its relationship to saved children via child_ids', function(assert) {
  parent.address_ids = [1, 2];

  assert.deepEqual(parent.address_ids, [1, 2]);
  assert.equal(parent.addresses.length, 2);
  assert.deepEqual(parent.addresses[0], child1);
  assert.notDeepEqual(child1.address, parent, 'the child wasnt saved');

  // parent.save();

  // assert.deepEqual(child1.address, parent);
});

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
