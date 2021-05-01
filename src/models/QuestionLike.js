import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class QuestionLike extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user',
    });
    this.belongsTo(models.CounselingQuestion, {
      foreignKey: 'counselingQuestionId',
      targetKey: 'id',
      as: 'counselingQuestion',
    });
  }
}

QuestionLike.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      tableName: 'question_likes',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
);

export default QuestionLike;
