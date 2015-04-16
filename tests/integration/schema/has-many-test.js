import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import hasMany from 'ember-cli-mirage/orm/relations/has-many';
import {module, test} from 'qunit';

var db, schema, User, Address;
module('mirage:integration:schema:hasMany', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link'}
    ]);
    db.createCollection('addresses');
    db.addresses.insert([
      {id: 1, user_id: 1, name: '123 Hyrule Way'}
    ]);
    schema = new Schema(db);

    User = Model.extend({
      addresses: hasMany('address')
    });
    Address = Model.extend({

    });

    schema.register('user', User);
    schema.register('address', Address);
  }
});

test('the parent can read child models', function(assert) {
  var link = schema.user.find(1);

  assert.deepEqual(link.attrs, {id: 1, name: 'Link'});
  assert.deepEqual(link.addresses[0].attrs, {id: 1, user_id: 1, name: '123 Hyrule Way'});
});


// test('the parent can create child models', function(assert) {
//   var link = schema.user.find(1);
//   debugger;

//   link.addresses.create({name: '123 Hyrule Way'});

//   assert.deepEqual(db.users.all(), [{id: 1, name: 'Link'}]);
//   assert.deepEqual(db.addresses.all(), [{id: 1, address_id: 1, name: '123 Hyrule Way'}]);
// });
