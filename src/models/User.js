import Sequelize from "sequelize"

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        birthdat: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        gender: {
          type: Sequelize.ENUM("F", "M"),
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    )
  }

  static associated(db) {}
}
