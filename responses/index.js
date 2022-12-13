const { handleSuccessResponse, handle404 } = require("./response");
const { HTTP_CODES } = require("./statusCodes");

module.exports = { handleSuccessResponse, handle404, HTTP_CODES };