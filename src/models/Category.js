import db from './sequelize.js';

const {sequelize, Sequelize} = db;
const {Model, DataTypes} = Sequelize;

class Category extends Model {
  static associate(models) {
    this.hasMany(models.CounselingQuestion, {
      foreignKey: 'categoryId',
      sourceKey: 'id',
      as: 'CounselingQuestion',
    });
  }
}

Category.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'categories',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      timestamps: true,
      underscored: true,
      indexes: [{unique: true, fields: ['key']}],
    },
);

export default Category;
