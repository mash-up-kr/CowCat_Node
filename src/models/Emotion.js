import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class Emotion extends Model {
  static associate(models) {
    this.hasMany(models.CounselingQuestion, {
      foreignKey: 'emotion_id',
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
      key: {
        type: DataTypes.STRING(40),
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
      indexes: [{unique: true, fields: ['key']}],
    },
);

export default Emotion;
