// @ts-nocheck
const { getTitle } = require('../controllers');
const { getUrlName } = require('../utils');

/**
 * This function handle all the routes on the server.
 * @param {*} req - Http request recieved
 * @param {*} res - Http response
 * @returns 
 */
const titleRequestHandler = (req, res) => {
    const { method } = req;

    if(method === 'GET') {
        return getTitle(req, res);
    }
}

module.exports = {titleRequestHandler};