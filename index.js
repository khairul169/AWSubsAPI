const express = require('express');
const app = express();

const getLatest = require('./routes/latest');
const getRelease = require('./routes/release');

app.get('/', async (req, res) => {
  const items = await getLatest();
  res.json(items);
});

app.get('/page/:page', async (req, res) => {
  const items = await getLatest(req.params.page);
  res.json(items);
});

app.get('/release/:id', async (req, res) => {
  const data = await getRelease(req.params.id);
  res.json(data);
});

const server = app.listen(8080, () => {
  console.log('Server started.');
});
