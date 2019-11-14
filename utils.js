const stripWpUrl = url => {
  return url.replace(/i[0-9].wp.com\//g, "");
};

module.exports = { stripWpUrl };
