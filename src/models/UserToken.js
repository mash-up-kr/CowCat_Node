import Sequelize from "sequelize"

export default class UserToken extends Sequelize.Model {
  static init(sequelize) {
    return super.init({}, {})
  }

  static associated(db) {}
}
