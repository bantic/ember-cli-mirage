import { pluralize } from '../utils/inflector';
import extend from '../utils/extend';

/*
  The Model class. Notes:

  - We need to pass in type, because models are created with
    .extend and anonymous functions, so you cannot use
    reflection to find the name of the constructor.
*/
var Model = function(schema, type, attrs) {
  var _this = this;

  if (!schema) {throw 'Mirage: A model requires a schema'; }
  if (!type) {throw 'Mirage: A model requires a type'; }

  this._schema = schema;
  this._type = type;

  this.attrs = attrs;
  if (attrs) {
    Object.keys(attrs).forEach(function(attr) {
      Object.defineProperty(_this, attr, {
        get: function () { return _this.attrs[attr]; },
        set: function (val) { _this.attrs[attr] = val; return _this; },
      });
    });
  }

  /*
    Create or update the model.
  */
  this.save = function() {
    var collection = pluralize(this._type);

    if (this.isNew()) {
      this.attrs = this._schema.db[collection].insert(this.attrs);
    } else {
      this._schema.db[collection].update(this.attrs, this.attrs.id);
    }

    return this;
  };

  /*
    Update the db record.
  */
  this.update = function(key, val) {
    var _this = this;
    var attrs;
    if (key == null) {return this;}

    if (typeof key === 'object') {
      attrs = key;
    } else {
      (attrs = {})[key] = val;
    }

    Object.keys(attrs).forEach(function(attr) {
      _this[attr] = attrs[attr];
    });

    this.save();

    return this;
  };

  /*
    Destroy the db record.
  */
  this.destroy = function() {
    var collection = pluralize(this._type);
    this._schema.db[collection].remove(this.attrs.id);
  };

  this.isNew = function() {
    return this.attrs.id === undefined;
  };

  return this;
};

Model.extend = extend;

export default Model;
