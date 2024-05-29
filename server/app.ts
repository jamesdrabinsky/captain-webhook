import express from 'express';
import { createNewBinId } from './helpers'
import path from 'path'

const app = express();
const port = 3000;

app.use((req: any, _, next) => {
  console.log('Subdomain:', req.headers.host.split('.')[0]);
  next();
});

// // Middleware to handle all request methods for the same path
app.use('/bin/:bin_id', (req, res) => {
  const { method, url, headers, query, body } = req;
  console.log({method, url, headers, query, body});

  res.send(`Handled ${req.method} request`);
});

// To serve public directory for the path '/public/bins/:bin_id'
app.use('/public/bin/:bin_id', express.static(path.join(__dirname, '../client/public')));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);
});

app.post('/api/create_new_bin', async (_, res) => {
  // create new bin id
  // add check to ensure not a duplicate
  // store bin id in postgres
  const binId = await createNewBinId()
  console.log(binId)

  res.redirect(`/public/bin/${binId}`)
})

// API
// Get info about specific request
app.get('/api/:bin_id/requests/:request_id', () => {
  return {}
})

app.get('/api/:bin_id', () => {
  // logic to get all requests for a specific binId
  // interacting with postgres to select all requests from request where requestbin_id == binId
  return [{path: 'google.com', method: 'POST', time:'3:00PM', id: uuidv4()}]
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);

// visit localhost:3000
// assuming you have done 1) npm init 2) npm install express

// https://7440-76-23-45-191.ngrok-free.app
// https://ecf6-76-23-45-191.ngrok-free.app/