const express = require("express");
const app = express();
const config = require("./config");
const cacheMiddleware = require("./cache-middleware");
const state = require("./state");

const getLatest = require("./routes/latest");
const anime = require("./routes/anime");
const getRelease = require("./routes/release");

const leechAwsubs = require("./leecher/short-awsubs");

app.all("*", cacheMiddleware);

app.all("*", (req, res, next) => {
  state.address = req.protocol + "://" + req.get("host") + "/";
  next();
});

app.get("/", async (req, res) => {
  const items = await getLatest();
  res.json(items);
});

app.get("/page/:page", async (req, res) => {
  const items = await getLatest(req.params.page);
  res.json(items);
});

app.get("/anime/", async (req, res) => {
  const list = await anime.getAnimeList({});
  res.json(list);
});

app.get("/anime/page/:page", async (req, res) => {
  const info = await anime.getAnimeList({ page: req.params.page });
  res.json(info);
});

app.get("/genre/:genre", async (req, res) => {
  const info = await anime.getAnimeList({ genre: req.params.genre });
  res.json(info);
});

app.get("/genre/:genre/page/:page", async (req, res) => {
  const info = await anime.getAnimeList({
    genre: req.params.genre,
    page: req.params.page
  });
  res.json(info);
});

app.get("/search/:query", async (req, res) => {
  const info = await anime.getAnimeList({ search: req.params.query });
  res.json(info);
});

app.get("/search/:query/page/:page", async (req, res) => {
  const info = await anime.getAnimeList({
    search: req.params.query,
    page: req.params.page
  });
  res.json(info);
});

app.get("/anime/:anime", async (req, res) => {
  const info = await anime.getAnime(req.params.anime);
  res.json(info);
});

app.get("/release/:id", async (req, res) => {
  const data = await getRelease(req.params.id);
  res.json(data);
});

app.get("/get/:url", async (req, res) => {
  const url = Buffer.from(req.params.url, "base64").toString("ascii");
  const result = await leechAwsubs.tryLeech(url);
  res.redirect(result);
});

const server = app.listen(config.PORT, () => {
  const address = server.address();
  console.log("Server started.", address);
});
