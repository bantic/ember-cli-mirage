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
        {id: 2, name: 'Zelda'}
      ],
      addresses: [
        {id: 1, name: '123 Hyrule Way', user_id: 1},
        {id: 2, name: '12 Goron City', user_id: 1},
      ]
    });
    var schema = new Schema(db);

    var User = Model.extend({
      addresses: Mirage.hasMany()
    });
    var Address = Model.extend();

    schema.registerModels({
      user: User,
      address: Address
    });

    var link = schema.user.find(1);
    var zelda = schema.user.find(2);
    var address = schema.address.find(1);
  }
});

// Create
// test('the child can create a new saved parent', function(assert) {
//   var ganon = address.createUser({name: 'Ganon'});

//   assert.ok(ganon.id, 'the parent was persisted');
//   assert.deepEqual(address.user, ganon);
//   assert.equal(address.user_id, ganon.id);
//   assert.deepEqual(address.attrs, {id: 1, user_id: ganon.id});
// });

// test('the child can create a new unsaved parent', function(assert) {
//   var ganon = address.newUser({name: 'Ganon'});

//   assert.ok(!ganon.id, 'the parent was not persisted');
//   assert.deepEqual(address.user, ganon);
//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.attrs, {id: 1, user_id: null});
// });

// // Read
// test('the child references the model, and its foreign key is correct', function(assert) {
//   assert.deepEqual(address.user, link);
//   assert.equal(address.user_id, 1);
//   assert.deepEqual(address.attrs, {id: 1, user_id: 1});
// });

// // Update
// test('the child can update its relationship to a saved parent via parent_id', function(assert) {
//   address.user_id = 2;

//   assert.equal(address.user_id, 2);
//   assert.deepEqual(address.user, zelda);
//   assert.deepEqual(address.attrs, {id: 1, user_id: 2});
// });

// test('the child can update its relationship to a saved parent via parent', function(assert) {
//   address.user = zelda;

//   assert.equal(address.user_id, 2);
//   assert.deepEqual(address.user, zelda);
//   assert.deepEqual(address.attrs, {id: 1, user_id: 2});
// });

// test('the child can update its relationship to a new parent via parent', function(assert) {
//   var ganon = schema.user.new({name: 'Ganon'});
//   address.user = ganon;

//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.user, ganon);
//   assert.deepEqual(address.attrs, {id: 1, user_id: null});
// });

// test('the child can update its relationship to null via parent_id', function(assert) {
//   address.user_id = null;

//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.user, null);
//   assert.deepEqual(address.attrs, {id: 1, user_id: null});
// });

// test('the child can update its relationship to null via parent', function(assert) {
//   address.user = null;

//   assert.equal(address.user_id, null);
//   assert.deepEqual(address.user, null);
//   assert.deepEqual(address.attrs, {id: 1, user_id: null});
// });
