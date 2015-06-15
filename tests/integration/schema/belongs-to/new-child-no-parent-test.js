import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, db, link, zelda, address;
module('mirage:integration:schema:belongsTo#new-child-no-parent', {
  beforeEach: function() {
    db = new Db({
      users: [{id: 1, name: 'Link'}],
      addresses: []
    });
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.registerModel('user', User);
    schema.registerModel('address', Address);

    link = schema.user.find(1);
    address = schema.address.new();
  }
});


// Update
test('the child can update its relationship to a saved parent via parent_id', function(assert) {
  address.user_id = 1;

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {user_id: 1});
});

test('the child can update its relationship to a saved parent via parent', function(assert) {
  address.user = link;

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {user_id: 1});
});

test('the child can update its relationship to a new parent via parent', function(assert) {
  var ganon = schema.user.new({name: 'Ganon'});
  address.user = ganon;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, ganon);
  assert.deepEqual(address.attrs, {user_id: null});
});

test('the child can update its relationship to null via parent', function(assert) {
  address.user = null;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {user_id: null});
});
