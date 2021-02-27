import Sequelize from "sequelize"

export default class Emotion extends Sequelize.Model {
  static init(sequelize) {
    return super.init({}, {})
  }

  static associated(db) {}
}
