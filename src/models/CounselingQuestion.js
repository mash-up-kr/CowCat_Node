import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
  class CounselingQuestion extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });

      //   this.belongsTo(models.Category, {
      //       foreignKey: 'categoryId',
      //       as: 'Category',
      //   });

    //   this.belongsTo(models.Emotion, {
    //       foreignKey: "emotionId",
    //       as: "Emotion",
    //   })
    }
  }

  CounselingQuestion.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    tableName: 'users',
    charset: 'utf8',
    timestamps: true,
    underscored: true,
  });

  return CounselingQuestion;
};
