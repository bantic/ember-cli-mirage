import { pluralize } from '../utils/inflector';
import extend from '../utils/extend';
import Association from './associations/association';
import Ember from 'ember';

/*
  The Model class. Notes:

  - We need to pass in type, because models are created with
    .extend and anonymous functions, so you cannot use
    reflection to find the name of the constructor.
*/
var Model = function(schema, type, initAttrs) {
  var _this = this;

  if (!schema) { throw 'Mirage: A model requires a schema'; }
  if (!type) { throw 'Mirage: A model requires a type'; }

  this._schema = schema;
  this.type = type;
  this.foreignKeys = [];
  initAttrs = initAttrs || {};

  this._setupAttrs(initAttrs);
  this._setupRelationships(initAttrs);
  this._setupPlainAttributes(initAttrs);

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

      // Update child models who hold a reference?
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
  if (!this.attrs.hasOwnProperty(attr)) {
    this.attrs[attr] = null;
  }

  // Define the getter/setter
  Object.defineProperty(this, attr, {
    get: function () { return this.attrs[attr]; },
    set: function (val) { this.attrs[attr] = val; return this; },
  });
};

/*
  Private methods
*/
/*
  attrs represents the persistable attributes, i.e. your db
  table fields. This method sets up that hash with its
  intiial values.

  It knows about passed-in attrs, plus any foreign keys required
  by its associations.
*/
Model.prototype._setupAttrs = function(initAttrs) {
  var _this = this;
  var attrs = {};

  // TODO: replace with _.assign
  var foreignKeysHash = this._getForeignKeysHash(initAttrs);
  initAttrs = Ember.merge(initAttrs, foreignKeysHash);

  Object.keys(initAttrs)
    .filter(function(attr) {
      return !( _this[attr] instanceof Association); })
    .forEach(function(attr) {
      var initialVal = initAttrs[attr] !== undefined ? initAttrs[attr] : null;
      attrs[attr] = initialVal;
    });

  this.attrs = attrs;
};

Model.prototype._getForeignKeysHash = function(initAttrs) {
  var _this = this;
  var hash = {};

  this._getAssociationKeys().forEach(function(key) {
    var association = _this[key];
    hash = Ember.merge(hash, association.getForeignKeysHash(key, initAttrs));
  });

  return hash;
};

Model.prototype._setupRelationships = function(initAttrs) {
  var _this = this;

  this._getAssociationKeys().forEach(function(attr) {
    _this[attr].defineRelationship(_this, attr, _this._schema, initAttrs);
  });
};

Model.prototype._getAssociationKeys = function() {
  var _this = this;

  return Object.keys(Object.getPrototypeOf(this))
    .filter(function(attr) {
      return _this[attr] instanceof Association;
    });
};

Model.prototype._setupPlainAttributes = function(attrs) {
  var _this = this;

  this._getPlainAttributeKeys().forEach(function(attr) {
    _this.defineAttribute(attr);
  });
};

/*
  Essentially how we get the db field names, minus the foreign
  keys
*/
Model.prototype._getPlainAttributeKeys = function() {
  var attrs = this.attrs ? Object.keys(this.attrs) : [];
  var foreignKeys = Object.keys(this._getForeignKeysHash());

  return attrs.filter(function(attr) {
    return foreignKeys.indexOf(attr) === -1;
  });
};

Model.extend = extend;

export default Model;
