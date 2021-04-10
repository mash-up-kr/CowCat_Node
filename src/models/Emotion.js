import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class Emotion extends Model {
  static associate(models) {
    this.hasMany(models.CounselingQuestion, {
      foreignKey: 'emotionId',
      sourceKey: 'id',
      as: 'CounselingQuestion',
    });
  }
}

Emotion.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'emotions',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      timestamps: true,
      underscored: true,
      indexes: [{unique: true, fields: ['name']}],
    },
);

export default Emotion;
