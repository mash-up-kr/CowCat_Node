import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
    class Category extends Model {
        static associate(models) {
          this.hasMany(models.CounselingQuestion, { as: 'CounselingQuestion'})
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
        tableName: 'users',
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
        timestamps: true,
        underscored: true,
    },
    );

  return Category;
}
