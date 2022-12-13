const url = require('url');

/**
 * This function extracts the query parameters from the url.
 * @param {*} reqUrl 
 * @returns 
 */
const getQueryParams = (reqUrl) => {
    return url.parse(reqUrl, true).query;
}

/**
 * This function extracts the url path from the whole url.
 * @param {*} reqUrl 
 * @returns 
 */
const getUrlName = (reqUrl) => {
    return url.parse(reqUrl, true).pathname;
}

/**
 * This function adds the https:// to start if not exist or replace the http with https.
 * @param {*} reqUrl 
 * @returns 
 */
const addHttpsProtocolIfNotExist = (reqUrl) => {
    if(!url.parse(reqUrl, true).protocol) return `https://${reqUrl}`;
    if(url.parse(reqUrl, true).protocol === 'http:') return reqUrl.replace('http', 'https');
    return reqUrl;
}

/**
 * This function checks for the url validity.
 * @param {*} urlString 
 * @returns 
 */
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