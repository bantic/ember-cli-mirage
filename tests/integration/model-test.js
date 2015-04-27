import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var defineAttribute, schema;
module('mirage:model#init', {
  beforeEach: function() {
    var db = new Db();
    db.createCollection('users');

    schema = new Schema(db);

    var Kingdom = Model.extend();
    var User = Model.extend({
      kingdom: Mirage.belongsTo()
    });

    schema.register('kingdom', Kingdom);
    schema.register('user', User);

    defineAttribute = sinon.spy(Model.prototype, "defineAttribute");
  },

  afterEach: function() {
    defineAttribute.restore();
  }
});

test('it calls #defineAttribute for passed-in plain attrs', function(assert) {
  schema.user.new({name: 'Link', age: '100'});

  assert.equal(defineAttribute.callCount, 2);
  assert.ok(defineAttribute.withArgs('name').calledOnce);
  assert.ok(defineAttribute.withArgs('age').calledOnce);
});

// test("it doesn't call #defineAttribute for passed-in Association attrs", function(assert) {
//   new User({}, 'user', {kingdom_id: 1});

//   assert.equal(defineAttribute.callCount, 0);
// });

// test("it doesn't call #defineAttribute for passed-in foreign keys", function(assert) {
//   new User({}, 'user', {kingdom: 1});

//   assert.equal(defineAttribute.callCount, 0);
// });
