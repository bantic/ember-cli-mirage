import { pluralize } from '../utils/inflector';
import extend from '../utils/extend';
import Association from './associations/association';

/*
  The Model class. Notes:

  - We need to pass in type, because models are created with
    .extend and anonymous functions, so you cannot use
    reflection to find the name of the constructor.
*/
var Model = function(schema, type, attrs) {
  var _this = this;

  if (!schema) { throw 'Mirage: A model requires a schema'; }
  if (!type) { throw 'Mirage: A model requires a type'; }

  this._schema = schema;
  this.type = type;


  /*
    attrs {id: 1, name: '123 Hyrule Way', user_id: 1}

    for each attr in attrs
      if attr is a foreign key (e.g. user_id)
        setup a getter/setter that pulls id from .association
        and, if attr val is non-null,

      if attr is not a foreign key (i.e. a plain attribute)

  */



  // Setup relationships
  this._getAssociationKeys().forEach(function(attr) {
    _this[attr].defineRelationship(_this, attr, _this._schema);
  });

  // Setup plain attributes
  this.attrs = attrs;
  if (attrs) {
    Object.keys(attrs).forEach(function(attr) {
      _this.defineAttribute(attr);
    });
  }


  /*
    Create or update the model.
  */
  this.save = function() {
    var collection = pluralize(this.type);

    if (this.isNew()) {
      // Update the attrs with the db response
      this.attrs = this._schema.db[collection].insert(this.attrs);

      // Ensure the id getter/setter is set
      _this.defineAttribute('id');

      // Update child models who hold a reference
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
    var collection = pluralize(this.type);
    this._schema.db[collection].remove(this.attrs.id);
  };

  this.isNew = function() {
    return this.attrs.id === undefined;
  };

  return this;
};


Model.prototype.defineAttribute = function(attr) {
  if (this[attr] !== undefined) { return; }

  // Ensure the attribute is on the attrs hash
  // if (!this.attrs.hasOwnProperty(attr)) {
  //   this.attrs[attr] = null;
  // }

  // Define the getter/setter
  Object.defineProperty(this, attr, {
    get: function () { return this.attrs[attr]; },
    set: function (val) { this.attrs[attr] = val; return this; },
  });
};

/*
  Private methods
*/
Model.prototype._getAssociationKeys = function() {
  var _this = this;

  return Object.keys(Object.getPrototypeOf(this))
    .filter(function(attr) {
      return _this[attr] instanceof Association;
    });
};

Model.extend = extend;

export default Model;
