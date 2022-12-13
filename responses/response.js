const { HTTP_CODES } = require("./statusCodes");

/**
 * This function handles the success response.
 * @param {*} res 
 * @param {*} html 
 * @returns 
 */
const handleSuccessResponse = (res, html) => {
    res.statusCode = HTTP_CODES.SUCCESS;
    res.setHeader('Content-Type', 'text/html');
    res.write(html);
    return res.end();
}

/**
 * This function handles the error 404 response.
 * @param {*} res - HTTP response handler
 * @returns 
 */
const handle404 = (res) => {
    res.statusCode = HTTP_CODES.NOT_FOUND;
    return res.end('Not Found');
}

module.exports = { handleSuccessResponse, handle404 }