const AJV = require('ajv')
const fs = require('fs')
const path = require('path')

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
                return next( new Error(`authorizeHttpParams:: Bad request Error  on ${req.uri}`) )
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







// compilar primero las definiciones basicas


/*

let definitions = JSON.parse( fs.readFileSync( path.join(_GENERAL_PATH, 'nodeServer/schemas', 'definitions.json'), 'utf8' ) );
ajv.compile(definitions)
console.log(`${COLORS.getTime()} definitions schema loaded!`)
*/

let count = 0;

fs.readdirSync( path.resolve( process.cwd(), 'schemas') ).forEach((filename) => {
    try
    {
        if(filename !== 'definitions.json' && filename.endsWith('.json'))
        {
            let schema = JSON.parse( fs.readFileSync( path.resolve(process.cwd(), 'schemas', filename ), 'utf8' ));
            ajv.compile(schema)
            count++
        } 
    }
    catch( error )
    {
        //console.log( `${COLORS.getTime()} Error in Schema: ${COLORS.FCL_RED}${filename}${COLORS.RESET}` )
    }
});
//console.log( `${COLORS.getTime()} Loaded ${COLORS.FCL_BLUE}${count}${COLORS.RESET} additional schemas!` )


