import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import axios from 'axios'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  const mainWindow = createWindow();

  let ws = new WebSocket('ws://localhost:5001')

  ws.onopen = () => console.log('Conectado al WebSocket')


  ws.onclose = () => {
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
  }
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.handle("inventory-request", async () => {
    console.log("Datos solicitados por Renderer");
    try {
      const res = await axios.get(
        "https://apitester.asistentevirtualsas.com/inv/all"
      );
      return res.data ?? [];
    } catch (err) {
      return [];
    }
  });

  ipcMain.on("new-notification", (event, message) => {
    console.log("Message received from renderer:", message);
    const body = JSON.parse(message);

    axios.post("https://apitester.asistentevirtualsas.com/notifications/save", body)
      .then((response) => {
      console.log("Notification saved successfully:", response.data);
      event.reply("notification-saved", { success: true, data: response.data });
      ws.send(JSON.stringify(body))
      })
      .catch((error) => {
      console.error("Error saving notification:", error);
      event.reply("notification-saved", { success: false, error: error.message });
      });
    

  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
