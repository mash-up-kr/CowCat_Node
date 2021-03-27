import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class User extends Model {
  static associate(models) {
    this.hasOne(models.UserLocation, {
      foreignKey: 'userId',
      as: 'Location',
    });

    this.hasMany(models.CounselingQuestion, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'CounselingQuestion',
    });

    this.hasMany(models.CounselingComment, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'CounselingComment',
    });

    this.hasMany(models.CounselingQuestion, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'CounselingQuestion',
    });

    this.hasMany(models.CounselingComment, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'CounselingComment',
    });
  }
}

User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      snsId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      snsType: {
        type: DataTypes.ENUM([
          'kakao',
        ]),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM(['F', 'M']),
        defaultValue: 'F',
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
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
        {unique: true, fields: ['nickname']},
      ],
    },
);

export default User;
