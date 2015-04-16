import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import hasMany from 'ember-cli-mirage/orm/relations/has-many';
import {module, test} from 'qunit';

module('mirage:model');

test('it can be instantiated', function(assert) {
  var db = new Db();
  var schema = new Schema(db);
  var model = new Model(schema, 'user');
  assert.ok(model);
});

test('it cannot be instantiated without a schema', function(assert) {
  assert.throws(function() {
    new Model();
  }, /requires a schema/);
});

test('it cannot be instantiated without a type', function(assert) {
  var db = new Db();
  var schema = new Schema(db);
  assert.throws(function() {
    new Model(schema);
  }, /requires a type/);
});




// var db, schema, User, Address;
// module('mirage:model#hasMany', {
//   beforeEach: function() {
//     db = new Db();
//     db.createCollection('users');
//     db.users.insert([
//       {id: 1, name: 'Link', evil: false}
//     ]);
//     schema = new Schema(db);

//     User = Model.extend({
//       addresses: hasMany('address')
//     });
//     Address = Model.extend({

//     });

//     schema.register('user', User);
//   }
// });

// test('can create child models', function(assert) {
//   var link = new User(schema, 'user', db.users.find(1));

//   // assert.deepEqual(link.attrs, {id: 1, name: 'Link', evil: false});

//   // link.update('evil', true);
//   // assert.deepEqual(db.users.find(1), {id: 1, name: 'Link', evil: true});
// });
