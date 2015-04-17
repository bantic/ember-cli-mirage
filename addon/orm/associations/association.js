import extend from 'ember-cli-mirage/utils/extend';

var Association = function(type) {
  this.type = type;
};

Association.extend = extend;

export default Association;
