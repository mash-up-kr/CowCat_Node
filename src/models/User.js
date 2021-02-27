import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.UserLocation, {
        foreignKey: 'userId',
        as: 'Location',
      });

      this.hasOne(models.UserToken, {
        foreignKey: 'userId',
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
    charset: 'utf8',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['image_url'],
      },
    ],
  });

  return User;
};
