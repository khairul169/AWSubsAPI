const axios = require('axios').default;
const cheerio = require('cheerio');

const onLoaded = (body) => {
  let $ = cheerio.load(body);

  const title = $('article h1').text();
  const image = $('.maincontent a img').attr('src');
  const links = [];

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
      const uploads = [];

      e.find('a').map((index, elem) => {
        const item = $(elem);
        uploads.push({ name: item.text(), url: item.attr('href') });
      });

      links.push({ name: linkItemTitle, links: uploads });
      linkItemTitle = null;
    }
  });

  return { title, image, links };
}

const getRelease = async (id) => {
  try {
    let response = await axios.get('https://awsubs.tv/' + id + '/');
    return onLoaded(response.data);
  } catch (e) {
    console.log(e);
  }
}

module.exports = getRelease;
