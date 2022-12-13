const { getUrlName } = require('../utils');
const { titleRequestHandler } = require("./title.routes");

const requestHandler = async (req, res) => {
    const {url} = req;

    if(getUrlName(url) === '/I/want/title') {
        return titleRequestHandler(req, res);
    }
}
module.exports = requestHandler;