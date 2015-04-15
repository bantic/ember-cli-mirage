import Ember from 'ember';

var Relation = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  if (Ember.isArray(args[0])) {
    args = args[0];
  }
  this.push.apply(this, args);

  this.update = function(key, val) {
    this.forEach(function(model) {
      model.update(key, val);
    });
  };

  this.destroy = function() {
    this.forEach(function(model) {
      model.destroy();
    });
  };

  return this;
};

Relation.prototype = Object.create(Array.prototype);

export default Relation;
