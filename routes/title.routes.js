// @ts-nocheck
const axios = require('axios');
const {getUrlName, getQueryParams, addHttpsProtocolIfNotExist, isValidUrl} = require('../utils');

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
        return 'NO RESPONSE';
    }
}

/**
 * This function calls get method of the http request with the specified url.
 * @param {*} url - The url of the website
 */
const getRequest = async (url) => {
    const response = await axios.get(url, {headers: {
        "Accept-Encoding": "gzip,deflate,compress"
        }});
    return response;
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
        ${
            mappedTitles.map((value) => `<li>${value.address} - "${value.title}"</li>`).join('')
        }
        </ul>
        </body>
    </html>`
}

/**
 * This function handle all the routes on the server.
 * @param {*} req - Http request recieved
 * @param {*} res - Http response
 * @returns 
 */
const requestHandler = async (req, res) => {
    const {url, method} = req;

    if(getUrlName(url) === '/I/want/title' && method === 'GET') {
        let { address } = getQueryParams(url);
        const mappedTitles = [];

        if(Array.isArray(address)) {

            for(let [index, url] of address.entries()) {
                if(isValidUrl(url)) {
                    try {
                        let urlWithProtocol = await addHttpsProtocolIfNotExist(url);
                        let {data} = await getRequest(urlWithProtocol);
                        let title = await scrapeTitle(data);
                        
                        mappedTitles.push({address: address[index], title});    
                    } catch (error) {
                        mappedTitles.push({address: address[index], title: 'NO RESPONSE'});                        
                    }

                }else {
                    mappedTitles.push({address: address[index], title: 'NO RESPONSE'});
                }
                if(mappedTitles.length === address.length) {
                    handleSuccessResponse(res, mappedTitles);
                }
            }
        }else if(address) {
            if(isValidUrl(address)) {
                try {
                    let urlWithProtocol = await addHttpsProtocolIfNotExist(address);
                    let {data} = await getRequest(urlWithProtocol);
                    let title = await scrapeTitle(data);
                    
                    mappedTitles.push({address, title});   
                } catch (error) {
                    mappedTitles.push({address, title: 'NO RESPONSE'});
                }
            } else {
                mappedTitles.push({address, title: 'NO RESPONSE'});
            }
            handleSuccessResponse(res, mappedTitles);
        }else {
            return handle404(res);
        }
    }else {
        return handle404(res);
    }
}

/**
 * This function handles the success response for this route
 * @param {*} res 
 * @param {*} mappedTitles 
 * @returns 
 */
const handleSuccessResponse = (res, mappedTitles) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(prepareHTMLResponse(mappedTitles));
    return res.end();
}

function handle404(res) {
    res.statusCode = 404;
    return res.end('Not Found');
}

module.exports = {titleRequestHandler: requestHandler};