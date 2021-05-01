import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class CounselingComment extends Model {
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
    this.hasMany(models.CommentLike, {
      foreignKey: {name: 'counselingCommentId', allowNull: false},
      sourceKey: 'id',
      as: 'commentLike',
    });
  }
}

CounselingComment.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'counseling_comments',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
);

export default CounselingComment;
