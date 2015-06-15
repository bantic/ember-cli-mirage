import BelongsToHelper from './belongs-to-helper';
import {module, test} from 'qunit';

module('mirage:integration:schema:belongsTo#newAssociation', {
  beforeEach: function() {
    this.helper = new BelongsToHelper();
  }
});

/*
  newAssociation behavior works regardless of the state of the child
*/

test('a saved child with no parent', function(assert) {
  var address = this.helper.savedChildNoParent();

  var ganon = address.newUser({name: 'Ganon'});

  assert.ok(!ganon.id, 'the parent was not persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {id: 1, name: 'foo', user_id: null});

  address.save();

  assert.ok(ganon.id, 'saving the child persists the parent');
  assert.ok(address.user_id, ganon.id, 'the childs fk was updated');
});

test('a saved child with a new parent', function(assert) {
  var [address] = this.helper.savedChildNewParent();

  var ganon = address.newUser({name: 'Ganon'});

  assert.ok(!ganon.id, 'the parent was not persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {id: 1, name: 'foo', user_id: null});

  address.save();

  assert.ok(ganon.id, 'saving the child persists the parent');
  assert.ok(address.user_id, ganon.id, 'the childs fk was updated');
});

test('a saved child with a saved parent', function(assert) {
  var [address] = this.helper.savedChildSavedParent();

  var ganon = address.newUser({name: 'Ganon'});

  assert.ok(!ganon.id, 'the parent was not persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {id: 1, name: 'foo', user_id: null});

  address.save();

  assert.ok(ganon.id, 'saving the child persists the parent');
  assert.ok(address.user_id, ganon.id, 'the childs fk was updated');
});

test('a new child with no parent', function(assert) {
  var address = this.helper.newChildNoParent();

  var ganon = address.newUser({name: 'Ganon'});

  assert.ok(!ganon.id, 'the parent was not persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {name: 'New addr', user_id: null});

  address.save();

  assert.ok(ganon.id, 'saving the child persists the parent');
  assert.ok(address.user_id, ganon.id, 'the childs fk was updated');
});

test('a new child with a new parent', function(assert) {
  var [address] = this.helper.newChildNewParent();

  var ganon = address.newUser({name: 'Ganon'});

  assert.ok(!ganon.id, 'the parent was not persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {name: 'New addr', user_id: null});

  address.save();

  assert.ok(ganon.id, 'saving the child persists the parent');
  assert.ok(address.user_id, ganon.id, 'the childs fk was updated');
});

test('a new child with a saved parent', function(assert) {
  var [address] = this.helper.newChildSavedParent();

  var ganon = address.newUser({name: 'Ganon'});

  assert.ok(!ganon.id, 'the parent was not persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {name: 'New addr', user_id: null});

  address.save();

  assert.ok(ganon.id, 'saving the child persists the parent');
  assert.ok(address.user_id, ganon.id, 'the childs fk was updated');
});
