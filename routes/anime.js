const axios = require('axios').default;
const cheerio = require('cheerio');

const onLoaded = (body) => {
    let $ = cheerio.load(body);

    const title = $('article h1').text();
    const items = [];

    $('article ul').children('li').map((index, element) => {
        let item = $(element);

        const title = item.find("span a").text().trim();
        const url = item.find("span a").attr('href');
        const id = typeof url == 'string' && url.split('/')[3];

        title.length && items.push({ id, title, url });
    });

    return { title, items };
}

const getAnime = async (anime) => {
    try {
        let url = 'https://awsubs.tv/anime/' + anime + '/';
        let response = await axios.get(url);
        return onLoaded(response.data);
    } catch (e) {
        console.log(e);
    }
}

module.exports = getAnime;
