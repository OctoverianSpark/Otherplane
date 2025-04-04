import { DataTypes } from 'sequelize'
import { GlobalDB } from '../config/database.js'

const Notifications = GlobalDB.define('Notifications', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING(165),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifications',
  timestamps: false
})

export default Notifications
