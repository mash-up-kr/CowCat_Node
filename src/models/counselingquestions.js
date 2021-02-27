const Sequelize = require('sequelize');

module.exports = class CounselingQuestion extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
            },
            tittle: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            content:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
             },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'ConselingQuestion',
            tableName: 'conselingQuestions',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.CounselingQuestion.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
        db.CounselingQuestion.hasOne(db.Category, { foreignKey: 'category_id ', targetKey: 'id' });
        db.CounselingQuestion.hasOne(db.Emotion, { foreignKey: 'emotion_id ', targetKey: 'id' });
    }
};