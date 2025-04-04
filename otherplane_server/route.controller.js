import { Op } from 'sequelize'
import Inventory from './models/Inventory.js'
import Notifications from './models/Notifications.js'

export function findAll (req, res) {
  Inventory.findAll()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json({ err }))  
}

export function getFromHost (req, res) {
  const { host } = req.query

  Notifications.findAll({
    where: {
      [Op.or]: [{ destination: 'all' }, { destination: host }]
    }
  }).then(data => res.status(200).json(data))
}

export function getNotification (req, res) {
  const { id } = req.query
  Notifications.findByPk(id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json({ err }))
}

export function saveNotification (req, res) {
  const { title, body, destination } = req.body
  Notifications.create({ title, body, destination })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json({ err }))
}
