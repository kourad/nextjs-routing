const { ERROR_NOT_FOUND } = require("./constants");

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


module.exports = errorHandler;