import BelongsToHelper from './belongs-to-helper';
import {module, test} from 'qunit';

module('mirage:integration:schema:belongsTo#createAssociation', {
  beforeEach: function() {
    this.helper = new BelongsToHelper();
  }
});

/*
  createAssociation behavior works regardless of the state of the child
*/

test('a saved child with no parent', function(assert) {
  var address = this.helper.savedChildNoParent();

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id, 'the parent was persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.attrs, {id: 1, name: 'foo', user_id: ganon.id});
});

test('a saved child with a new parent', function(assert) {
  var [address] = this.helper.savedChildNewParent();

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id, 'the parent was persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.attrs, {id: 1, name: 'foo', user_id: ganon.id});
});

test('a saved child with a saved parent', function(assert) {
  var [address] = this.helper.savedChildSavedParent();

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id, 'the parent was persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.attrs, {id: 1, name: 'foo', user_id: ganon.id});
});

test('a new child with no parent', function(assert) {
  var address = this.helper.newChildNoParent();

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id, 'the parent was persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.attrs, {name: 'New addr', user_id: ganon.id});
});

test('a new child with a new parent', function(assert) {
  var [address] = this.helper.newChildNewParent();

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id, 'the parent was persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.attrs, {name: 'New addr', user_id: ganon.id});
});

test('a new child with a saved parent', function(assert) {
  var [address] = this.helper.newChildSavedParent();

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id, 'the parent was persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.attrs, {name: 'New addr', user_id: ganon.id});
});
