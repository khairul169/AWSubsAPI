const axios = require('axios').default;
const cheerio = require('cheerio');
const consts = require('../consts');

const onAnimeList = (body) => {
    let $ = cheerio.load(body);

    const items = [];

    $('.series').map((index, element) => {
        const item = $(element);

        const title = item.text();
        const url = item.attr('href');
        const id = url.split('/')[4];

        items.push({ id, title, url });
    });

    return items;
}

const getAnimeList = async (anime) => {
    try {
        let url = 'https://awsubs.tv/anime/?list';
        let response = await axios.get(url);

        return {
            status: 0,
            result: onAnimeList(response.data)
        };
    } catch (e) {
        return e.response && e.response.status === 404 ? consts.ERROR_404 : consts.ERROR_UNEXPECTED;
    }
}

const parseAnimeInfo = (name, value, info) => {
    switch (name) {
        case 'Japanese':
            info.japanese = value;
        case 'Type':
            info.type = value;
        case 'Status':
            info.status = value;
        case 'Episodes':
            info.episodes = value;
        case 'Producers':
            info.producers = value;
        case 'Genres':
            info.genres = value;
        case 'Duration':
            info.duration = value;
        case 'Score':
            info.score = value;
        case 'Views':
            info.views = value;
        case 'Posted by':
            info.author = value;
        case 'Posted on':
            info.date = value;
        default:
            break;
    }
    return info;
}

const onLoaded = (body) => {
    let $ = cheerio.load(body);

    const title = $('article h1').text();
    const image = $('article .imgprop img').attr('src');
    const info = {};
    const items = [];

    $('article ul').children('li').map((index, element) => {
        const item = $(element);

        const title = item.find("span a").text().trim();
        const url = item.find("span a").attr('href');
        const id = typeof url == 'string' && url.split('/')[3];

        title.length && items.push({ id, title, url });
    });

    $('article .listinfo tbody').children('tr').map((index, element) => {
        const item = $(element);

        const name = item.find('th').text().trim();
        const value = item.find('td').text().trim();
        parseAnimeInfo(name, value, info);
    });

    return { title, image, info, items };
}

const getAnime = async (anime) => {
    try {
        let url = 'https://awsubs.tv/anime/' + anime + '/';
        let response = await axios.get(url);

        return {
            status: 0,
            result: onLoaded(response.data)
        };
    } catch (e) {
        return e.response && e.response.status === 404 ? consts.ERROR_404 : consts.ERROR_UNEXPECTED;
    }
}

module.exports = {
    getAnimeList,
    getAnime
};
