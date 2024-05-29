document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.querySelector('.new');
  
  newBtn.addEventListener('click', () => {
    console.log('new btn pressed')
    // fetch('https://captainwebhook.xyz/api/create_new_bin')
    // 
  })

  // add event listener for each request created
  // populate 

  async function populateRequests() {
    console.log(window.location.href);
    const path = window.location.href
    const binId = path.split('/').at(-2) // todo: change to regex
    console.log(path, binId)
    console.log('right before request')
    const res = await fetch(`http://localhost:3000/api/${binId}`);
    const requests = await res.json();

    console.log(requests)

    // req {path: string, method: string, time: string, id}
    const ul = document.createElement('ul');
    requests.forEach(({ time, method, path, id }) => {
      const li = document.createElement('li')
      li.classList.add('request-item')
      //const btn = document.createElement()
      li.innerHTML = `
          <button class='request-btn'></button>
        `
    
      const btn = li.querySelector('.request-btn');
      btn.textContent = `Time: ${time} | Method: ${method} | Path: ${path}`;
      btn.id = id;
      console.log({li})
      ul.append(li);
    })

    document.querySelector('.request-log').append(ul);
    console.log({ul})
    console.log('test1')

    // display requests in this UI
  }
  
  populateRequests();
})

