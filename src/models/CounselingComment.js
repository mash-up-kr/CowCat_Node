import Sequelize from "sequelize"

export default class CounselingComment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({}, {})
  }

  static associated(db) {}
}
