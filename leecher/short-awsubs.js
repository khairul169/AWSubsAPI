const axios = require('axios').default;
const cheerio = require('cheerio');

const canLeech = (url) => {
    return url.includes('short.awsubs.co');
}

const tryLeech = async (url) => {
    return canLeech(url) ? await getUrl(url) : url;
}

const getUrl = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const result = $('.iklan .kanan a').attr('href');
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    canLeech,
    tryLeech,
    getUrl
};
