import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

module('mirage:integration:schema:hasMany#saved-parent-saved-child', {
  beforeEach: function() {
    var db = new Db({
      users: [
        {id: 1, name: 'Link'},
      ],
      addresses: [
        {id: 1, name: '123 Hyrule Way', user_id: 1},
        {id: 2, name: '12 Goron City', user_id: 1},
        {id: 3, name: 'Something else'},
        {id: 4, name: 'Another thing'},
      ]
    });
    this.schema = new Schema(db);

    var User = Model.extend({
      addresses: Mirage.hasMany()
    });
    var Address = Model.extend();

    this.schema.registerModels({
      user: User,
      address: Address
    });

    this.parent = this.schema.user.find(1);
    this.child1 = this.schema.address.find(1);
    this.child2 = this.schema.address.find(2);
  }
});

// Create
test('the parent can create a new saved child model', function(assert) {
  var springfield = this.parent.createAddress({name: '1 Springfield ave'});

  assert.ok(springfield.id, 'the child was persisted');
  assert.equal(springfield.name, '1 Springfield ave');
  assert.equal(springfield.user_id, 1);
  assert.equal(this.parent.addresses.length, 3);
  assert.deepEqual(this.parent.addresses[2], springfield);
  assert.deepEqual(this.parent.address_ids, [1, 2, springfield.id]);
});

test('the parent can create a new unsaved child model', function(assert) {
  var hudson = this.parent.newAddress({name: '2 Hudson st'});

  assert.ok(!hudson.id, 'the child was not persisted');
  assert.equal(hudson.name, '2 Hudson st');
  assert.equal(hudson.user_id, 1);
  assert.equal(this.parent.addresses.length, 3);
  assert.deepEqual(this.parent.addresses[2], hudson);
  assert.deepEqual(this.parent.address_ids, [1, 2, undefined]);
});

// Read
test('the parent references its children, and ids are correct', function(assert) {
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], this.child1);
  assert.deepEqual(this.parent.addresses[1], this.child2);
  assert.deepEqual(this.parent.address_ids, [1, 2]);
});

// Update
test('the parent can update its relationship to saved children via child_ids', function(assert) {
  var unrelatedChild1 = this.schema.address.find(3);
  var unrelatedChild2 = this.schema.address.find(4);

  this.parent.address_ids = [3, 4];
  unrelatedChild1.reload();
  unrelatedChild2.reload();
  this.child1.reload();
  this.child2.reload();

  assert.deepEqual(this.parent.address_ids, [3, 4]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], unrelatedChild1);
  assert.deepEqual(this.parent.addresses[1], unrelatedChild2);
  assert.equal(this.child1.user_id, null);
  assert.equal(this.child2.user_id, null);
});

test('the parent can update its relationship to saved children via .children', function(assert) {
  var unrelatedChild1 = this.schema.address.find(3);
  var unrelatedChild2 = this.schema.address.find(4);

  this.parent.addresses = [unrelatedChild1, unrelatedChild2];
  unrelatedChild1.reload();
  unrelatedChild2.reload();
  this.child1.reload();
  this.child2.reload();

  assert.deepEqual(this.parent.address_ids, [3, 4]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], unrelatedChild1);
  assert.deepEqual(this.parent.addresses[1], unrelatedChild2);
  assert.equal(this.child1.user_id, null);
  assert.equal(this.child2.user_id, null);
});

test('the parent can update its relationship to new children via .children', function(assert) {
  var newChild1 = this.schema.address.new({name: '1a'});
  var newChild2 = this.schema.address.new({name: '2b'});

  this.parent.addresses = [newChild1, newChild2];
  newChild1.reload();
  newChild2.reload();
  this.child1.reload();
  this.child2.reload();

  assert.ok(newChild1.id, 'the new child was saved');
  assert.deepEqual(this.parent.address_ids, [newChild1.id, newChild2.id]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], newChild1);
  assert.deepEqual(this.parent.addresses[1], newChild2);
  assert.equal(this.child1.user_id, null);
  assert.equal(this.child2.user_id, null);
});

test('the parent can update its relationship to a mix of new and saved children via .children', function(assert) {
  var unrelatedChild = this.schema.address.find(3);
  var newChild = this.schema.address.new({name: 'abc'});

  this.parent.addresses = [unrelatedChild, newChild];
  unrelatedChild.reload();
  newChild.reload();
  this.child1.reload();
  this.child2.reload();

  assert.ok(newChild.id, 'the new child was saved');
  assert.deepEqual(this.parent.address_ids, [unrelatedChild.id, newChild.id]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], unrelatedChild);
  assert.deepEqual(this.parent.addresses[1], newChild);
  assert.equal(this.child1.user_id, null);
  assert.equal(this.child2.user_id, null);
});

test('the parent can clear its relationship via children', function(assert) {
  this.parent.addresses = null;
  this.child1.reload();
  this.child2.reload();

  assert.deepEqual(this.parent.address_ids, []);
  assert.deepEqual(this.parent.addresses.length, 0);
  assert.equal(this.child1.user_id, null);
  assert.equal(this.child2.user_id, null);
});

test('the parent can clear its relationship via null child_ids', function(assert) {
  this.parent.address_ids = null;
  this.child1.reload();
  this.child2.reload();

  assert.deepEqual(this.parent.address_ids, []);
  assert.equal(this.parent.addresses.length, 0);
  assert.equal(this.child1.user_id, null);
  assert.equal(this.child2.user_id, null);
});

test('the parent can clear its relationship via [] child_ids', function(assert) {
  this.parent.address_ids = [];
  this.child1.reload();
  this.child2.reload();

  assert.deepEqual(this.parent.address_ids, []);
  assert.equal(this.parent.addresses.length, 0);
  assert.equal(this.child1.user_id, null);
  assert.equal(this.child2.user_id, null);
});
