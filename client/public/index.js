document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.querySelector('.new');

  newBtn.addEventListener('click', async () => {
    console.log('new btn pressed');
    const res = await fetch('/api/create_new_bin', { method: 'POST' });
    const id = await res.json();
    console.log({ res, id });
    // Change URL bar
    const path = window.location.href;
    if (path.includes('www.')) {
      window.history.replaceState(
        null,
        'title**',
        `https://www.captainwebhook.xyz/public/bin/${id}`,
      );
    } else {
      window.history.replaceState(
        null,
        'title**',
        `https://captainwebhook.xyz/public/bin/${id}`,
      );
    }
    populateRequests();
    document.querySelector('.endpoint').textContent = 'Endpoint: ' + (window.location.href).replace('/public', '');
  });
  document.querySelector('.endpoint').textContent = 'Endpoint: ' + (window.location.href).replace('/public', '');

  // add event listener for each request created
  document.querySelector('.request-log').addEventListener('click', (event) => {
    console.log(event.target);
    if (event.target.matches('.request-btn, .request-btn *')) {
      const btn = event.target.closest('button');
      document.querySelector('.pirate-talk').innerHTML = '';

      document.querySelector('.request-details-grid').innerHTML = '';
      populateRequestDetails(btn);
    }
  });

  async function populateRequestDetails(btn) {
    const path = window.location.href;
    const binId = path.split('/').at(-2);
    const requestId = btn.id;
    const response = await fetch(
      `https://captainwebhook.xyz/api/${binId}/requests/${requestId}`,
    );
    const data = await response.json();
    console.log(data, data.body)

    const { method, url, headers, query, body } = data;
    const gridElement = document.querySelector('.request-details-grid');
    // 1 - header e.g. request_id and timestamp (always)
    // document.querySelector('.request-details-id').textContent = requestId;
    // const { time, date } = formatTimeAndDate(btn.dataset.time);
    // document.querySelector('.request-details-created_at').textContent =
    //   `${time} ${date}`;
    // 2 - Details e.g. Method and Path (always)
    const methodPathTitle = document.createElement('h5');
    methodPathTitle.textContent = 'Details';
    gridElement.append(methodPathTitle);
    const methodPathElement = createMethodPathDetails(method, url);
    gridElement.append(methodPathElement);
    // 3 - Headers (always? still add dynamically)
    if (headers !== '{}') {
      const headersTitle = document.createElement('h5');
      headersTitle.textContent = 'Headers';
      gridElement.append(headersTitle);
      const headersElement = createHeaders(headers);
      gridElement.append(headersElement);
    }
    // 4 - Query (sometimes, e.g. GET)
    if (query !== '{}') {
      console.log(data.query);
      const queryTitle = document.createElement('h5');
      queryTitle.textContent = 'Query';
      gridElement.append(queryTitle);
      const queryElement = createQueries(query);
      gridElement.append(queryElement);
    }
    // 5 - Body (sometimes, e.g. POST)
    if (body !== '{}') {
      const bodyTitle = document.createElement('h5');
      bodyTitle.textContent = 'Body';
      gridElement.append(bodyTitle);
      const bodyElement = document.createElement('code');
      bodyElement.classList.add('request-details-body');
      bodyElement.textContent = JSON.stringify(JSON.parse(body), null, 4);
      gridElement.append(bodyElement);
    }
  }

  function createMethodPathDetails(method, path) {
    const containerEl = document.createElement('div');
    containerEl.classList.add('request-details-details');
    containerEl.innerHTML = `

    <span style="color: ${getMethodColor(method)}; font-weight: bold;">${method}</span>
    <span>
      ${path}
    </span>
    `;
    return containerEl;
  }

  function createHeaders(headers) {
    const headersElement = document.createElement('div');
    headersElement.classList.add('request-details-headers');

    Object.entries(JSON.parse(headers)).forEach(([headerKey, headerValue]) => {
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('request-details-headers-header');
      const headerKeyElement = document.createElement('span');
      headerKeyElement.classList.add('request-details-header-key');
      headerKeyElement.textContent = headerKey;
      const headerValElement = document.createElement('span');
      headerValElement.classList.add('request-details-header-value');
      headerValElement.textContent = headerValue;
      headerDiv.append(headerKeyElement);
      headerDiv.append(headerValElement);
      headersElement.append(headerDiv);
    });
    return headersElement;
  }

  function createQueries(queries) {
    const queryElement = document.createElement('div');
    queryElement.classList.add('request-details-queries');

    Object.entries(JSON.parse(queries)).forEach(([queryKey, queryValue]) => {
      const queryDiv = document.createElement('div');
      queryDiv.classList.add('request-details-query');
      const queryKeyElement = document.createElement('span');
      queryKeyElement.classList.add('request-details-query-key');
      queryKeyElement.textContent = queryKey;
      const queryValElement = document.createElement('span');
      queryValElement.classList.add('request-details-query-value');
      queryValElement.textContent = queryValue;
      queryDiv.append(queryKeyElement);
      queryDiv.append(queryValElement);
      queryElement.append(queryDiv);
    });
    return queryElement;
  }

  function groupRequestsByDate(requests) {
    const requestsByDate = {};
    requests.forEach(({ time, method, path, id }) => {
      const dayKey = formatTimeAndDate(time).date;
      console.log('Day Key = ', dayKey);
      requestsByDate[dayKey] ||= [];
      requestsByDate[dayKey].unshift({ time, method, path, id });
    });
    
    return requestsByDate
  }

  // container
  // header - date - appended to container
  // requests - unorderd list of buttons - appended to container
  // containerList = array of div containers
  function displayDailyRequests(requestsObj) {
    let containerList = [];
    Object.entries(requestsObj).forEach(([date, requestsArr]) => {
      let container = document.createElement('div');
      const header = document.createElement('h2');
      header.textContent = date;
      container.append(header);

      const unorderList = createRequestButtons(requestsArr);

      container.append(unorderList);
      containerList.push(container);
    });

    console.log(containerList);
    return containerList.toReversed();
  }

  function formatTimeAndDate(timeDateString) {
    const dateOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // This ensures the time is in 12-hour format with AM/PM
    };

    const formattedTime = new Date(timeDateString).toLocaleString(
      'en-US',
      timeOptions,
    );
    const formattedDate = new Date(timeDateString).toLocaleString(
      'en-US',
      dateOptions,
    );
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const localTimeString = timeDateString.toLocaleString('en-US', options);
    return { time: formattedTime, date: formattedDate };
  }

  function getMethodColor(method) {
    let methodColor;
    switch (method) {
      case 'GET':
        methodColor = 'green';
        break;
      case 'DELETE':
        methodColor = 'red';
        break;
      default:
        methodColor = 'blue';
    }
    return methodColor;
  }

  function createRequestButtons(requestArray) {
    const ul = document.createElement('ul');

    requestArray.forEach(({ time, method, path, id }) => {
      const li = document.createElement('li');
      li.classList.add('request-item');

      li.innerHTML = `
          <button class='request-btn' data-time='${time}'></button>
      `;

      const formattedTime = formatTimeAndDate(time).time;

      const btn = li.querySelector('.request-btn');
      btn.innerHTML = `<span>${formattedTime} | </span>
      <span style="color: ${getMethodColor(method)}; font-weight: bold;">${method}</span>
      <span> | ${path}</span>
      `;
      btn.id = id;
      ul.append(li);
    });

    return ul;
  }

  async function sendComplexRequests(url, numRequests) {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      const headers = [
          {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer token123',
              'Large-Header': 'aaa '.repeat(10)
          },
          {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Custom-Header': 'CustomValue',
              'Another-Header': 'bbb '.repeat(10)
          },
          {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'Additional-Header': 'ccc '.repeat(10)
          },
          {
              'Authorization': 'Basic dXNlcjpwYXNz',
              'Yet-Another-Header': 'ddd '.repeat(10)
          }
      ];
      const payloads = [
          JSON.stringify({
              key1: 'value1',
              key2: 'value2',
              largeField: 'e '.repeat(1000)
          }),
          JSON.stringify({
              keyA: 'valueA',
              keyB: 'valueB',
              anotherLargeField: 'f '.repeat(1000)
          }),
          new URLSearchParams({
              param1: 'value1',
              param2: 'value2',
              longParam: 'g '.repeat(1000)
          }).toString(),
          'simple string payload',
          JSON.stringify({
              nested: {
                  key: 'nestedValue',
                  deepField: 'h '.repeat(1000)
              }
          })
      ];

      for (let i = 0; i < numRequests; i++) {
          const method = methods[Math.floor(Math.random() * methods.length)];
          const header = headers[Math.floor(Math.random() * headers.length)];
          const payload = payloads[Math.floor(Math.random() * payloads.length)];
          
          const options = {
              method: method,
              headers: header
          };

          if (method !== 'GET' && method !== 'DELETE') {
              if (header['Content-Type'] === 'application/x-www-form-urlencoded') {
                  options.body = new URLSearchParams(payload).toString();
              } else {
                  options.body = payload;
              }
          }

          const requestUrl = `${url}`;

          try {
              const response = await fetch(requestUrl, options);
              const data = await response.json();
              console.log(`Response for request ${i + 1}:`, data);
          } catch (error) {
              console.error(`Error for request ${i + 1}:`, error);
          }
      }
  }


  const btn = document.createElement('button');
  btn.classList.add('test-request');
  btn.textContent = 'SEND TEST REQUESTS';
  document.body.append(btn);

  document.querySelector('.test-request').addEventListener('click', async () => {
    console.log(window.location.href.replace('/public', ''))
    console.log('test')
    await sendComplexRequests(window.location.href.replace('/public', ''), 5)
    await populateRequests()
  });

  document.querySelector('.pirate').addEventListener('click', async () => {
    try {
        const prompt = document.querySelector('.request-details').textContent;
        const p = document.querySelector('.pirate-talk')
        p.textContent = 'Ahoy matey! 🏴‍☠️ Hold yer horses and wait fer a response from the pirate! 🏴‍☠️🦜⚓'
        const response = await fetch('https://captainwebhook.xyz/api/ai', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: prompt.slice(0, 1000) })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res = await response.json();
        console.log(res);
        p.innerHTML = res.text;
    } catch (error) {
        console.error('Error:', error);
    }
});


  async function populateRequests() {
    document.querySelector('.request-log').innerHTML = `<h2 class='log-title'>Request Log</h2>`;
    console.log(window.location.href);
    const path = window.location.href;
    const binId = path.split('/').at(-2);
    console.log(path, binId);
    console.log('right before request');
    const res = await fetch(`https://captainwebhook.xyz/api/${binId}`);
    const requests = await res.json();
    document.querySelector('.request-details-grid').innerHTML = '';


    const requestsGrouped = groupRequestsByDate(requests);
    console.log(requestsGrouped);

    const dayContainerArr = displayDailyRequests(requestsGrouped);
    document.querySelector('.request-log').append(...dayContainerArr);
  }

  populateRequests();
});
