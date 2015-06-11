import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

module('mirage:integration:schema:hasMany#new-child-new-parent', {
  beforeEach: function() {
    var db = new Db({
      users: [],
      addresses: [
        {id: 1, name: '123 Hyrule Way'},
        {id: 2, name: '12 Goron City'},
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

    this.savedChild1 = this.schema.address.find(1);
    this.savedChild2 = this.schema.address.find(2);

    this.newChild = this.schema.address.new({name: '99 Way'});

    this.parent = this.schema.user.new({addresses: [this.newChild]});
  }
});

// Create
test('the parent can create a new saved child model', function(assert) {
  var springfield = this.parent.createAddress({name: '1 Springfield ave'});

  assert.ok(springfield.id, 'the child was persisted');
  assert.equal(springfield.name, '1 Springfield ave');
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[1], springfield);
  assert.deepEqual(this.parent.address_ids, [undefined, springfield.id]);
});

test('the parent can create a new unsaved child model', function(assert) {
  var hudson = this.parent.newAddress({name: '2 Hudson st'});

  assert.ok(!hudson.id, 'the child was not persisted');
  assert.equal(hudson.name, '2 Hudson st');
  assert.deepEqual(this.parent.address_ids, [undefined, undefined]);
});

// Read
test('the parent references its children, and ids are correct', function(assert) {
  assert.equal(this.parent.addresses.length, 1);
  assert.deepEqual(this.parent.addresses[0], this.newChild);
  assert.deepEqual(this.parent.address_ids, [undefined]);
});

// Update
test('the parent can update its relationship to saved children via child_ids', function(assert) {
  this.parent.address_ids = [1, 2];

  assert.deepEqual(this.parent.address_ids, [1, 2]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], this.savedChild1);
  assert.equal(this.savedChild1.user_id, null);

  this.parent.save();
  this.savedChild1.reload();

  assert.ok(this.parent.id);
  assert.deepEqual(this.savedChild1.user_id, this.parent.id);
});

test('the parent can update its relationship to saved children via .children', function(assert) {
  this.parent.addresses = [this.savedChild1, this.savedChild2];

  assert.deepEqual(this.parent.address_ids, [1, 2]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], this.savedChild1);
  assert.equal(this.savedChild1.user_id, null);

  this.parent.save();

  this.savedChild1.reload();

  assert.ok(this.parent.id);
  assert.deepEqual(this.savedChild1.user_id, this.parent.id);
});

test('the parent can update its relationship to new children via .children', function(assert) {
  var newChild1 = this.schema.address.new({name: '1a'});
  var newChild2 = this.schema.address.new({name: '2b'});

  this.parent.addresses = [newChild1, newChild2];

  assert.deepEqual(this.parent.address_ids, [undefined, undefined]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], newChild1);
  assert.equal(newChild1.user_id, null);

  this.parent.save();

  newChild1.reload();

  assert.ok(this.parent.id);
  assert.deepEqual(newChild1.user_id, this.parent.id);
});

test('the parent can update its relationship to a mix of new and saved children via .children', function(assert) {
  var anotherNewChild = this.schema.address.new({name: '1a'});

  this.parent.addresses = [anotherNewChild, this.savedChild1];

  assert.deepEqual(this.parent.address_ids, [undefined, 1]);
  assert.equal(this.parent.addresses.length, 2);
  assert.deepEqual(this.parent.addresses[0], anotherNewChild);
  assert.deepEqual(this.parent.addresses[1], this.savedChild1);
  assert.equal(anotherNewChild.user_id, null);
  assert.equal(this.savedChild1.user_id, null);

  this.parent.save();

  anotherNewChild.reload();
  this.savedChild1.reload();

  assert.ok(this.parent.id);
  assert.deepEqual(anotherNewChild.user_id, this.parent.id);
  assert.deepEqual(this.savedChild1.user_id, this.parent.id);
});

test('the parent can clear its relationship via children', function(assert) {
  this.parent.addresses = null;

  assert.deepEqual(this.parent.address_ids, []);
  assert.deepEqual(this.parent.addresses, []);
});

test('the parent can clear its relationship via null child_ids', function(assert) {
  this.parent.address_ids = null;

  assert.deepEqual(this.parent.address_ids, []);
  assert.equal(this.parent.addresses.length, 0);
});

test('the parent can clear its relationship via [] child_ids', function(assert) {
  this.parent.address_ids = [];

  assert.deepEqual(this.parent.address_ids, []);
  assert.equal(this.parent.addresses.length, 0);
});
