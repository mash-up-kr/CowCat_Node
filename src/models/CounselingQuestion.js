import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

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
