import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
  class UserToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
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
    charset: 'utf8',
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

  return UserToken;
};
