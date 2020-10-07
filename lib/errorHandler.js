const { ERROR_NOT_FOUND, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER } = require("./constants");

function errorHandler(error, req, res, next) {
    // set the errors
    if( error.message.startsWith(ERROR_NOT_FOUND) ) {
        res.statusCode = 404;
    }
    else {
        res.statusCode = 500;
    }
    res.json({
        status: res.statusCode,
        message: error.message
    });

    console.log(error)

    next();
}


class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = ERROR_NOT_FOUND;
    }
}
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = ERROR_BAD_REQUEST;
    }
}

class internalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = ERROR_INTERNAL_SERVER;
    }
}


exports.NotFoundError = NotFoundError;
exports.BadRequestError = BadRequestError;
exports.internalServerError = internalServerError;
module.exports = errorHandler;