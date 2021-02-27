"use strict"

import Sequelize from "sequelize"
import config from "../configs/config.js"
import User from "./User.js"
import Category from "./Category.js"
import Emotion from "./Emotion.js"
import CounselingQuestion from "./CounselingQuestion.js"
import CounselingComment from "./CounselingComment.js"
import UserLocation from "./UserLocation.js"
import UserToken from "./UserToken.js"
const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize
db.Sequelize = Sequelize

db.User = User
db.Category = Category
db.Emotion = Emotion
db.CounselingQuestion = CounselingQuestion
db.CounselingComment = CounselingComment
db.UserLocation = UserLocation
db.UserToken = UserLocation

//init
db.User.init(sequelize)
// db.Category.init(sequelize)
// db.Emotion.init(sequelize)
db.CounselingQuestion.init(sequelize)
// db.CounselingComment.init(sequelize)
// db.UserLocation.init(sequelize)
// db.UserToken.init(sequelize)

// //associate
// db.User.associated(db)
// db.Category.associated(db)
// db.Emotion.associated(db)
// db.CounselingQuestion.associated(db)
// db.CounselingComment.associated(db)
// db.UserLocation.associated(db)
// db.UserToken.associated(db)

export default db
