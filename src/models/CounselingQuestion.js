import {Sequelize} from 'sequelize';
const {Model, DataTypes} = Sequelize;

export default (sequelize) => {
    class CounselingQuestion extends Model {
      static associate(models) {
        this.hasOne(models.Category, {
            foreignKey: 'categoryId ', 
            as: 'Category',
        });

        this.hasOne(models.Emotion, {
            foreignKey: 'emotionId ',
            as: "Emotion",
        });

        this.belongsTo(models.User, {
            foreignKey: 'userId',
            as: "User",
        });
      }
    }
    
    CounselingQuestion.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        tittle: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        content:{
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: 'counselingquestions',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    return CounselingQuestion;
};
