document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.querySelector('.new');
  
  newBtn.addEventListener('click', async () => {
    console.log('new btn pressed')
    const res = await fetch('/api/create_new_bin', {method: "POST"});
    const id = await res.json()
    console.log({res, id})
    // Change URL bar
    window.history.replaceState(null, "title**", `http://localhost:3000/public/bin/${id}`);
  })

  
  // add event listener for each request created
  document.querySelector('.request-log').addEventListener('click', event => {

    populateRequestDetails(event)
    
  })

  async function populateRequestDetails(event) {
    event.preventDefault()
    if (event.target.className !== 'request-btn') {
      return
    }
    // Details: Method + path test
    // Headers: Header text
    // Body: JSON string
    // const path = window.location.href
    // const binId = path.split('/').at(-2)
    // const requestId = event.target.id
    // const res = await fetch(`http://localhost:3000/api/${binId}/requests/${requestId}`);
    // const { method, url, headers, query, body } = req;
    
    const sample = {
      method: 'GET',
      path: '/sample/sample',
      headers: {
        'host': 'github.com',
        'content-type': 'application/json'
      },
      body: {
        'id': '123245dfsjkfsd',
        'timestamp': 'UTC 123255'
      }
    }
    console.log(createDetails(sample))
    console.log(createHeaders(sample))
    console.log(createBody(sample))

    document.querySelector('.request-details').append(createDetails(sample))
    document.querySelector('.request-details').append(createHeaders(sample))
    document.querySelector('.request-details').append(createBody(sample))

    // createHeaders(res)
    // createBody(res)
  }
  // 

  function createDetails(res) {
    const row = document.createElement('div')
    const col = document.createElement('div')
    const col2 = document.createElement('div')

    col.textContent = 'Details'
    col2.textContent = `${res.method} ${res.path}`

    row.append(col, col2)
    return row
  }

  function createHeaders(res) {
    const row = document.createElement('div')
    const col = document.createElement('div')
    const col2 = document.createElement('div')

    col.textContent = 'Headers'

    Object.entries(res.headers).forEach(([ key, value ]) => {
      const span = document.createElement('div')
      span.textContent = `${key} => ${value}`
      col2.append(span)
    })

    row.append(col, col2)
    return row
  }

  function createBody(res) {
    const row = document.createElement('div')
    const col = document.createElement('div')
    const col2 = document.createElement('div')

    col.textContent = 'Body'
    const code = document.createElement('code')
    code.textContent = JSON.stringify(res.body, null, 4)
    col2.append(code)

    row.append(col, col2)
    return row
  }


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

