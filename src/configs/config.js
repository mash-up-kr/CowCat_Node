import path from "path"
import dotenv from "dotenv"

const __dirname = path.resolve()

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, "../../.env.production") })
} else if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.join(__dirname, "../../.env.test") })
} else if (process.env.NODE_ENV === "develop" || process.env.NODE_ENV === undefined) {
  dotenv.config({ path: path.join(__dirname, "../../.env.develop") })
} else {
  throw new Error("process.env.NODE_ENV를 올바르게 설정해주세요!")
}

export default {
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "database",
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  dialect: process.env.DB_DIALECT || "postgres",
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 1000),
}
