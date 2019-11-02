const axios = require('axios').default;
const cheerio = require('cheerio');
const consts = require('../consts');

const parseAuthor = (string) => {
    let author = string.match(/oleh(.*)/im)[1].trim();
    return author;
}

const parseDate = (string) => {
    let date = string.match(/rilis(.*)oleh/im)[1].trim();
    date = date.substr(0, date.length - 1);
    return date;
}

const onLoaded = (body) => {
    let $ = cheerio.load(body);
    let items = [];

    $('.listupd').children().map((index, element) => {
        let obj = $(element);
        if (obj.hasClass('sticky')) {
            return;
        }

        const title = obj.find("h2 a").text();
        const url = obj.find("h2 a").attr('href');
        const image = obj.find("img").attr('src');
        const id = url.split('/')[3];

        const subtitle = $(obj.find('.dtl').children('span')[0]).text();
        const author = parseAuthor(subtitle);
        const date = parseDate(subtitle);

        items.push({ id, title, image, author, date, url });
    });

    return items;
}

const getLatest = async (page) => {
    try {
        let url = 'https://awsubs.tv/' + (page ? `page/${page}/` : '');
        let response = await axios.get(url);
        return onLoaded(response.data);
    } catch (e) {
        return e.response && e.response.status === 404 ? consts.ERROR_404 : consts.ERROR_UNEXPECTED;
    }
}

module.exports = getLatest;
