const express = require('express');
const app = express();

const getLatest = require('./routes/latest');
const getAnime = require('./routes/anime');
const getRelease = require('./routes/release');

app.get('/', async (req, res) => {
  const items = await getLatest();
  res.json(items);
});

app.get('/page/:page', async (req, res) => {
  const items = await getLatest(req.params.page);
  res.json(items);
});

app.get('/anime/:anime', async (req, res) => {
  const anime = await getAnime(req.params.anime);
  res.json(anime);
});

app.get('/release/:id', async (req, res) => {
  const data = await getRelease(req.params.id);
  res.json(data);
});

const server = app.listen(8080, () => {
  console.log('Server started.');
});
