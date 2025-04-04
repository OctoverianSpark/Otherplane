import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: 'src/renderer/index.html',
          modal: 'src/renderer/modal.html'
        }
      }
    }
  },
  server:{
    port: 5170
  }
  
  
})
