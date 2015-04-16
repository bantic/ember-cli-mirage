import Ember from 'ember';
import { pluralize } from '../utils/inflector';
import Collection from './collection';

export default function(db) {

  if (!db) {
    throw 'Mirage: A schema requires a db';
  }

  this.db = db;
  this._registry = {};

  this.register = function(type, typeClass) {
    this._registry[type] = typeClass;
    var collection = pluralize(type);

    if (!this.db[collection]) {
      db.createCollection(collection);
    }

    this[type] = {
      new: this.new.bind(this, type),
      create: this.create.bind(this, type),
      all: this.all.bind(this, type),
      find: this.find.bind(this, type),
      where: this.where.bind(this, type)
    };

    return this;
  };

  this.new = function(type, attrs) {
    var ModelClass = this._registry[type];

    return new ModelClass(this, type, attrs);
  };

  this.create = function(type, attrs) {
    var collection = pluralize(type);

    var augmentedAttrs = this.db[collection].insert(attrs);

    return new this._registry[type](this, type, augmentedAttrs);
  };

  this.all = function(type) {
    var collection = pluralize(type);
    var records = db[collection]._records;

    return this._hydrate(records, type);
  };

  this.find = function(type, ids) {
    var collection = pluralize(type);
    if (!db[collection]) {
      throw "Mirage: You're trying to find model(s) of type " + type + " but this collection doesn't exist in the database.";
    }

    var records = db[collection].find(ids);

    return this._hydrate(records, type);
  };

  this.where = function(type, query) {
    var collection = pluralize(type);
    if (!db[collection]) {
      throw "Mirage: You're trying to find model(s) of type " + type + " but this collection doesn't exist in the database.";
    }

    var records = db[collection].where(query);

    return this._hydrate(records, type);
  };

  /*
    Private methods
  */
  /*
    Takes a record and returns a model, or an array of records
    and returns a collection.
  */
  this._hydrate = function(records, type) {
    var schema = this;
    var ModelClass = this._registry[type];

    if (Ember.isArray(records)) {
      var models = records.map(function(record) {
        return new ModelClass(schema, type, record);
      });

      return new Collection(models);

    } else {
      return !records ? null : new ModelClass(schema, type, records);
    }
  };
}
