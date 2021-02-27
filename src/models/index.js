"use strict"

import fs from "fs"
import Sequelize from "sequelize"
import path from "path"
import config from "../configs/config.js"
const env = process.env.NODE_ENV || "development"

const db = {}
const basename = path.basename(__filename)

const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize
db.Sequelize = Sequelize

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

const modelNames = Object.keys(db)

console.log(modelNames)

modelNames.forEach((modelName) => {
  if (db[modelName].init) {
    db[modelName].init(sequelize)
  }
})

modelNames.forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.db.module.exports = db
