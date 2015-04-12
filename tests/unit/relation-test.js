import Relation from 'ember-cli-mirage/orm/relation';
import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/orm/db';

module('mirage:relation');

test('it can be instantiated', function(assert) {
  var relation = new Relation();
  assert.ok(relation);
});

module('mirage:relation#update');

test('it can update its models', function(assert) {
  var db = new Db();
  db.createCollection('users');
  var schema = new Schema(db);

  var User = Model.extend();
  schema.register('user', User);

  var relation = new Relation([
    schema.user.create({name: 'Link', evil: false}),
    schema.user.create({name: 'Zelda', evil: false}),
  ]);

  assert.deepEqual(db.users, [
    {id: 1, name: 'Link', evil: false},
    {id: 2, name: 'Zelda', evil: false},
  ]);

  relation.update({evil: true});

  assert.deepEqual(db.users, [
    {id: 1, name: 'Link', evil: true},
    {id: 2, name: 'Zelda', evil: true},
  ]);
  assert.deepEqual(relation[0].attrs, {id: 1, name: 'Link', evil: true});
  assert.deepEqual(relation[1].attrs, {id: 2, name: 'Zelda', evil: true});

});

