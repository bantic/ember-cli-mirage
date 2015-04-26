import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

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
