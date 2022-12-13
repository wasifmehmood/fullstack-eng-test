const { getUrlName } = require('../utils');
const { getTitle } = require('../controllers/index');

/**
 * This function handle all the routes on the server.
 * @param {*} req - Http request recieved
 * @param {*} res - Http response
 * @returns 
 */
const titleRequestHandler = async (req, res) => {
    const { method } = req;

    if(method === 'GET') {
        return getTitle(req, res);
    }
}

module.exports = { titleRequestHandler };