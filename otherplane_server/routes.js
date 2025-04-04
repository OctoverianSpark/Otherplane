import { Router } from 'express'
import { findAll, getFromHost, getNotification, saveNotification } from './route.controller.js'

const router = Router()

router.get('/inv/all', findAll)
router.get('/notifications/get', getFromHost)
router.get('/notifications/find', getNotification)
router.post('/notifications/save', (req, res) => saveNotification(req, res))

export default router
