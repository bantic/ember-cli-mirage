import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, db, link, zelda, address;
module('mirage:integration:schema:belongsTo updating the relationship of a saved model with a saved parent', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link'},
      {id: 2, name: 'Zelda'}
    ]);
    db.createCollection('addresses');
    db.addresses.insert([
      {id: 1, user_id: 1}
    ]);
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);

    link = schema.user.find(1);
    zelda = schema.user.find(2);
    address = schema.address.find(1);
  }
});

test('it can update its relationship to a saved parent via parent_id', function(assert) {
  address.user_id = 2;

  assert.equal(address.user_id, 2);
  assert.deepEqual(address.user, zelda);
  assert.deepEqual(address.attrs, {id: 1, user_id: 2});
});

test('it can update its relationship to a saved parent via parent', function(assert) {
  address.user = zelda;

  assert.equal(address.user_id, 2);
  assert.deepEqual(address.user, zelda);
  assert.deepEqual(address.attrs, {id: 1, user_id: 2});
});

test('it can update its relationship to a new parent via parent', function(assert) {
  var ganon = schema.user.new({name: 'Ganon'});
  address.user = ganon;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, ganon);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

test('it can update its relationship to null via parent_id', function(assert) {
  address.user_id = null;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

test('it can update its relationship to null via parent', function(assert) {
  address.user = null;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});



// --- older

// var schema, db;
// module('mirage:integration:schema:belongsTo#update', {
//   beforeEach: function() {
//     db = new Db();
//     db.createCollection('users');
//     db.users.insert([
//       {id: 1, name: 'Link'},
//       {id: 2, name: 'Zelda'}
//     ]);
//     db.createCollection('addresses');
//     db.addresses.insert([
//       {id: 1, user_id: 1, name: '123 Hyrule Way'},
//       {id: 2, name: '456 Goron City'}
//     ]);
//     schema = new Schema(db);

//     var User = Model.extend();
//     var Address = Model.extend({
//       user: Mirage.belongsTo()
//     });

//     schema.register('user', User);
//     schema.register('address', Address);
//   }
// });

// test('a child with an old parent can update its parent to a new saved model', function(assert) {
//   var address = schema.address.find(1);
//   var link = schema.user.find(1);
//   var zelda = schema.user.find(2);

//   assert.deepEqual(address.user, link);

//   address.user = zelda;

//   assert.deepEqual(address.user, zelda);
//   assert.equal(schema.address.find(1).user_id, link.id, "the data hasn't been saved");

//   address.save();

//   assert.deepEqual(address.user, zelda);
//   assert.equal(schema.address.find(1).user.id, zelda.id, "the data was saved");
// });

// test('a child with no parent can update its parent to a new saved model', function(assert) {
//   var address = schema.address.find(2);
//   var link = schema.user.find(1);

//   assert.equal(address.user, null);
//   assert.deepEqual(address.attrs, {id: 2, name: '456 Goron City', user_id: null});

//   address.user = link;

//   assert.deepEqual(address.user, link);
//   assert.equal(schema.address.find(2).user_id, null, "the data hasn't been saved");

//   address.save();

//   assert.deepEqual(address.user, link);
//   assert.deepEqual(address.attrs, {id: 2, name: '456 Goron City', user_id: link.id});
//   assert.equal(schema.address.find(2).user.id, link.id, "the data was saved");
// });

// test('a child with an old parent can set its parent to an unsaved model', function(assert) {
//   var address = schema.address.find(1);
//   var link = schema.user.find(1);
//   var youngLink = schema.user.new({name: 'Young link'});

//   assert.deepEqual(address.user, link);

//   address.user = youngLink;

//   assert.deepEqual(address.user, youngLink, 'address has a reference to new user');
//   assert.equal(schema.address.find(1).user_id, link.id, "...but the address hasn't changed in the db");

//   youngLink.save();

//   assert.ok(youngLink.id, 'new user was saved to db');
//   // assert.equal(address.user_id, youngLink.id, 'the id was updated on the instance');
//   // assert.deepEqual(address.user, youngLink, 'address still has reference to the new user');
//   // assert.equal(schema.address.find(1).user_id, link.id, "...but the address still hasn't been updated in the db");

//   // address.save();

//   // assert.deepEqual(address.user, youngLink);
//   // assert.equal(schema.address.find(1).user.id, youngLink.id, "and saved in the db");
// });
