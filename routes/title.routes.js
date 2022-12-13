const { getTitle } = require('../controllers');
const { handle404 } = require('../responses');

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

    // For all the other methods.
    return handle404(res);
}

module.exports = { titleRequestHandler };