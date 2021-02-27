import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
    class Emotion extends Model {
        static associate(models) {
          this.hasMany(model.CounselingQuestion, { foreignKey: "emotionId ", sourceKey: "id" })
        }
    }

    Emotion.init({
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
        charset: 'utf8',
        timestamps: true,
        underscored: true,
    },
    );

  return Emotion;
}
