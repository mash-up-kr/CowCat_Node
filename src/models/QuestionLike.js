import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class QuestionLike extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: {name: 'userId', allowNull: false},
      targetKey: 'id',
      as: 'user',
    });
    this.belongsTo(models.CounselingQuestion, {
      foreignKey: {name: 'counselingQuestionId', allowNull: false},
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
      paranoid: false,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'counseling_question_id'],
        },
        {
          fields: ['user_id'],
        },
      ],
    },
);

export default QuestionLike;
