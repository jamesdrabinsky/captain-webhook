import express from 'express';
import { writeBinId } from './helpers'

const app = express();
const port = 3000;

app.use((req: any, _, next) => {
  console.log('Subdomain:', req.headers.host.split('.')[0]);
  next();
});

app.get('/', (_, res) => {
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

app.get('/r', async (_, res) => {
  // create new bin id
  // add check to ensure not a duplicate
  // store bin id in postgres
  const binId = await writeBinId()
  console.log(binId)

  // redirect to /:bin_id
  res.redirect(`/r/${binId}`)
})

app.get('/r/:bin_id', (_, res) => {
  res.send('<h1>Worked!</h1>')
})


app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);

// visit localhost:3000
// assuming you have done 1) npm init 2) npm install express

// https://7440-76-23-45-191.ngrok-free.app
// https://ecf6-76-23-45-191.ngrok-free.app/