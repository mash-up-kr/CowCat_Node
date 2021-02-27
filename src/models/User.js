import Sequelize from "sequelize"

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
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

  static associated(db) {
    db.User.hasMany(db.PaymentMethod, {
      foreignKey: "user_id",
      sourceKey: "id",
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    db.User.hasMany(db.Income, { foreignKey: "user_id", sourceKey: "id", onDelete: "cascade", onUpdate: "cascade" })
    db.User.hasMany(db.Expense, { foreignKey: "user_id", sourceKey: "id", onDelete: "cascade", onUpdate: "cascade" })
  }
}
