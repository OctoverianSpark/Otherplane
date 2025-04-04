const $ = selector => document.querySelector(selector)
const par$ = (parent, selector) => parent.querySelector(selector)

const $button = $('button')
const $container = $('.container-data')

window.electron.onModalRecieved((data) => {
  const $date = par$($container, '.date')
  const $title = par$($container, '.title')
  const $body = par$($container, '.body')
  const formattedDate = `${data.date.replace('T', ' ').replace('.000Z', '')}`
  $date.textContent = formattedDate
  $title.textContent = data.title.toUpperCase()
  $body.textContent = data.body
})

$button.onclick = e => {
  window.electron.closeModal()
}
