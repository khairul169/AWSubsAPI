const axios = require('axios').default;
const cheerio = require('cheerio');
const consts = require('../consts');

const parseAuthor = (string) => {
  let author = string.match(/oleh(.*)rilis/im)[1].trim();
  author = author.substr(0, author.length - 1);
  return author;
}

const parseDate = (string) => {
  let date = string.match(/hari(.*)lihat/im)[1].trim();
  date = date.substr(0, date.length - 1);
  return date;
}

const onLoaded = (body) => {
  let $ = cheerio.load(body);

  const title = $('article h1').text();
  const image = $('.maincontent a img').attr('src');
  const uploads = [];

  let linkItemTitle = null;

  // get download links
  $('.dl-box').children().map((index, element) => {
    let e = $(element);

    // title
    if (e.hasClass('dl-title')) {
      linkItemTitle = e.text();
      return;
    }

    // links
    if (e.hasClass('dl-item') && linkItemTitle !== null) {
      const links = [];

      e.find('a').map((index, elem) => {
        const item = $(elem);
        links.push({ name: item.text(), url: item.attr('href') });
      });

      uploads.push({ name: linkItemTitle, links });
      linkItemTitle = null;
    }
  });

  const subtitle = $('article .dtl span').text();
  const author = parseAuthor(subtitle);
  const date = parseDate(subtitle);

  return { title, image, author, date, uploads };
}

const getRelease = async (id) => {
  try {
    let response = await axios.get('https://awsubs.tv/' + id + '/');

    return {
      status: 0,
      result: onLoaded(response.data)
    };
  } catch (e) {
    return e.response && e.response.status === 404 ? consts.ERROR_404 : consts.ERROR_UNEXPECTED;
  }
}

module.exports = getRelease;
