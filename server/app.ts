import express from 'express';
import path from 'path';
import { createNewBinId } from './helpers'

const app = express();
const port = 3000;

app.use((req: any, _, next) => {
  console.log('Subdomain:', req.headers.host.split('.')[0]);
  next();
});


// // Middleware to handle all request methods for the same path
app.use('/r/:bin_id', (req, res) => {
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);

  res.send(`Handled ${req.method} request`);
});

// To serve public directory for the path '/static'
app.use('/static', express.static(path.join(__dirname, '../client/public')));

app.get('/', (_, res) => {

  res.send('<h1>Hello World!</h1>');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);
});

// app.get('/api/create_new_bin', async (_, res) => {
app.get('/r', async (_, res) => { 
  // create new bin id
  // add check to ensure not a duplicate
  // store bin id in postgres
  const binId = await createNewBinId()
  console.log(binId)

  // redirect to /:bin_id
  res.redirect(`/r/${binId}`)
})

// API
app.get('/api/:bin_id/requests/:request_id', () => {
  return {}
})

// below route represents the URL that users will use to see UI for a specific bin
app.get('public/bins/:bin_id', () => {
  return
})


// Handle incoming requests to bin
app.get('/r/:bin_id', (_, res) => {
  // console.log(`Method: ${req.method}`);
  // console.log(`URL: ${req.url}`);
  // console.log('Headers:', req.headers);
  // console.log('Query Params:', req.query);
  // console.log('Body:', req.body);
  // this route handles get requests to the bin url
 // https://726ce8044780.ngrok.app/r/05cd6ca264814
  // const test_obj = req
  // console.log('test')
  // console.log(test_obj)
  res.send('<h1>Worked!</h1>')
})
app.post('r/:bin_id', (req) => {
  console.log('body', req.body)
})
//app.delete('r/:bin_id')




app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);

// visit localhost:3000
// assuming you have done 1) npm init 2) npm install express

// https://7440-76-23-45-191.ngrok-free.app
// https://ecf6-76-23-45-191.ngrok-free.app/