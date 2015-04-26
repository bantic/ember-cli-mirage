import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import {module, test} from 'qunit';

var User, defineAttribute;
module('mirage:model#init', {
  beforeEach: function() {
    User = Model.extend({
      kingdom: Mirage.belongsTo()
    });
    defineAttribute = sinon.spy(Model.prototype, "defineAttribute");
  },

  afterEach: function() {
    defineAttribute.restore();
  }
});

test('it calls #defineAttribute for passed-in plain attrs', function(assert) {
  new User({}, 'user', {name: 'Link', age: '100'});

  assert.equal(defineAttribute.callCount, 2);
  assert.ok(defineAttribute.withArgs('name').calledOnce);
  assert.ok(defineAttribute.withArgs('age').calledOnce);
});

test("it doesn't call #defineAttribute for passed-in Association attrs", function(assert) {
  new User({}, 'user', {kingdom_id: 1});

  assert.equal(defineAttribute.callCount, 0);
});

test("it doesn't call #defineAttribute for passed-in Association attrs", function(assert) {
  new User({}, 'user', {kingdom: 1});

  assert.equal(defineAttribute.callCount, 0);
});
