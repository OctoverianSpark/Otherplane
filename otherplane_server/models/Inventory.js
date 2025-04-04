import { DataTypes } from 'sequelize'
import { InventoryDB } from '../config/database.js'

const Inventory = InventoryDB.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  serial: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  usuarioPC: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  correo_dominio: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  propietario: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  nombre_equipo: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  anydesk: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  password_anydesk: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  sede: {
    type: DataTypes.STRING(40),
    allowNull: false
  }
}, {
  tableName: 'inv',
  timestamps: false
})

export default Inventory
