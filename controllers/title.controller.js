const Axios = require('axios-observable').Axios;
const { combineLatest, of, catchError, map } = require('rxjs');
const { getQueryParams, addHttpsProtocolIfNotExist, isValidUrl } = require('../utils');
const { handleSuccessResponse, handle404, HTTP_CODES } = require('../responses');
const { constants } = require('../config/contant');

/**
 * This function extracts the the text inside the title tag from html.
 * @param {*} html - The html data passed.
 * @returns title.
 */
const scrapeTitle = (html) => {
    try {
        return html.split('<title>')[1].split('</title>')[0];
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
const getRequest = (url, errResponse) => {
    return Axios.get(url, {
        headers: {
            "Accept-Encoding": "gzip,deflate,compress"
        }
    }).pipe(catchError(_ => of(errResponse)));
}

const prepareErrObj = (address) => {
    return { config: { address }, reason: 'Invalid URL' };
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
    if (Array.isArray(address)) {
        const validatedAddresses = address.map((value) => {
            return { value, isValid: isValidUrl(value) };
        });

        const allObs = validatedAddresses.map(address => address.isValid ? getRequest(addHttpsProtocolIfNotExist(address.value), prepareErrObj(address.value)).pipe(map((res) => {
            res.config.address = address.value;
            return res;
        })) : of(prepareErrObj(address.value)));

        return combineLatest(allObs).subscribe({
            next: responses => {
                for (let response of responses) {
                    if (response.status !== HTTP_CODES.SUCCESS) {
                        const { config: { address } } = response;
                        mappedTitles.push({ address, title: constants.TITLE.NO_RESPONSE });
                        continue;
                    }
                    const { data, config: { address } } = response;
                    let title = scrapeTitle(data);
                    mappedTitles.push({ address, title });
                }
            },
            complete: () => {
                handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
            }
        });
    }

    // If is a single address and a valid URL.
    if (address && isValidUrl(address)) {
        return getRequest(addHttpsProtocolIfNotExist(address), prepareErrObj(address))
            .subscribe({
                next: response => {
                    const { data } = response;
                    let title = scrapeTitle(data);
                    mappedTitles.push({ address, title });
                },
                complete: () => {
                    handleSuccessResponse(res, prepareHTMLResponse(mappedTitles));
                }
            });
    }
}

module.exports = { getTitle };