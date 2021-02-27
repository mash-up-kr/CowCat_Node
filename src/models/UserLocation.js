import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
  class UserLocation extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  UserLocation.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'user_locations',
    charset: 'utf8',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['nickname'],
      },
      {
        fields: ['imageUrl'],
      },
    ],
  });

  return UserLocation;
};
