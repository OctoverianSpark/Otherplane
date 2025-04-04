const $ = selector => document.querySelector(selector)

const $container = $('.container-notifications')

window.electron.askForNotifications()
  .then(notifications => {
    notifications.forEach(notification => {
      newBlock(notification)
    })
  })
  .catch(err => console.log('Error: ', err)
  )

function getNotification (id) {
  window.electron.getNotification(id)
}

const newBlock = (msg) => {
  console.log(msg)

  const date = document.createElement('H4')
  const title = document.createElement('H2')
  const block = document.createElement('DIV')
  const text = document.createElement('P')
  const id = document.createElement('INPUT')
  id.type = 'hidden'
  id.value = msg.id
  const formattedDate = `${msg.date.replace('T', ' ').replace('.000Z', '')}`
  date.textContent = formattedDate
  title.textContent = msg.title
  text.textContent = 'Click para mas informacion... '
  block.appendChild(id)
  block.appendChild(date)
  block.appendChild(title)
  block.appendChild(text)
  block.classList.add('notification')
  $container.appendChild(block)
  block.onclick = () => {
    getNotification(msg.id)
  }
}

window.electron.onWebSocketMsg((msg) => {
  const parsedMsg = JSON.parse(msg)
  newBlock(parsedMsg)
})
