import Factory from './factory';
import Response from './response';
import Sequence from './attributes/sequence';
import Lazy from './attributes/lazy';
import faker from './faker';
import HasMany from './orm/associations/has-many';
import BelongsTo from './orm/associations/belongs-to';

export { faker };

export default {
  Factory: Factory,
  Response: Response,
  hasMany: function(type) {
    return new HasMany(type);
  },
  belongsTo: function(type) {
    return new BelongsTo(type);
  },
  sequence: function(def) {
    return new Sequence(def);
  },
  lazy: function(def) {
    return new Lazy(def);
  }
};
