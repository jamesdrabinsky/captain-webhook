import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import {
  createAndAddNewBinId,
  addToMongo,
  addToPostgres,
  getRequestsFromPostgres,
  getRequestFromPostgres,
} from './helpers';
// @ts-ignore
import fetchOpenAIOutput from './ai';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// To serve public directory for the path '/public/bins/:bin_id'
app.use(
  '/public/bin/:bin_id',
  express.static(path.join(__dirname, '../client/public')),
);

app.use('/', express.static(path.join(__dirname, '../client/public')));

// // Middleware to handle all request methods for the same path
app.all('/bin/:bin_id', async (req, res) => {
  console.log('WEBHOOK body test', req, req.body)
  const { method, url, headers, query, body } = req;
  console.log({ method, url, headers, query, body });
  // console.log('error related to app.all route');
  const mongoRequestId = await addToMongo(req);
  const requestId = uuidv4();

  // console.log('bin_id = ', req.params.bin_id, ' ', typeof req.params.bin_id);
  await addToPostgres(
    method,
    url,
    mongoRequestId,
    req.params.bin_id,
    requestId,
  );

  res.send(`Handled ${req.method} request`);
  return mongoRequestId;
});

app.post('/api/ai', async (req, res) => {
  try {
    // console.log(req.body);
    const text = await fetchOpenAIOutput(req.body.prompt);
    res.json({ text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.get('/public/bin/:bin_id', (_, res) => {
//   console.log('redirected');
//   res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
// });

// app.get('/', (req, res) => {
// });

app.post('/api/create_new_bin', async (_, res) => {
  // create new bin id
  // add check to ensure not a duplicate
  // store bin id in postgres
  const binId = await createAndAddNewBinId();
  console.log({ binId });
  res.json(binId);
  // res.redirect(`/public/bin/${binId}`);
});

// API
// Get info about specific request
// user flow - when they click on a request within the full request table for a bin
// This route returns null if doesn't exist, else return obj with request info
app.get('/api/:bin_id/requests/:request_id', async (req, res) => {
  console.log('request', req.params.bin_id, req.params.request_id);
  const request = await getRequestFromPostgres(
    req.params.bin_id,
    req.params.request_id,
  );
  console.log(request);
  res.json(request);
});

app.get('/api/:bin_id', async (req, res) => {
  // logic to get all requests for a specific binId
  // interacting with postgres to select all requests from request where requestbin_id == binId
  console.log('requestssss', req.params.bin_id);
  const requests = await getRequestsFromPostgres(req.params.bin_id);
  console.log({ requests });
  res.json(requests);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);

// visit localhost:3000
// assuming you have done 1) npm init 2) npm install express

// https://7440-76-23-45-191.ngrok-free.app
// https://ecf6-76-23-45-191.ngrok-free.app/
