import axios from 'axios'
import WebSocket from 'ws'
import os from 'os'

export function useWebSocket (host) {
  const ws = new WebSocket('ws://localhost:5001')
  return ws
}

export async function getNotificationsByHost () {
  const host = os.hostname()
  const data = await axios.get('https://apitester.asistentevirtualsas.com/notifications/get', {
    params: {
      host
    }
  })

  return data
}

export async function getNotificationByID (id) {
  const data = await axios.get('https://apitester.asistentevirtualsas.com/notifications/find', {
    params: {
      id
    }
  })

  return data
}
