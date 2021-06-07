const AJV = require('ajv')
const addFormats = require("ajv-formats");

const ajv = new AJV({ useDefaults: true })
addFormats(ajv);

exports.ajv = ajv;

exports.configSchema = (schemas) => {
    return (req, res, next) => {

        if (!Array.isArray(schemas)) {
            return new Error('You should pass an array with all schemas to use');
        }
        for (const schema of schemas) {
            if (!ajv.getSchema(schema.$id)) {
                ajv.compile(schema);
            }
        }
        next();

    }
}