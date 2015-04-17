import { singularize, capitalize } from 'ember-cli-mirage/utils/inflector';
import Association from './association';

export default Association.extend({

  defineRelationship: function(model, key, schema) {
    var _this = this;
    var foreignKey = key + '_id';

    Object.defineProperty(model, key, {
      get: function () {
        var relatedType = _this.type ? _this.type : singularize(key);
        return schema[relatedType].find(model[foreignKey]);
      },
      set: function (newModel) {
        model.update(foreignKey, newModel.id);
      }
    });

    model['create' + capitalize(key)] = function() {
      return 1;
    };
  }

});
