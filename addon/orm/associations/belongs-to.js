import { singularize, capitalize } from 'ember-cli-mirage/utils/inflector';
import Association from './association';

/*
say an address belongs to user

current problem:
  how to setup user_id
  how to setup user

how to get user, user_id in the following situations?

// on instantiation

  address.new({user_id: 1})
    this.user_id = 1
    user is user.find(this.user_id)

  address.new({user_id: null})
    this.user_id = null
    user is user.find(this.user_id)

  address.new({}) // no user_id
    this.user_id = null
    user is user.find(this.user_id)

  address.new({user: savedUser})
    this.user_id = savedUser.id
    user is user.find(this.user_id)

  address.new({user: newUser})
    this.user_id = null
    this._tempAssociation = newUser
    user is _tempAssociation

  address.new({user: null})
    this.user_id = null
    this._tempAssociation = null
    user is user.find(this.user_id)

  address.new({user_id: x, user: y})
    error

  address.new({user_id: x, user: x})
    this.user_id = x
    user is user.find(this.user_id)

// after instantiation

  address.user_id = 1
  // address.user = user.find(this.user_id)

  address.user_id = null
  // address.user = null
  // _tempAssociation = null

  address.user = savedUser
  // address.user_id = savedUser.id

  address.user = null
  // address.user_id = null

  address.user = newUser
  // address.user_id = null

*/

export default Association.extend({

  getForeignKeysHash: function(key, initAttrs) {
    var foreignKey = key + '_id';
    var hash = {};
    hash[foreignKey] = initAttrs[foreignKey] !== undefined ? initAttrs[foreignKey] : null;

    // Set foreign key if model was passed in
    if (initAttrs[key] && initAttrs[key].id) {
      hash[foreignKey] = initAttrs[key].id;
    }

    return hash;
  },

  defineRelationship: function(model, key, schema) {
    var _this = this;
    var foreignKey = key + '_id';

    model.foreignKeys.push(foreignKey);

    // Define the foreign key getter/setter
    Object.defineProperty(model, foreignKey, {
      get: function() {
        return this.attrs[foreignKey];
      },
      set: function(val) {
        this.attrs[foreignKey] = val;
        return this;
      }
    });

    // Define the relationship getter/setter
    Object.defineProperty(model, key, {
      get: function() {
        // if (this._tempParent) {
        //   return this._tempParent;
        // }

        var relatedType = _this.type ? _this.type : singularize(key);
        return schema[relatedType].find(model[foreignKey]);
      },
      set: function(newModel) {
        // if (newModel.isNew()) {
        //   this._tempParent = newModel;
        // } else {
        //   this._tempParent = null;
        //   model[foreignKey] = newModel.id;
        // }
      }
    });

    // model['create' + capitalize(key)] = function(attrs) {
    //   var newModel = schema[key].create(attrs);
    //   model.update(foreignKey, newModel.id);

    //   return newModel;
    // };

    // Not implemented yet
    // model['new' + capitalize(key)] = function(attrs) {
    //   var newModel = schema[key].new(attrs);
    //   model[foreignKey] = newModel.getUuid();

    //   return newModel;
    // };
  },

  // _ensureForeignKeyIsDefined: function(model, foreignKey) {
  //   model.defineAttribute(foreignKey);
  // }

});
