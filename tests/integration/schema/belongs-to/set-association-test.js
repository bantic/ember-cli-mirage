import BelongsToHelper from './belongs-to-helper';
import {module, test} from 'qunit';

module('mirage:integration:schema:belongsTo#setAssociation', {
  beforeEach: function() {
    this.helper = new BelongsToHelper();
  }
});

/*
  the child can update its relationship to a saved parent (regardless of its state)
*/

[
  'savedChildNoParent',
  'savedChildNewParent',
  'savedChildSavedParent',
  'newChildNoParent',
  'newChildNewParent',
  'newChildSavedParent',
].forEach(state => {

  test(`a ${state} can update its association to a saved parent`, function(assert) {
    var [address] = this.helper[state]();
    var savedUser = this.helper.savedParent();

    address.user = savedUser;

    assert.equal(address.user_id, savedUser.id);
    assert.deepEqual(address.user, savedUser);
  });

  test(`a ${state} can update its association to a new parent`, function(assert) {
    var [address] = this.helper[state]();
    var newUser = this.helper.newParent();

    address.user = newUser;

    assert.equal(address.user_id, null);
    assert.deepEqual(address.user, newUser);
  });

  test(`a ${state} can update its association to a null parent`, function(assert) {
    var [address] = this.helper[state]();

    address.user = null;

    assert.equal(address.user_id, null);
    assert.deepEqual(address.user, null);
  });

});
