const { ERROR_NOT_FOUND, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER } = require("./constants");

function errorHandler(error, req, res, next) {
    res.statusCode = error.statusCode || 500;
    res.json({
        status: error.statusCode || 500,
        message: error.message
    });
    res.end();
    next();
}


class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = ERROR_NOT_FOUND;
        this.statusCode = 404;
    }
}
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = ERROR_BAD_REQUEST;
        this.statusCode = 400;
    }
}

class internalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = ERROR_INTERNAL_SERVER;
        this.statusCode = 500
    }
}


exports.NotFoundError = NotFoundError;
exports.BadRequestError = BadRequestError;
exports.internalServerError = internalServerError;
exports.defaultErrorHandler = errorHandler;