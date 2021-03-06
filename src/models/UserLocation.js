import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class UserLocation extends Model {
  static associate(models) {
    this.hasOne(models.User, {
      foreignKey: 'locationId',
      as: 'User',
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
  charset: 'utf8mb4',
  collate: 'utf8mb4_bin',
  timestamps: true,
  underscored: true,
});

export default UserLocation;
