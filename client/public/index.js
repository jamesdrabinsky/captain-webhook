document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.querySelector('.new');
  
  newBtn.addEventListener('click', async () => {
    console.log('new btn pressed')
    const res = await fetch('/api/create_new_bin', { method: "POST" });
    const id = await res.json();
    console.log({ res, id });
    // Change URL bar
    window.history.replaceState(null, "title**", `http://localhost:3000/public/bin/${id}`);
  });

  // add event listener for each request created
  document.querySelector('.request-log').addEventListener('click', event => {
    populateRequestDetails(event);
  });

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
    console.log(data);
    return;
  }

  // function createDetails(res) {
  //   const row = document.createElement('div');
  //   const col = document.createElement('div');
  //   const col2 = document.createElement('div');

  //   col.textContent = 'Details';
  //   col2.textContent = `${res.method} ${res.path}`;

  //   row.append(col, col2);
  //   return row;
  // }

  // function createHeaders(res) {
  //   const row = document.createElement('div');
  //   const col = document.createElement('div');
  //   const col2 = document.createElement('div');

  //   col.textContent = 'Headers';

  //   Object.entries(res.headers).forEach(([key, value]) => {
  //     const span = document.createElement('div');
  //     span.textContent = `${key} => ${value}`;
  //     col2.append(span);
  //   });

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
