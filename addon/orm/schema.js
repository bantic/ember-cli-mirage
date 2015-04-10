import { pluralize } from '../utils/inflector';
import Relation from './relation';

export default function(db) {

  if (!db) {
    throw 'Mirage: A schema requires a db';
  }

  this.db = db;
  this._registry = {};

  this.register = function(type, typeClass) {
    var _this = this;

    this._registry[type] = typeClass;

    this[type] = {
      create: this.create.bind(this, type),
      all: this.all.bind(this, type),
      find: this.find.bind(this, type),
      where: this.where.bind(this, type),
      update: this.update.bind(this, type),
      destroy: this.destroy.bind(this, type)
    };

    return this;
  };

  this.create = function(type, attrs) {
    var collection = pluralize(type);

    if (!this.db[collection]) {
      db.createCollection(collection);
    }

    var augmentedAttrs = this.db[collection].insert(attrs);

    var instance = new this._registry[type](augmentedAttrs);

    return instance;
  };

  this.all = function(type) {
    var ModelClass = this._registry[type];
    var collection = pluralize(type);
    var records = db[collection];

    return this._hydrate(records, type);
  };

  this.find = function(type, ids) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    var records = db[collection].find(ids);

    return this._hydrate(records, type);
  };

  this.where = function(type, query) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    var ModelClass = this._registry[type];
    var records = db[collection].where(query);
    return this._hydrate(records, type);

    return !records ? [] : records.map(function(record) {
      return new ModelClass(record);
    });
  };

  this.update = function(type, attrs, target) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    db[collection].update(attrs, target);
  };

  this.destroy = function(type, attrs, target) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    db[collection].remove(attrs, target);
  };

  /*
    Takes a record and returns a model, or an array of records
    and returns a relation.
  */
  this._hydrate = function(records, type) {
    var ModelClass = this._registry[type];

    if (Ember.isArray(records)) {
      var models = records.map(function(record) {
        return new ModelClass(record);
      });

      return new Relation(models);

    } else {
      return !records ? null : new ModelClass(records);
    }
  };
}
