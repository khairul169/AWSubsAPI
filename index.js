const express = require('express');
const app = express();
const config = require('./config');

const getLatest = require('./routes/latest');
const anime = require('./routes/anime');
const getRelease = require('./routes/release');

app.get('/', async (req, res) => {
  const items = await getLatest();
  res.json(items);
});

app.get('/page/:page', async (req, res) => {
  const items = await getLatest(req.params.page);
  res.json(items);
});

app.get('/anime/', async (req, res) => {
  const list = await anime.getAnimeList();
  res.json(list);
});

app.get('/anime/:anime', async (req, res) => {
  const info = await anime.getAnime(req.params.anime);
  res.json(info);
});

app.get('/release/:id', async (req, res) => {
  const data = await getRelease(req.params.id);
  res.json(data);
});

const server = app.listen(config.PORT, () => {
  console.log('Server started.');
});
