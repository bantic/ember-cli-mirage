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
  schema.kingdom.new({name: 'Hyrule'});

  assert.equal(defineAttribute.callCount, 1);
  assert.ok(defineAttribute.withArgs('name').calledOnce);
});

test('it calls #defineAttribute for passed-in plain attrs and foreign keys', function(assert) {
  schema.user.new({name: 'Link', age: '100'});

  assert.equal(defineAttribute.callCount, 3);
  assert.ok(defineAttribute.withArgs('name').calledOnce);
  assert.ok(defineAttribute.withArgs('age').calledOnce);
  assert.ok(defineAttribute.withArgs('kingdom_id').calledOnce);
});

test('it calls #defineAttribute once for foreign keys, even if one is passed in', function(assert) {
  schema.user.new({name: 'Link', kingdom_id: 1});

  assert.equal(defineAttribute.callCount, 2);
  assert.ok(defineAttribute.withArgs('name').calledOnce);
  assert.ok(defineAttribute.withArgs('kingdom_id').calledOnce);
});
