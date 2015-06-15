import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';

class BelongsToHelper {

  constructor() {
    this.db = new Db();
    this.schema = new Schema(this.db);

    var User = Model;
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    this.schema.registerModels({
      user: User,
      address: Address
    });
  }

  savedChildNoParent() {
    this.db.loadData({
      users: [],
      addresses: [
        {id: 1, name: 'foo'},
      ]
    });

    return this.schema.address.find(1);
  }

  savedChildNewParent() {
    this.db.loadData({
      users: [],
      addresses: [
        {id: 1, name: 'foo'},
      ]
    });
    var address = this.schema.address.find(1);
    var user = this.schema.user.new({name: 'Newbie'});
    address.user = user;

    return [address, user];
  }

  savedChildSavedParent() {
    this.db.loadData({
      users: [
        {id: 1, name: 'some user'},
      ],
      addresses: [
        {id: 1, name: 'foo', user_id: 1},
      ]
    });
    var address = this.schema.address.find(1);
    var user = this.schema.user.find(1);

    return [address, user];
  }

  newChildNoParent() {
    this.db.loadData({
      users: [],
      addresses: []
    });

    return this.schema.address.new({name: 'New addr'});
  }

  newChildNewParent() {
    this.db.loadData({
      users: [],
      addresses: []
    });
    var address = this.schema.address.new({name: 'New addr'});
    var newUser = this.schema.user.new({name: 'Newbie'});
    address.user = newUser;

    return [address, newUser];
  }

  newChildSavedParent() {
    this.db.loadData({
      users: [
        {id: 1, name: 'some user'}
      ],
      addresses: []
    });
    var address = this.schema.address.new({name: 'New addr'});
    var savedUser = this.schema.user.find(1);
    address.user = savedUser;

    return [address, savedUser];
  }

}

export default BelongsToHelper;
