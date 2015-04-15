export default function(f) {

  this.evaluate = function() {
    var result = f.call(this, this.factory._sequence);

    return result;
  };

  return this;
}
