import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const InventoryDB = new Sequelize(
  process.env.INVENTORY_DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
)
const GlobalDB = new Sequelize(
  process.env.GLOBAL_DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
)

export { InventoryDB, GlobalDB }
