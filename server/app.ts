import express from 'express';
import path from 'path';
import createNewBinId from './helpers';

const app = express();
const port = 3000;

app.use((req: any, _, next) => {
  console.log('Subdomain:', req.headers.host.split('.')[0]);
  next();
});

// To serve public directory for the path '/static'
app.use('/static', express.static(path.join(__dirname, '../client/public')));

app.get('/', (_, res) => {
  const binId = createNewBinId()
  console.log(binId)
  console.log(path.join(__dirname, '../client/public'))

  res.send('<h1>Hello World!</h1>');
  // console.log(`Method: ${req.method}`);
  // console.log(`URL: ${req.url}`);
  // console.log('Headers:', req.headers);
  // console.log('Query Params:', req.query);
  // console.log('Body:', req.body);
  // const pushThisIntoMongo = {
  //   headers: req.headers,
  //   body: req.body
    // ...
  // }
  // await the mongoId
  // push info to psql request table using the object

  
  // 
});

// Serving up static html from client folder
app.get('/static_html', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'))
  console.log(path.join(__dirname, '../client/public', 'index.html'));
});



app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);

// visit localhost:3000
// assuming you have done 1) npm init 2) npm install express

// https://7440-76-23-45-191.ngrok-free.app
// https://ecf6-76-23-45-191.ngrok-free.app/