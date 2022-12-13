const axios = require('axios');
const { constants } = require('../config/constant');
const { handle404, handleSuccessResponse } = require('../responses');
const { getQueryParams, addHttpsProtocolIfNotExist, isValidUrl } = require('../utils');

/**
 * This function extracts the the text inside the title tag from html.
 * @param {*} html - The html data passed.
 * @returns title.
 */
const scrapeTitle = (html) => {
    try {
        const title = html.split('<title>')[1].split('</title>')[0];
        return title;
    } catch (error) {
        return constants.TITLE.NO_RESPONSE;
    }
}

/**
 * This function prepares the success html response for the retrieved titles of websites.
 * @param {*} mappedTitles - Array of objects containing address and title of the requested websites.
 * @returns 
 */
const prepareHTMLResponse = (mappedTitles) => {
    return `
    <html>
        <head></head>
        <body>

        <h1> Following are the titles of given websites: </h1>

        <ul>
        ${mappedTitles.map((value) => `<li>${value.address} - "${value.title}"</li>`).join('')}
        </ul>
        </body>
    </html>`
}

/**
 * This function calls get method of the http request with the specified url.
 * @param {*} url - The url of the website
 */
const getRequest = (url) => {
    return axios.get(url, {
        headers: {
            "Accept-Encoding": "gzip,deflate,compress"
        }
    });
}

/**
 * 
 * @param {*} req - Http request handler
 * @param {*} res - Http response handler
 * @returns 
 */
const getTitle = (req, res) => {
    const { url } = req;
    let { address } = getQueryParams(url);
    const mappedTitles = [];

    // If address doesn't exist.
    if (!address) {
        return handle404(res);
    }

    // If address is not an array nor a valid URL.
    if (address && !Array.isArray(address) && !isValidUrl(address)) {
        mappedTitles.push({ address, title: constants.TITLE.NO_RESPONSE });
        return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
    }

    // If multiple addresses exists.
    if (Array.isArray(address)) {
        const validatedAddresses = address.map((value) => {
            return { value, isValid: isValidUrl(value) };
        });

        const allPromises = validatedAddresses.map(address => address.isValid ? getRequest(addHttpsProtocolIfNotExist(address.value)) : new Promise((resolve, reject) => reject({ config: { url: address.value }, reason: 'Invalid URL' })));

        Promise.allSettled(allPromises).then((responses) => {

            for (let response of responses) {
                if (response.status === 'fulfilled') {
                    const { data, config: { url } } = response.value;
                    let title = scrapeTitle(data);
                    mappedTitles.push({ address: url, title });
                    continue;
                }

                if (response.status === 'rejected') {
                    const { reason: { config: { url } } } = response;
                    mappedTitles.push({ address: url, title: constants.TITLE.NO_RESPONSE });
                }
            }
            return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
        })
    }
    
    // If is a single address and a valid URL.
    if (address && isValidUrl(address)) {
        return getRequest(addHttpsProtocolIfNotExist(address)).then((request) => {
            const { data } = request;
            let title = scrapeTitle(data);
            mappedTitles.push({ address, title });
            return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
        }).catch(() => {
            mappedTitles.push({ address, title: constants.TITLE.NO_RESPONSE });
            return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
        });
    }
}

module.exports = { getTitle }