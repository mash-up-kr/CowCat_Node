import db from './sequelize.js';

const { sequelize, Sequelize } = db;
const { Model, DataTypes } = Sequelize;

class CounselingQuestion extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'User',
    });

    this.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      targetKey: 'id',
      as: 'Category',
    });

    this.belongsTo(models.Emotion, {
      foreignKey: 'emotionId',
      targetKey: 'id',
      as: 'Emotion',
    });
    this.hasMany(models.CounselingComment, {
      foreignKey: 'counselingQuestionId',
      sourceKey: 'id',
      as: 'CounselingQuestion',
    });
  }
}

CounselingQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'counseling_questions',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default CounselingQuestion;
