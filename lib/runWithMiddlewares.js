const { ERROR_NOT_FOUND } = require("./constants");
const defaultErrorHandler = require("./errorHandler");


function* runHandler(handlers, req, res, callback)
{
    for( let i = 0; i < handlers.length; i++ )
    {
        handlers[i](req, res, callback);
        yield i;
    }
}


function runWithMiddlewares(options, errorHandler) {

    // TODO: Options should be and object with arrays
    // TODO: errorHandler should be a funcion

    return function (req, res) {
        return new Promise( (resolve, reject) => {
            req._map_runMiddlewares = new Map();
            req.set = (key, value) => {
                req._map_runMiddlewares.set(key, value);
            }
            req.get = (key) => {
                return req._map_runMiddlewares.get(key);
            }



            const middlewares = options[req.method];
            if( !Array.isArray(middlewares) || middlewares.length === 0 ) {
                const handler = errorHandler || defaultErrorHandler;
                handler(new Error(`${ERROR_NOT_FOUND} Route not found`), req, res, () => {
                    reject();
                })
                return;
            }
            // TODO: should be on if-else statment??
            
            let done = false;
            const cb = runHandler( middlewares, req, res, (response) => {
                if( response instanceof Error )
                {
                    const handler = errorHandler || defaultErrorHandler;
                    handler(response, req, res, () => {
                        reject();
                    });
                    return;
                } 
                
                if( !done ) {
                    setTimeout( () => {
                        done = cb.next().done; 
                        if(done) {
                            resolve();
                        }
                    }, 0);
                }
                else {
                    resolve();
                }
            } )
            done = cb.next().done;
            
        } )
    }
}


module.exports = runWithMiddlewares;