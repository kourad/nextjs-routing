const AJV = require('ajv')
const fs = require('fs')
const path = require('path')
const { BadRequestError } = require('./errorHandler');

//const restify_errors = require('restify-errors')

let ajv = new AJV({useDefaults: true})


// crear el middleware especifico...
exports.authorizeHttpParams = (schema, type='body') =>
{
    return function authorizeHttpParams(req, res, next)
    {
        if( !schema ){
            // return next( new restify_errors.MissingParameterError('authorizeHttpParams:: No schema found!') )
            return next( new Error('authorizeHttpParams:: No schema found!') )
        }
        
        try
        {
            let data
            switch( type )
            {
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
                    data = Object.assign({}, req.body, req.params, req.query)
                    break;
                default:
                    //return next( new restify_errors.InvalidArgumentError(`authorizeHttpParams:: The arguments are invalid on ${req.route.path}`) )
                    return next( new Error(`authorizeHttpParams:: The arguments are invalid on ${req.uri}`) );
                    
            }

            if(!data){
                // return next( new restify_errors.BadRequestError(`authorizeHttpParams:: No data provided  on ${req.route.path}`) )
                return next( new Error(`authorizeHttpParams:: No data provided  on ${req.uri}`) );
            }
               
            
            
            let aux = []
            if( typeof schema === 'string' )
                aux.push( schema )
            else if( Array.isArray(schema) )
                aux = schema;
            else {
                // return next( new restify_errors.InvalidArgumentError(`authorizeHttpParams:: Schema need to be a String or Array  on ${req.route.path}`) )
                return next( new Error(`authorizeHttpParams:: Schema need to be a String or Array  on ${req.uri}`) )
            }
                
            let result = aux.find( value => ajv.validate(value, data) )
            if( !result ){
                // return next( new restify_errors.BadRequestError(`authorizeHttpParams:: Bad request Error  on ${req.route.path}`) )
                return next( new BadRequestError(`authorizeHttpParams:: Bad request Error  on ${req.uri}`) )
            }
                
            // save the schema pased on the request map. Useful for chain data
            req.set(result, true);    
            next()
        }
        catch(error)
        {
            return next( error )
        }

    }
}
//console.log(`${COLORS.getTime()} ${COLORS.FCL_BLUE}authorizeHttpParams ${COLORS.RESET} middleware was created!`)

exports.getAJVLastError = () => 
{
    return ajv.errors;
}

function readSchemas() {
    const config = require(path.resolve(process.cwd(), ".nextjs-routing.config.js"));
    ajv = new AJV(config.authorizeHttpParams.ajv)
    let count = 0;
    const folder = config.authorizeHttpParams.schemasFolder;
    fs.readdirSync( path.resolve( process.cwd(), folder) ).forEach((filename) => {
        try
        {
            if(filename !== 'definitions.json' && filename.endsWith('.json'))
            {
                let schema = JSON.parse( fs.readFileSync( path.resolve(process.cwd(), folder, filename ), 'utf8' ));
                ajv.compile(schema)
                count++
            } 
        }
        catch( error )
        {
            // TODO: Show the error and throw again
            //console.log( `${COLORS.getTime()} Error in Schema: ${COLORS.FCL_RED}${filename}${COLORS.RESET}` )
        }
    });
}

readSchemas();
