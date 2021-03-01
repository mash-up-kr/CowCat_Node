import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class User extends Model {
  static associate(models) {
    this.belongsTo(models.UserLocation, {
      foreignKey: 'locationId',
      as: 'Location',
    });

    this.belongsTo(models.UserToken, {
      foreignKey: 'tokenId',
      as: 'Token',
    });
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nickname: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM([
      'F',
      'M',
    ]),
    defaultValue: 'F',
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'users',
  charset: 'utf8mb4',
  collate: 'utf8mb4_bin',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['image_url'],
    },
  ],
});

export default User;
