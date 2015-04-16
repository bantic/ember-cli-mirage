/*
  An array of related models
*/
function hasMany(type) {
  // var args = Array.prototype.slice.call(arguments, 0);
  // if (Ember.isArray(args[0])) {
  //   args = args[0];
  // }
  // this.push.apply(this, args);

  // this.update = function(key, val) {
  //   this.forEach(function(model) {
  //     model.update(key, val);
  //   });
  // };

  // this.destroy = function() {
  //   this.forEach(function(model) {
  //     model.destroy();
  //   });
  // };
  // this.create = function() {
  //   return 'x';
  // };
  this.type = type;

  return this;
  // return type;
  // return {
  //   create: function() {
  //     console.log(this);
  //   }
  // }
}

// HasManyRelation.prototype = Object.create(Array.prototype);

export default hasMany;
