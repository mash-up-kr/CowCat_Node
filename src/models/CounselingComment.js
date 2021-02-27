import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
    class CounselingComment extends Model {
        static associate(models) {
          this.belongsTo(models.User, { as: "User" })
          this.belongsTo(models.CounselingQuestion, { as: "CounselingQuestion" })
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
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
        timestamps: true,
        paranoid: true,
        underscored: true,
    },
    );

  return CounselingComment;
}
