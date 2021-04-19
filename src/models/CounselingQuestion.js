import db from './sequelize.js';
import enums from './data/enums.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class CounselingQuestion extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user',
    });
    this.hasMany(models.CounselingComment, {
      foreignKey: 'counselingQuestionId',
      sourceKey: 'id',
      as: 'counselingComment',
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
      category: {
        type: DataTypes.ENUM(...enums.category),
      },
      emotion: {
        type: DataTypes.ENUM(...enums.emotion),
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
      indexes: [{unique: false, fields: ['emotion', 'category']}],
    },
);

export default CounselingQuestion;
