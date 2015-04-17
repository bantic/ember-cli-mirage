import { singularize } from 'ember-cli-mirage/utils/inflector';
/*
  An array of related models
*/
export default function(type) {

  /*
    Define the property on the model.
  */
  this.defineRelationship = function(model, key, schema) {
    debugger;
    Object.defineProperty(model, key, {
      get: function () {
        var relatedType = type ? type : singularize(key);
        var foreignKey = model.type + '_id';
        var query = {};
        query[foreignKey] = model.id;

        return schema[relatedType].where(query);
      }
      // set: function (val) { _this.attrs[attr] = val; return _this; },
    });
  };
}
