import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class UserToken extends Model {
  static associate(models) {
    this.hasOne(models.User, {
      foreignKey: 'tokenId',
      as: 'User',
    });
  }
}

UserToken.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  accessToken: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'user_tokens',
  charset: 'utf8mb4',
  collate: 'utf8mb4_bin',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['access_token'],
    },
    {
      fields: ['refresh_token'],
    },
  ],
});

export default UserToken;
