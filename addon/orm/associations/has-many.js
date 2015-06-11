import Association from './association';
import { capitalize } from 'ember-cli-mirage/utils/inflector';

class HasMany extends Association {

  /*
    The belongsTo association adds a fk to the possessor of the association
  */
  getForeignKeyArray() {
    return [this.referent, `${this.possessor}_id`];
  }

  getForeignKey() {
    return `${this.possessor}_id`;
  }

  addMethodsToModel(model, key, schema) {
    this._model = model;
    this._key = key;

    var association = this;
    var foreignKey = this.getForeignKey();
    var relationshipIdsKey = association.referent + '_ids';

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
        var models = association._tempChildren || [];

        if (!this.isNew()) {
          var query = {[foreignKey]: this.id};
          var savedModels = schema[association.referent].where(query);

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
          association._tempChildren = schema[association.referent].find(ids);

        } else {
          // Set current children's fk to null
          var query = {[foreignKey]: this.id};
          schema[association.referent].where(query).update(foreignKey, null);

          // Associate the new childrens to this model
          schema[association.referent].find(ids).update(foreignKey, this.id);
        }
        // debugger;
        return this;
        // if (id && !schema[_this.referent].find(id)) {
        //   throw "Couldn't find " + _this.referent + " with id = " + id;
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
        var tempModels = association._tempChildren || [];

        if (this.isNew()) {
          return tempModels;

        } else {
          var query = {};
          query[foreignKey] = this.id;
          var savedModels = schema[association.referent].where(query);

          return savedModels.mergeCollection(tempModels);
        }

        // var foreignKeyId = this[foreignKey];
        // if (foreignKeyId) {
        //   _this._tempParent = null;
        //   return schema[_this.referent].find(foreignKeyId);

        // } else if (_this._tempParent) {
        //   return _this._tempParent;
        // } else {
        //   return null;
        // }
      },

      /*
        object.children = (childModels)
          - sets the associated children (via array of models)
      */
      set: function(newModels) {
        newModels = newModels || [];

        if (this.isNew()) {
          association._tempChildren = _.compact(newModels);

        } else {

          // Set current children's fk to null
          var query = {[foreignKey]: this.id};
          schema[association.referent].where(query).update(foreignKey, null);

          // Save any children that are new
          newModels.filter(model => model.isNew())
            .forEach(model => model.save());

          // Associate the new children to this model
          schema[association.referent].find(newModels.map(m => m.id)).update(foreignKey, this.id);
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
    model['new' + capitalize(association.referent)] = function(attrs) {
      if (!this.isNew()) {
        attrs = _.assign(attrs, {[foreignKey]: this.id});
      }

      var child = schema[association.referent].new(attrs);

      association._tempChildren = _.compact(association._tempChildren) || [];
      association._tempChildren.push(child);

      return child;
    };

    /*
      object.createChild
        - creates an associated child, persists directly to db
    */
    model['create' + capitalize(association.referent)] = function(attrs) {
      var child;

      if (this.isNew()) {
        child = schema[association.referent].create(attrs);
        association._tempChildren = _.compact(association._tempChildren) || [];
        association._tempChildren.push(child);
      } else {
        attrs = _.assign(attrs, {[foreignKey]: this.id});
        child = schema[association.referent].create(attrs);
      }

      return child;
    };

    // this.updateChildForeignKeys = this._updateChildForeignKeys.bind(this, model, key);
  }
}

export default HasMany;
