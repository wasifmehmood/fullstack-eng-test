const url = require('url');

const getQueryParams = (reqUrl) => {
    return url.parse(reqUrl, true).query;
}

const getUrlName = (reqUrl) => {
    return url.parse(reqUrl, true).pathname;
}

const addHttpsProtocolIfNotExist = (reqUrl, callback) => {
    if(!url.parse(reqUrl, true).protocol) return callback(`https://${reqUrl}`);
    if(url.parse(reqUrl, true).protocol === 'http:') return callback(reqUrl.replace('http', 'https'));
    return callback(reqUrl);
}

const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

module.exports = {getUrlName, getQueryParams, addHttpsProtocolIfNotExist, isValidUrl};