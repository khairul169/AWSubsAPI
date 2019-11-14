const axios = require("axios").default;
const cheerio = require("cheerio");
const consts = require("../consts");
const utils = require("../utils");

const parseAuthor = string => {
  let author = string.match(/oleh(.*)/im)[1].trim();
  return author;
};

const parseDate = string => {
  let date = string.match(/rilis(.*)oleh/im)[1].trim();
  date = date.substr(0, date.length - 1);
  return date;
};

const onLoaded = body => {
  let $ = cheerio.load(body);

  const featuredSeries = [];
  const latestReleases = [];
  const ongoingSeries = [];

  $(".postbody")
    .children(".box")
    .eq(0)
    .find(".outbx")
    .map((index, element) => {
      let obj = $(element);

      const name = obj.find(".rld h2").text();
      let seriesId = obj
        .find(".rld a")
        .attr("href")
        .split("/");
      seriesId = seriesId[seriesId.length - 2];
      const image = obj.find("img").attr("src");

      featuredSeries.push({ name, id: seriesId, image });
    });

  $(".listupd")
    .children()
    .map((index, element) => {
      let obj = $(element);
      if (obj.hasClass("sticky")) {
        return;
      }

      const title = obj.find("h2 a").text();
      const url = obj.find("h2 a").attr("href");
      const image = utils.stripWpUrl(obj.find("img").attr("src"));
      const id = url.split("/")[3];

      const subtitle = $(obj.find(".dtl").children("span")[0]).text();
      const author = parseAuthor(subtitle);
      const date = parseDate(subtitle);

      const seriesObj = $(obj.find(".dtl span").children("a"));
      const seriesName = seriesObj.text();
      let seriesId = seriesObj.attr("href").split("/");
      seriesId = seriesId[seriesId.length - 1];
      const series = {
        name: seriesName,
        id: seriesId
      };

      latestReleases.push({ id, title, image, author, date, url, series });
    });

  $(".postbody")
    .children(".box")
    .eq(1)
    .find(".outbx")
    .map((index, element) => {
      let obj = $(element);

      const name = obj.find(".rld h2").text();
      let seriesId = obj
        .find(".rld a")
        .attr("href")
        .split("/");
      seriesId = seriesId[seriesId.length - 2];
      const image = obj.find("img").attr("src");

      ongoingSeries.push({ name, id: seriesId, image });
    });

  return {
    featured: featuredSeries,
    latest: latestReleases,
    ongoing: ongoingSeries
  };
};

const getLatest = async page => {
  try {
    let url = "https://awsubs.tv/" + (page ? `page/${page}/` : "");
    let response = await axios.get(url);

    return {
      status: 0,
      result: onLoaded(response.data)
    };
  } catch (e) {
    return e.response && e.response.status === 404
      ? consts.ERROR_404
      : consts.ERROR_UNEXPECTED;
  }
};

module.exports = getLatest;
