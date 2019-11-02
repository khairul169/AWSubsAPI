const axios = require('axios').default;
const cheerio = require('cheerio');

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

        items.push({ id, title, image, url });
    });

    return items;
}

const getLatest = async (page) => {
    try {
        let url = 'https://awsubs.tv/' + (page ? `page/${page}/` : '');

        let response = await axios.get(url);
        return onLoaded(response.data);
    } catch (e) {
        console.log(e);
    }
}

module.exports = getLatest;
