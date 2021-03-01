import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class Category extends Model {
  static associate(models) {
    this.hasMany(models.CounselingQuestion, {as: 'CounselingQuestion'});
  }
}

Category.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'categories',
  charset: 'utf8mb4',
  collate: 'utf8mb4_bin',
  timestamps: true,
  underscored: true,
});

export default Category;
