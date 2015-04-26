import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, link;
module('mirage:integration:schema:belongsTo#instantiate', {
  beforeEach: function() {
    var db = new Db();
    db.loadData({
      users: [
        {id: 1, name: 'Link'}
      ],
      addresses: [
        {id: 1, name: '123 Hyrule Way'}
      ]
    });
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);

    link = schema.user.find(1);
  }
});

test('it accepts a parent id that references a saved parent', function(assert) {
  var address = schema.address.new({user_id: 1});

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {user_id: 1});
});

test('it accepts a null parent id', function(assert) {
  var address = schema.address.new({user_id: null});

  assert.equal(address.user_id, null);
  assert.equal(address.user, null);
  assert.deepEqual(address.attrs, {user_id: null});
});

test('it accepts no reference to a parent id', function(assert) {
  var address = schema.address.new({});

  assert.equal(address.user_id, null);
  assert.equal(address.user, null);
  assert.deepEqual(address.attrs, {user_id: null});
});

test('it accepts a parent model', function(assert) {
  var address = schema.address.new({user: link});

  assert.equal(address.user_id, 1);
  // assert.equal(address.user, link);
  // assert.deepEqual(address.attrs, {user_id: 1});
});

// var schema;
// module('mirage:integration:schema:belongsTo#create', {
//   beforeEach: function() {
//     var db = new Db();
//     db.loadData({
//       users: [],
//       addresses: [
//         {id: 1, name: '123 Hyrule Way'}
//       ]
//     });
//     schema = new Schema(db);

//     var User = Model.extend();
//     var Address = Model.extend({
//       user: Mirage.belongsTo()
//     });

//     schema.register('user', User);
//     schema.register('address', Address);
//   }
// });

// test('the child can build an unsaved parent model', function(assert) {
// });

// test('the child can create its parent model', function(assert) {
//   var address = schema.address.find(1);

//   assert.equal(address.user, null);
//   assert.equal(schema.user.all().length, 0);

//   var ganon = address.createUser({name: 'Ganon'});

//   assert.ok(ganon.id);
//   assert.deepEqual(ganon, schema.user.find(ganon.id));
//   assert.equal(address.user_id, ganon.id);
// });


// var schema, db;
// module('mirage:integration:schema:belongsTo#read', {
//   beforeEach: function() {
//     db = new Db();
//     db.loadData({
//       users: [
//         {id: 1, name: 'Link'},
//         {id: 2, name: 'Zelda'}
//       ],
//       addresses: [
//         {id: 1, user_id: 1, name: '123 Hyrule Way'},
//         {id: 2, name: '456 Goron City'}
//       ]
//     });
//     schema = new Schema(db);

//     var User = Model.extend();
//     var Address = Model.extend({
//       user: Mirage.belongsTo()
//     });

//     schema.register('user', User);
//     schema.register('address', Address);
//   }
// });

// test('the child can read the parent model', function(assert) {
//   var address = schema.address.find(1);
//   var link = schema.user.find(1);

//   assert.deepEqual(address.user, link);
// });

// test('it returns null if no parent model is found', function(assert) {
//   var address = schema.address.find(2);

//   assert.deepEqual(address.user, null);
//   assert.equal(address.user_id, null);
// });


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
