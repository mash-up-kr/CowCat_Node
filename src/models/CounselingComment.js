import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
    class CounselingComment extends Model {
        static associate(models) {
          this.belongsTo(models.User, { foreignKey: "userId", targetKey: "id" })
          this.belongsTo(models.CounselingQuestion, { foreignKey: "counselingQuestionId", targetKey: "id" })
        }
    }

    CounselingComment.init({
      id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
          unique: true,
      },
      content: {
          type: DataTypes.STRING(200),
          allowNull: false,
      },
      }, {
        sequelize,
        tableName: 'counseling_comments',
        charset: 'utf8',
        timestamps: true,
        underscored: true,
    },
    );

  return CounselingComment;
}
