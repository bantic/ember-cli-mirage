import Ember from 'ember';

var Relation = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  if (Ember.isArray(args[0])) {
    args = args[0];
  }
  this.push.apply(this, args);

  this.update = function(attrs) {
    this.forEach(function(model) {
      model.update(attrs);
    });
  };

  return this;
}

Relation.prototype = Object.create(Array.prototype);

export default Relation;
