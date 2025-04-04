const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  onWebSocketMsg: (callback) => ipcRenderer.on('notification', (_event, data) => callback(data)),
  closeModal: () => ipcRenderer.send('modal-close-petition'),
  askForNotifications: () => ipcRenderer.invoke('ask-for-notifications'),
  getNotification: (id) => ipcRenderer.invoke('get-notification', id),
  onModalRecieved: (callback) => ipcRenderer.on('send-to-modal', (_event, data) => callback(data))
})
