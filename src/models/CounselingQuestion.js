import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

<<<<<<< HEAD
class CounselingQuestion extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
    });

    // this.belongsTo(models.Category, {
    //   foreignKey: 'categoryId',
    //   as: 'Category',
    // });

    // this.belongsTo(models.Emotion, {
    //   foreignKey: 'emotionId',
    //   as: 'Emotion',
    // });
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
  tableName: 'counseling_questions',
  charset: 'utf8mb4',
  collate: 'utf8mb4_bin',
  timestamps: true,
  underscored: true,
});

export default CounselingQuestion;
=======
export default (sequelize) => {
    class CounselingQuestion extends Model {
      static associate(models) {
        this.belongsTo(models.User, { foreignKey: "userId", targetKey: "id" })
        this.belongsTo(models.Category, { foreignKey: "categoryId ", targetKey: "id" })
        this.belongsTo(models.Emotion, { foreignKey: "emotionId ", targetKey: "id" })
        this.hasMany(models.CounselingComment, { foreignKey: "counselingQuestionId ", sourceKey: "id" })
      }
    }

    CounselingQuestion.init({
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        title: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'counseling_questions',
        charset: 'utf8',
        timestamps: true,
        underscored: true,
      },
      );

  return CounselingQuestion;
}
>>>>>>> fix: 충돌 resolve
