const { handle404 } = require('../responses');
const { getUrlName } = require('../utils');
const { titleRequestHandler } = require("./title.routes");

const requestHandler = async (req, res) => {
    const { url } = req;

    if(getUrlName(url) === '/I/want/title') {
        return titleRequestHandler(req, res);
    }

    // For all the other routes.
    return handle404(res);
}
module.exports = requestHandler;