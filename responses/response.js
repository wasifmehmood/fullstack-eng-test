const { HTTP_CODES } = require("./statusCodes");

/**
 * This function handles the success response for this route
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

function handle404(res) {
    res.statusCode = HTTP_CODES.NOT_FOUND;
    return res.end('Not Found');
}

module.exports = { handleSuccessResponse, handle404 }