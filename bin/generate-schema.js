var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// joi-to-json-schema currently does not support v16 of Joi (https://github.com/lightsofapollo/joi-to-json-schema/issues/57)
var convert = require('joi-to-json-schema');
var fs = require('fs');
var schema = require('../lib/draft-releases/schema').schema;
var args = process.argv.slice(2) || [];
var jsonSchema = __assign({ title: 'JSON schema for Portalnesia Actions yaml files', id: 'https://github.com/portalnesia/portalnesia-actions/blob/master/schema.json', $schema: 'http://json-schema.org/draft-04/schema#' }, convert(schema()));
// template is only required after deep merged, should not be required in the JSON schema
// we should also remove the required field in case nothing remains after the filtering to keep draft04 compatibility
var requiredField = jsonSchema.required.filter(function (item) { return item !== 'template'; });
if (requiredField.length) {
    jsonSchema.required = requiredField;
}
else {
    delete jsonSchema.required;
}
if (args[0] === 'print') {
    fs.writeFileSync('./schema.json', JSON.stringify(jsonSchema, null, 2) + "\n");
}
module.exports.jsonSchema = jsonSchema;
