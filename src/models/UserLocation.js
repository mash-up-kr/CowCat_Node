import Sequelize from "sequelize"

export default class UserLocation extends Sequelize.Model {
  static init(sequelize) {
    return super.init({}, {})
  }

  static associated(db) {}
}
