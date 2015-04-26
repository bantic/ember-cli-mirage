import { singularize, capitalize } from 'ember-cli-mirage/utils/inflector';
import Association from './association';

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

  defineRelationship: function(model, key, schema, initAttrs) {
    var _this = this;
    var foreignKey = key + '_id';

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
        if (_this._tempParent) {
          return _this._tempParent;
        }

        var relatedType = _this.type ? _this.type : singularize(key);
        return schema[relatedType].find(model[foreignKey]);
      },

      set: function(newModel) {
        if (newModel && newModel.isNew()) {
          model[foreignKey] = null;
          _this._tempParent = newModel;
        } else if (newModel) {
          _this._tempParent = null;
          model[foreignKey] = newModel.id;
        } else {
          model[foreignKey] = null;
        }
      }
    });

    // If an unsaved model was passed into init, save a reference to it
    if (initAttrs[key] && !initAttrs[key].id) {
      this._tempParent = initAttrs[key];
    }

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
