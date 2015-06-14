import Association from './association';
import Collection from '../collection';
import { capitalize } from 'ember-cli-mirage/utils/inflector';

class HasMany extends Association {

  /*
    The hasMany association adds a fk to the target of the association
  */
  getForeignKeyArray() {
    return [this.target, `${this.owner}_id`];
  }

  getForeignKey() {
    return `${this.owner}_id`;
  }

  addMethodsToModel(model, key, schema) {
    this._model = model;
    this._key = key;

    var association = this;
    var foreignKey = this.getForeignKey();
    var relationshipIdsKey = association.target + '_ids';

    var associationHash = {[key]: this};
    model.hasManyAssociations = _.assign(model.hasManyAssociations, associationHash);
    model.associationKeys.push(key);
    model.associationIdKeys.push(relationshipIdsKey);

    Object.defineProperty(model, relationshipIdsKey, {
      /*
        object.children_ids
          - returns an array of the associated children's ids
      */
      get: function() {
        var models = association._cachedChildren || [];

        if (!this.isNew()) {
          var query = {[foreignKey]: this.id};
          var savedModels = schema[association.target].where(query);

          models = savedModels.mergeCollection(models);
        }

        return models.map(model => model.id);
        // debugger;

        // return this[key].map(function(child) { return child.id; });
        // debugger;
    //     return this.attrs[foreignKey];
      },

      /*
        object.children_ids = ([childrenIds...])
          - sets the associated parent (via id)
      */
      set: function(ids) {
        ids = ids || [];

        if (this.isNew()) {
          association._cachedChildren = schema[association.target].find(ids);

        } else {
          // Set current children's fk to null
          var query = {[foreignKey]: this.id};
          schema[association.target].where(query).update(foreignKey, null);

          // Associate the new childrens to this model
          schema[association.target].find(ids).update(foreignKey, this.id);

          // Clear out any old cached children
          association._cachedChildren = [];
        }
        // debugger;
        return this;
        // if (id && !schema[_this.target].find(id)) {
        //   throw "Couldn't find " + _this.target + " with id = " + id;
        // }

        // this.attrs[foreignKey] = id;
        // return this;
      }
    });

    Object.defineProperty(model, key, {
      /*
        object.children
          - returns an array of associated children
      */
      get: function() {
        var tempModels = association._cachedChildren || [];

        if (this.isNew()) {
          return tempModels;

        } else {
          var query = {};
          query[foreignKey] = this.id;
          var savedModels = schema[association.target].where(query);

          return savedModels.mergeCollection(tempModels);
        }

        // var foreignKeyId = this[foreignKey];
        // if (foreignKeyId) {
        //   _this._tempParent = null;
        //   return schema[_this.target].find(foreignKeyId);

        // } else if (_this._tempParent) {
        //   return _this._tempParent;
        // } else {
        //   return null;
        // }
      },

      /*
        object.children = [model1, model2, ...]
          - sets the associated children (via array of models)
      */
      set: function(newModels) {
        newModels = newModels ? _.compact(newModels) : [];

        if (this.isNew()) {
          association._cachedChildren = newModels instanceof Collection ? newModels : new Collection(newModels);

        } else {

          // Set current children's fk to null
          var query = {[foreignKey]: this.id};
          schema[association.target].where(query).update(foreignKey, null);

          // Save any children that are new
          newModels.filter(model => model.isNew())
            .forEach(model => model.save());

          // Associate the new children to this model
          schema[association.target].find(newModels.map(m => m.id)).update(foreignKey, this.id);

          // Clear out any old cached children
          association._cachedChildren = [];
        }

        // if (newModel && newModel.isNew()) {
        //   this[foreignKey] = null;
        //   _this._tempParent = newModel;
        // } else if (newModel) {
        //   _this._tempParent = null;
        //   this[foreignKey] = newModel.id;
        // } else {
        //   _this._tempParent = null;
        //   this[foreignKey] = null;
        // }
      }
    });

    /*
      object.newChild
        - creates a new unsaved associated child
    */
    model['new' + capitalize(association.target)] = function(attrs) {
      if (!this.isNew()) {
        attrs = _.assign(attrs, {[foreignKey]: this.id});
      }

      var child = schema[association.target].new(attrs);

      association._cachedChildren = association._cachedChildren || new Collection();
      association._cachedChildren.push(child);

      return child;
    };

    /*
      object.createChild
        - creates an associated child, persists directly to db, and
          updates the target's foreign key
    */
    model['create' + capitalize(association.target)] = function(attrs) {
      var child;

      if (!this.isNew()) {
        attrs = _.assign(attrs, {[foreignKey]: this.id});
      }

      child = schema[association.target].create(attrs);

      if (this.isNew()) {
        association._cachedChildren = _.compact(association._cachedChildren) || [];
        association._cachedChildren.push(child);
      }

      return child;
    };

    // this.updateChildForeignKeys = this._updateChildForeignKeys.bind(this, model, key);
  }
}

export default HasMany;
