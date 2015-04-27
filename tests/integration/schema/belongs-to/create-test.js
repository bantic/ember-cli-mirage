import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema;
module('mirage:integration:schema:belongsTo#create', {
  beforeEach: function() {
    var db = new Db();
    db.loadData({
      users: [],
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
  }
});

test('the child can create its parent model', function(assert) {
  var address = schema.address.find(1);

  assert.equal(address.user, null);
  assert.equal(schema.user.all().length, 0);

  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id);
  assert.deepEqual(ganon, schema.user.find(ganon.id));
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.user, ganon);
});

// test('the child can build an unsaved parent model', function(assert) {
// });
