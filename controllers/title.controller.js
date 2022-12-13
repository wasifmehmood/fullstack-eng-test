const https = require('https');
const { getQueryParams, addHttpsProtocolIfNotExist, isValidUrl } = require('../utils');
const { handleSuccessResponse, handle404 } = require('../responses');
const { constants } = require('../config/constant');

/**
 * This function extracts the the text inside the title tag from html.
 * @param {*} html - The html data passed.
 * @param {*} callback - The function executed after execution finishes.
 * @returns callback functions.
 */
 const scrapeTitle = (html, callback) => {
    try {
        const title = html.split('<title>')[1].split('</title>')[0];
        return callback(title);
    } catch (error) {
        return callback(constants.TITLE.NO_RESPONSE);
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
 * @param {*} callback - The function executed after execution finishes.
 */
 const getRequest = (url, callback, error) => {
    var str = '';

    https.get(url, function(res) {
        res.on('data', function (body) {
            str += body;
        });

        res.on('end', function () {
            return callback(str);
        });

    }).on('error', function(err){
        return error('Invalid URL');
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
    const { address } = getQueryParams(url);
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
    if(Array.isArray(address)) {

        for(let [index, url] of address.entries()) {
            
            if(!isValidUrl(url)) {
                mappedTitles.push({address: address[index], title: constants.TITLE.NO_RESPONSE});
                if(mappedTitles.length === address.length) {
                    return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
                }
                continue;
            }

            addHttpsProtocolIfNotExist(url, (urlWithProtocol) => {
                getRequest(urlWithProtocol, (response) => {
                    scrapeTitle(response, (title) => {
                        mappedTitles.push({address: address[index], title});

                        if(mappedTitles.length === address.length) {
                           return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
                        }
                    });
                }, (error) => {
                    mappedTitles.push({address: address[index], title: constants.TITLE.NO_RESPONSE});

                    if(mappedTitles.length === address.length) {
                        return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
                    }
                });
            });  
        }
    }

    // If is a single address and a valid URL.
    if(address && isValidUrl(address)) {
        addHttpsProtocolIfNotExist(address, (urlWithProtocol) => {
            getRequest(urlWithProtocol, (response) => {
                scrapeTitle(response, (title) => {
                    mappedTitles.push({address, title});
                    return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
                });
            }, () => {
                mappedTitles.push({address, title: constants.TITLE.NO_RESPONSE});
                return handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));                    
            });
        });
    }
}

module.exports = { getTitle };