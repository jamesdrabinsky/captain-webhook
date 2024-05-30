document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.querySelector('.new');
  
  newBtn.addEventListener('click', async () => {
    console.log('new btn pressed')
    const res = await fetch('/api/create_new_bin', { method: "POST" });
    const id = await res.json();
    console.log({ res, id });
    // Change URL bar
    window.history.replaceState(null, "title**", `http://localhost:3000/public/bin/${id}`);

    document.querySelector('.requests-container').innerHTML = '';
  })

  // add event listener for each request created
  document.querySelector('.request-log').addEventListener('click', event => {

    populateRequestDetails(event)
    document.querySelector('.request-details-grid').innerHTML = ''; 
  })

  async function populateRequestDetails(event) {
    event.preventDefault();
    if (event.target.className !== 'request-btn') {
      return;
    }
    // Details: Method + path test
    // Headers: Header text
    // Body: JSON string
    const path = window.location.href;
    const binId = path.split('/').at(-2);
    const requestId = event.target.id;
    console.log('requestId from index.js = ', requestId);
    const response = await fetch(
      `http://localhost:3000/api/${binId}/requests/${requestId}`
    );
    const data = await response.json();

    const {method, url, headers, query, body} = data
    const gridElement = document.querySelector('.request-details-grid');
    // 1 - header e.g. request_id and timestamp (always)
    // 2 - Details e.g. Method and Path (always)
    const methodPathTitle = document.createElement('h5')
    methodPathTitle.textContent = 'Details'
    gridElement.append(methodPathTitle)
    const methodPathElement = createMethodPathDetails(method, url);
    gridElement.append(methodPathElement);
    // 3 - Headers (always? still add dynamically)
    if (headers !== '{}') {
      const headersTitle = document.createElement('h5');
      headersTitle.textContent = 'Headers';
      gridElement.append(headersTitle)
      const headersElement = createHeaders(headers)
      gridElement.append(headersElement)
    }
    // 4 - Query (sometimes, e.g. GET)
    if (query !== '{}') {
      console.log(data.query)
      const queryTitle = document.createElement('h5');
      queryTitle.textContent = 'Query';
      gridElement.append(queryTitle);
      const queryElement = createQueries(query)
      gridElement.append(queryElement)
    }
    // 5 - Body (sometimes, e.g. POST)
    if (body !== '{}') {
      const bodyTitle = document.createElement('h5');
      bodyTitle.textContent = 'Body'
      gridElement.append(bodyTitle)
      const bodyElement = document.createElement('code')
      bodyElement.classList.add('request-details-body')
      bodyElement.textContent = JSON.stringify(JSON.parse(body), null, 4)
      gridElement.append(bodyElement)
    }
  }
    
  function createMethodPathDetails(method, path) {
    const containerEl = document.createElement('div')
    containerEl.classList.add('request-details-details')
    containerEl.innerHTML = `
    <span>
      ${method}
    </span>
    <span>
      ${path}
    </span>
    `
    return containerEl
  }

  function createHeaders(headers) {
    const headersElement = document.createElement('div');
    headersElement.classList.add('request-details-headers')

    Object.entries(JSON.parse(headers)).forEach(([headerKey, headerValue]) => {
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('request-details-header');
      const headerKeyElement = document.createElement('span');
      headerKeyElement.classList.add('request-details-header-key');
      headerKeyElement.textContent = headerKey
      const headerValElement = document.createElement('span')
      headerValElement.classList.add('request-details-header-value')
      headerValElement.textContent = headerValue
      headerDiv.append(headerKeyElement)
      headerDiv.append(headerValElement)
      headersElement.append(headerDiv)
    })
    return headersElement;
  }
  
  function createQueries(queries) {
    const queryElement = document.createElement('div');
    queryElement.classList.add('request-details-queries')

    Object.entries(JSON.parse(queries)).forEach(([queryKey, queryValue]) => {
      const queryDiv = document.createElement('div');
      queryDiv.classList.add('request-details-query');
      const queryKeyElement = document.createElement('span');
      queryKeyElement.classList.add('request-details-query-key');
      queryKeyElement.textContent = queryKey
      const queryValElement = document.createElement('span')
      queryValElement.classList.add('request-details-query-value')
      queryValElement.textContent = queryValue
      queryDiv.append(queryKeyElement)
      queryDiv.append(queryValElement)
      queryElement.append(queryDiv)
    })
    return queryElement;
  }

  //   row.append(col, col2);
  //   return row;
  // }

  // function createBody(res) {
  //   const row = document.createElement('div');
  //   const col = document.createElement('div');
  //   const col2 = document.createElement('div');

  //   col.textContent = 'Body';
  //   const code = document.createElement('code');
  //   code.textContent = JSON.stringify(res.body, null, 4);
  //   col2.append(code);

  //   row.append(col, col2);
  //   return row;
  // }

  function groupRequestsByDate(requests) { 
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    
    const requestsByDate = {};
    requests.forEach(({ time, method, path, id }) => {
      const dayKey = new Date(time).toLocaleString('en-US', options);
      console.log('Day Key = ', dayKey);
      requestsByDate[dayKey] ||= [];
      requestsByDate[dayKey].push({ time, method, path, id });
    });
    // sample data, remove when done
    requestsByDate['05/28/2024'] = [{"method": "POST", "path": "/bin/XyZ123Abc4567", "id": "3c8fcfdc-880e-4636-913b-605a13ab1fdd"}];
    return requestsByDate;
  }

  // container
  // header - date - appended to container
  // requests - unorderd list of buttons - appended to container
  // containerList = array of div containers
  function displayDailyRequests(requestsObj) {
      let containerList = []
      Object.entries(requestsObj).forEach(([ date, requestsArr ]) => {
        let container = document.createElement('div')
        const header = document.createElement('h2');
        header.textContent = date;
        container.append(header);
        
        const unorderList = createRequestButtons(requestsArr);

        container.append(unorderList);
        containerList.push(container)
      });

      console.log(containerList)
      return containerList;
  }

  function createRequestButtons(requestArray) {
    const ul = document.createElement('ul');
    
    requestArray.forEach(({ time, method, path, id }) => {
      const li = document.createElement('li');
      li.classList.add('request-item');

  
      li.innerHTML = `
          <button class='request-btn'></button>
      `;

      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // This ensures the time is in 12-hour format with AM/PM
      };
      const formattedDate = new Date(time).toLocaleString('en-US', timeOptions);

      let methodColor;
      switch(method) {
        case 'GET':
          methodColor = 'green';
          break;
        case 'DELETE':
          methodColor = 'red';
          break;
        default:
          methodColor = 'blue';
      }

      const btn = li.querySelector('.request-btn');
      btn.innerHTML = `<span>${formattedDate} | </span>
      <span style="color: ${methodColor}; font-weight: bold;">${method}</span>
      <span> | ${path}</span>
      `;
      btn.id = id;
      console.log({ li });
      ul.append(li);
    }); 

    return ul;
  }

  
  populateRequests();

  function sendMultipleRequests(url) {
    const headersList = [
        {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer exampleToken1'
        },
        {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer exampleToken2'
        },
        {
            'Content-Type': 'application/json',
            'Custom-Header': 'CustomValue'
        }
    ];

    const bodyList = [
        JSON.stringify({ message: 'First request' }),
        JSON.stringify({ message: 'Second request' }),
        JSON.stringify({ message: 'Third request' })
    ];

    headersList.forEach((headers, index) => {
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: bodyList[index]
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => console.log(`Response ${index + 1}:`, data))
            .catch(error => console.error(`Error in request ${index + 1}:`, error));
    });
    
    location.reload();
  }

  const btn = document.createElement('button');
  btn.classList.add('test-request');
  btn.textContent = 'SEND TEST REQUESTS';
  document.body.append(btn);
    
  document.querySelector('.test-request').addEventListener('click', () => {
      sendMultipleRequests('http://localhost:3000/bin/80bb266e18354/');
  });
})

  async function populateRequests() {
    console.log(window.location.href);
    const path = window.location.href;
    const binId = path.split('/').at(-2);
    console.log(path, binId);
    console.log('right before request');
    const res = await fetch(`http://localhost:3000/api/${binId}`);
    const requests = await res.json();

    const requestsGrouped = groupRequestsByDate(requests);
    console.log(requestsGrouped);


    const dayContainerArr = displayDailyRequests(requestsGrouped);
    document.querySelector('.request-log').append(...dayContainerArr)
  }
  
  populateRequests();
});

