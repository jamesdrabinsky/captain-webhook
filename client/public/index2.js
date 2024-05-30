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

  // export async function getRequestsFromPostgres(binId: string): Promise<any> {
  //   try {
  //     const query = `
  //     SELECT path_name, method, request_id, to_char(created_at, 
  //     'HH24:MI:SS') || ' ' || to_char(created_at, 'FMMonth DD, YYYY') as created_at FROM request r
  //     JOIN request_bin b ON b.id = r.requestbin_id
  //     WHERE b.bin_id = $1;
  //     `;
  
  //     const result = await pool.query(query, [binId]);
  //     console.log(result.rows);
  //     return result.rows.map((obj: any) => {
  //       const { path_name, method, request_id, created_at } = obj;
  //       return { path: path_name, method, id: request_id, time: created_at };
  //     });
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error(error.message);
  //     }
  //   }
  // }

  async function populateRequestDetails(event) {
    event.preventDefault()
    if (event.target.className !== 'request-btn') {
      return
    }
    // Details: Method + path test
    // Headers: Header text
    // Body: JSON string
    const path = window.location.href
    const binId = path.split('/').at(-2)
    const requestId = event.target.id
    console.log('requestId form index.js = ', requestId)
    const response = await fetch(
      `http://localhost:3000/api/${binId}/requests/${requestId}`
    );
    const data = await response.json();
    console.log(data)
    return
    
    // const sample = {
    //   method: 'GET',
    //   path: '/sample/sample',
    //   headers: {
    //     'host': 'github.com',
    //     'content-type': 'application/json'
    //   },
    //   body: {
    //     'id': '123245dfsjkfsd',
    //     'timestamp': 'UTC 123255'
    //   }
    // }
    // console.log(createDetails(sample))
    // console.log(createHeaders(sample))
    // console.log(createBody(sample))

    // document.querySelector('.request-details').append(createDetails(sample))
    // document.querySelector('.request-details').append(createHeaders(sample))
    // document.querySelector('.request-details').append(createBody(sample))

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

//   // Create a Date object
// const dateObj = new Date("2024-05-29T16:58:09.891Z");

  // Convert to string with AM/PM time
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true // This ensures the time is in 12-hour format with AM/PM
  };

  // const formattedDate = dateObj.toLocaleString('en-US', options);

  // Store the requests in object key - req.created_at (converted to a date - just day)
  // the value is an array of all requests from that date
  // Iterate through the object and formatted all requests in each array with their date above

  function groupRequestsByDate(requests) { 
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    
    const requestsByDate = {};
    requests.forEach(({ time, method, path, id }) => {
      const dayKey = new Date(time).toLocaleString('en-US', options)
      console.log('Day Key = ', dayKey)
      requestsByDate[dayKey] ||= [];
      requestsByDate[dayKey].push({ method, path, id });
    })
    // sample data, remove when done
    requestsByDate['05/30/2024'] = [{"method": "POST", "path": "/bin/XyZ123Abc4567", "id": "3c8fcfdc-880e-4636-913b-605a13ab1fdd"}] 
    return requestsByDate
  }

  function displayDailyRequests(requestsObj) {
      //create header for date
      //create buttons for each request
      let container;
      Object.entries(requestsObj).forEach(([ date, requestsArr ]) => {
        container = document.element('div')
        const header = document.createElement('h2')
        header.textContent = date
        container.append(header)
        
        const unorderList = createRequestButtons(requestsArr)

        header.append(unorderList)
      })
      return container    
  }

  function createRequestButtons(requestArray) {
    const ul = document.createElement('ul');
        
    requestArray.forEach(({ method, path, id }) => {
      const li = document.createElement('li')
      li.classList.add('request-item')
      li.innerHTML = `
          <button class='request-btn'></button>
        `

      // Create Time options
      const btn = li.querySelector('.request-btn');
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // This ensures the time is in 12-hour format with AM/PM
      };
      
      // Formatting Dates and colors for requests - potential diff function
      const formattedDate = new Date(time).toLocaleString('en-US', timeOptions);

      let methodColor;
      switch(method) {
        case 'GET':
          methodColor = 'green';
          break
        case 'DELETE':
          methodColor = 'red';
          break
        default:
          methodColor = 'blue';
      }

      btn.innerHTML = `<span>${formattedDate} | </span>
      <span style="color: ${methodColor}; font-weight: bold;">${method}</span>
      <span> | ${path}</span>
      `
      btn.id = id;
      console.log({li})
      ul.append(li);
    });

    return ul;
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

    const requestsGrouped = groupRequestsByDate(requests)
    console.log(requestsGrouped)

    const dayContainer = displayDailyRequests(requestsGrouped)
    document.querySelector('.request-log').append(dayContainer);

    // receive requests grouped by date
    // Create header
    // Create each request within that header

    // console.log(requests)

    // // req {path: string, method: string, time: string, id}
    // const ul = document.createElement('ul');
    // requests.forEach(({ time, method, path, id }) => {
    //   const li = document.createElement('li')
    //   li.classList.add('request-item')
    //   //const btn = document.createElement()
    //   li.innerHTML = `
    //       <button class='request-btn'></button>
    //     `
    
    //   const btn = li.querySelector('.request-btn');
    //   const timeOptions = {
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit',
    //     hour12: true // This ensures the time is in 12-hour format with AM/PM
    //   };
      
    //   // Formatting Dates and colors for requests - potential diff function
    //   const formattedDate = new Date(time).toLocaleString('en-US', timeOptions);

    //   let methodColor;
    //   switch(method) {
    //     case 'GET':
    //       methodColor = 'green';
    //       break
    //     case 'DELETE':
    //       methodColor = 'red';
    //       break
    //     default:
    //       methodColor = 'blue';
    //   }

    //   btn.innerHTML = `<span>${formattedDate} | </span>
    //   <span style="color: ${methodColor}; font-weight: bold;">${method}</span>
    //   <span> | ${path}</span>
    //   `
    //   btn.id = id;
    //   console.log({li})
    //   ul.append(li);
    // })

    // document.querySelector('.request-log').append(ul);

    // display requests in this UI
  }
  
  populateRequests();
})



// curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{"username":"xyz","password":"xyz"}' \
//   http://localhost:3000/api/login