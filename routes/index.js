const { titleRequestHandler } = require("./title.routes");
const { handle404 } = require("../responses");
const { getUrlName } = require('../utils');

/**
 * This function handle all the routes on the server.
 * @param {*} req - Http request handler
 * @param {*} res - Http response handler
 * @returns 
 */
 const requestHandler = (req, res) => {
    const { url } = req;

    if(getUrlName(url) === '/I/want/title') {
        return titleRequestHandler(req, res);
    }
    
    return handle404(res);
}


module.exports = requestHandler;