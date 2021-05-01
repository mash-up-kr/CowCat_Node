import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class CommentLike extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: {name: 'userId', allowNull: false},
      targetKey: 'id',
      as: 'user',
    });
    this.belongsTo(models.CounselingComment, {
      foreignKey: {name: 'counselingCommentId', allowNull: false},
      targetKey: 'id',
      as: 'counselingComment',
    });
  }
}

CommentLike.init(
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
      tableName: 'comment_likes',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'counseling_comment_id'],
        },
        {
          fields: ['user_id'],
        },
      ],
    },
);

export default CommentLike;
