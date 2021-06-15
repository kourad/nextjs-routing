const semver            = require('semver')
const { BadRequestError } = require('./errorHandler');
const { ajv } = require('./schemaTools');


function* runHandler(handlers, req, res, callback)
{
    for( let i = 0; i < handlers.length; i++ )
    {
        handlers[i](req, res, callback);
        yield i;
    }
}


function conditionalSchema( candidates, type = 'body' ) {
    return function(req, res, next) {
        let versionRequest = req.headers.version || "0.0.0"; // -> default version

        let data
        switch (type) {
            case 'body':
                data = req.body;
                break;
            case 'query':
                data = req.query;
                break;
            case 'params':
                data = req.params;
                break;
            case 'all':
                data = Object.assign({}, req.body, req.params, req.query);
                break;
            default:
                //return next( new restify_errors.InvalidArgumentError(`authorizeHttpParams:: The arguments are invalid on ${req.route.path}`) )
                return next(new Error(`authorizeHttpParams:: The arguments are invalid on ${req.url}`));

        }

        if (!data) {
            // return next( new restify_errors.BadRequestError(`authorizeHttpParams:: No data provided  on ${req.route.path}`) )
            return next(new Error(`authorizeHttpParams:: No data provided  on ${req.url}`));
        }


        let candidate = candidates.find( obj => 
        {
            // Check version    
            if( obj.version )
            {
                if( !semver.satisfies(versionRequest, obj.version) )
                    return false; 
            }


            // Search conditions maybe it don't have any condition...
            if( obj.conditions )
            {
                for( let key in obj.conditions )
                {
                    //if( !req.get(key) )
                    if( ajv.validate(key, data) === obj.conditions[key] )
                        return true
                }
            }
            return false
        } )
        
        if( !candidate )
            return next( new BadRequestError("conditionalSchema:: conditions are not satisfied")  )
        

        if( !Array.isArray(candidate.handler) )
        {
            candidate.handler( req, res, (response)=> {
                next(response)
            } )
        }
        else
        {
            // candidate have an array of functions
            let done = false;

            //let cb = runHandler()
            let cb = runHandler( candidate.handler, req, res, (response) => {
                if( response instanceof Error )
                {
                    return next( response )
                }
                
                if( !done )
                    setTimeout( () => {done = cb.next().done; if(done) next(response)}, 0);
                else
                    next( response )
            } )
            done = cb.next().done
        }
    }
}



module.exports = conditionalSchema;