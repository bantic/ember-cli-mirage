import extend from '../utils/extend';

var Model = function(schema, attrs) {
  var _this = this;

  if (!schema) {
    throw 'Mirage: A model requires a schema';
  }

  this.schema = schema;

  this.attrs = attrs;

  //Object.keys(attrs).forEach(function(attr) {
    //_this[attr] = attrs[attr];
  //});

  /*
    Create or update the model.
  */
  this.save = function() {
    debugger;
    if (this.isNew()) {
      this.attrs = this.schema.db.users.insert(this.attrs);
      this.schema.user.createOrUpdate(this);
    } else {

    }

    return this;
  };

  this.isNew = function() {
    return this.attrs.id === undefined;
  }

  return this;
};

Model.extend = extend;

export default Model;
