import { pluralize } from './utils/inflector';

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
      create: this._create.bind(this, type),
      all: this._all.bind(this, type),
      find: this._find.bind(this, type),
      where: this._where.bind(this, type),
      update: this._update.bind(this, type),
      destroy: this._destroy.bind(this, type)
    };

    return this;
  };

  this._create = function(type, attrs) {
    var collection = pluralize(type);

    if (!this.db[collection]) {
      db.createCollection(collection);
    }

    var augmentedAttrs = this.db[collection].insert(attrs);

    var instance = new this._registry[type](augmentedAttrs);

    return instance;
  },

  this._all = function(type) {
    var collection = pluralize(type);
    var data = db[collection];
    var ModelClass = this._registry[type];
    var models = [];

    data.forEach(function(attrs) {
      models.push(new ModelClass(attrs));
    });

    return models;
  },

  this._find = function(type, ids) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    var ModelClass = this._registry[type];
    var records = db[collection].find(ids);

    if (Ember.isArray(ids)) {
      return !records ? [] : records.map(function(record) {
        return new ModelClass(record);
      });

    } else {
      return !records ? null : new ModelClass(records);
    }
  },

  this._where = function(type, query) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    var ModelClass = this._registry[type];
    var records = db[collection].where(query);

    return !records ? [] : records.map(function(record) {
      return new ModelClass(record);
    });
  },

  this._update = function(type, attrs, target) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    db[collection].update(attrs, target);
  },

  this._destroy = function(type, attrs, target) {
    var collection = pluralize(type);
    if (!db[collection]) {
      return null;
    }

    db[collection].remove(attrs, target);
  }
};
