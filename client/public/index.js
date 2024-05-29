document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.querySelector('.new');
  
  newBtn.addEventListener('click', () => {
    console.log('new btn pressed')
    // fetch('https://captainwebhook.xyz/api/create_new_bin')
  })
  
  async function populateRequests() {
    console.log(window.location.href);
    const path = window.location.href
    const binId = path.split('/').at(-2) // todo: change to regex
    console.log(path, binId)
    // await fetch(`http://localhost:3000/api/${binId}')
    // display requests in this UI
  }
  
  populateRequests();
})