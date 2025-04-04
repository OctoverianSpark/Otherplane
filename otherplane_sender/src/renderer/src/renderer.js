const $ = selector => document.querySelector(selector)

const $$ = selector => document.querySelectorAll(selector)



window.api.requestInventory().then((response) => {
   console.log(response)

   const $select = $('#destination')


   response.forEach( item => {
      const option = document.createElement('option')
      option.value = item.nombre_equipo
      option.textContent = item.nombre_equipo
      $select.appendChild(option)
   } )

})



const $form = $("form")


$form.addEventListener('submit', (e) => { 

   e.preventDefault()

   const formData = new FormData(e.target)

   let body = {}


   for (const [key, value] of formData.entries()) {
      body[key] = value
   }

   console.log(JSON.stringify(body))
   window.api.sendMessage('new-notification', JSON.stringify(body))
   


})


