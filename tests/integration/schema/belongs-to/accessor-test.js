import BelongsToHelper from './belongs-to-helper';
import {module, test} from 'qunit';

module('mirage:integration:schema:belongsTo#accessor', {
  beforeEach: function() {
    this.helper = new BelongsToHelper();
  }
});

/*
  #association behavior works regardless of the state of the child
*/

test('a saved child with no parent', function(assert) {
  var [address] = this.helper.savedChildNoParent();

  assert.equal(address.user, null);
  assert.equal(address.user_id, null);
});

test('a saved child with a new parent', function(assert) {
  var [address, user] = this.helper.savedChildNewParent();

  assert.deepEqual(address.user, user);
  assert.deepEqual(address.user_id, null);
});

test('a saved child with a saved parent', function(assert) {
  var [address, user] = this.helper.savedChildSavedParent();

  assert.deepEqual(address.user, user);
  assert.equal(address.user_id, user.id);
});

test('a new child with no parent', function(assert) {
  var [address] = this.helper.newChildNoParent();

  assert.deepEqual(address.user, null);
  assert.deepEqual(address.user_id, null);
});

test('a new child with a new parent', function(assert) {
  var [address, newUser] = this.helper.newChildNewParent();

  assert.deepEqual(address.user, newUser);
  assert.deepEqual(address.user_id, null);
});

test('a new child with a saved parent', function(assert) {
  var [address, savedUser] = this.helper.newChildSavedParent();

  assert.deepEqual(address.user, savedUser);
  assert.deepEqual(address.user_id, 1);
});
