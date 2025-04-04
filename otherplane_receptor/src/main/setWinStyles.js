import { app, Tray } from 'electron'
import path from 'path'
export function opacify (mw) {
  mw.on('blur', () => {
    let opacity = mw.getOpacity()
    const interval = setInterval(() => {
      if (opacity > 0.3) {
        opacity -= 0.05
        mw.setOpacity(opacity)
      } else {
        clearInterval(interval)
      }
    }, 10)
  })

  mw.on('focus', () => {
    let opacity = mw.getOpacity()
    const interval = setInterval(() => {
      if (opacity < 1) {
        opacity += 0.05
        mw.setOpacity(opacity)
      } else {
        clearInterval(interval)
      }
    }, 10)
  })
}
export function closeWhenBlur (w) {
  let blurTimeout

  w.on('blur', () => {
    blurTimeout = setTimeout(() => {
      if (!w.isFocused()) {
        w.close()
      }
    }, 5000)
  })

  w.on('focus', () => {
    clearTimeout(blurTimeout)
  })
}

export function makeTray (mw) {
  const tray = new Tray(path.join(app.getAppPath(), 'resources', 'icon.png'))

  tray.on('click', e => {
    if (mw.isVisible()) {
      mw.hide()
    } else {
      mw.show()
    }
  })

  tray.setToolTip('OtherPlane App')
}

export function animate (w) {
  let y = 0
  let direction = 1
  const interval = setInterval(() => {
    const bounds = w.getBounds()
    if (y >= 10 || y <= -10) {
      direction *= -1
    }
    y += direction
    w.setBounds({ x: bounds.x, y: bounds.y + direction, width: bounds.width, height: bounds.height })
  }, 42)
  w.on('closed', () => {
    clearInterval(interval)
  })
}
