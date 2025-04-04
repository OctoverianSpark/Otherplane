import { app, BrowserWindow, ipcMain, Notification, screen } from 'electron'
import { getNotificationByID, getNotificationsByHost, useWebSocket } from './utils.js'
import { closeWhenBlur, makeTray, opacify } from './setWinStyles.js'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import { is } from '@electron-toolkit/utils'

const filepath = fileURLToPath(import.meta.url)
const appPath = path.dirname(filepath)

const createWindow = () => {
  const mw = new BrowserWindow({
    width: 400,
    height: 700,
    show: true,
    frame: false,
    resizable: false,
    title: 'Avisos',
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: false
    },
    icon: path.join(app.getAppPath(), 'resources', 'icon.png')
  })

  const modal = new BrowserWindow({
    parent: mw,
    show: false,
    resizable: false,
    frame: false,
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: false,
      
    }
    
  })
  modal.on('close', e => {
    e.preventDefault()
    modal.hide()
  })

  if (is.dev) {
    mw.loadURL('http://localhost:5173')
    modal.loadURL('http://localhost:5173/modal.html')
  } else {
    mw.loadFile(path.join(appPath, '../renderer/index.html'))
    modal.loadFile(path.join(appPath, '../renderer/modal.html'))
  }

  mw.setMenuBarVisibility(false)
  modal.setMenuBarVisibility(false)

  mw.on('close', e => {
    e.preventDefault()
    mw.hide()
  })

  makeTray(mw)
  opacify(mw)
  closeWhenBlur(mw)
  closeWhenBlur(modal)
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width } = primaryDisplay.workAreaSize

  mw.setBounds({
    x: width - mw.getBounds().width,
    y: 0,
    width: mw.getBounds().width,
    height: mw.getBounds().height
  })

  return { mw, modal }
}

app.on('ready', e => {
  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
  });

  const { mw, modal } = createWindow()
  let ws = useWebSocket('ws://localhost:5001')

  ws.on('open', e => console.log('Cliente Conectado'))
  ws.on('message', message => {
    const msg = JSON.parse(Buffer.from(message))
    if (msg.destination === os.hostname() || msg.destination === 'all') {
      mw.webContents.send('notification', JSON.stringify(msg))
      const not = new Notification({
        title: msg.title,
        body: msg.body,
        icon: path.join(app.getAppPath(), 'resources', 'bell.svg')
      })
      not.show()
    }
  })

  
  ws.on('close', () => {
    console.log('Conexión cerrada, intentando reconectar...')
    const reconnectInterval = setInterval(() => {
      ws = useWebSocket('ws://localhost:5001')
      ws.on('open', () => {
        console.log('Reconexión exitosa')
        clearInterval(reconnectInterval)
      })
      ws.on('message', message => {
        const msg = JSON.parse(Buffer.from(message))
        if (msg.destination === os.hostname() || msg.destination === 'all') {
          mw.webContents.send('notification', JSON.stringify(msg))
          const not = new Notification({
            title: msg.title,
            body: msg.body,
            icon: path.join(app.getAppPath(), 'resources', 'bell.svg')
          })
          not.show()
        }
      })
    }, 5000) // Intentar reconectar cada 5 segundos
  })
  ipcMain.handle('ask-for-notifications', async () => {
    console.log('Datos solicitados por Renderer')
    try {
      const res = await getNotificationsByHost()
      return res.data ?? []
    } catch (err) {
      return []
    }
  })

  ipcMain.on('modal-close-petition', () => {
    console.log('Cerrando Modal')
    modal.hide()
  })

  ipcMain.handle('get-notification', async (_event, id) => {
    try {
      const res = await getNotificationByID(id)
      modal.webContents.send('send-to-modal', res.data)
      console.log('Enviando al Modal')
      modal.show()
      return res.data
    } catch (error) {
      const res = { err: 'Error' }
      return res
    }
  })

})
