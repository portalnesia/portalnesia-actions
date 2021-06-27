"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAutolabeler = exports.validateReplacers = void 0;
const log_1 = __importDefault(require("./log"));
const regex_parser_1 = __importDefault(require("regex-parser"));
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
function toRegex(search) {
    if (search.match(/^\/.+\/[gmixXsuUAJ]*$/)) {
        return regex_parser_1.default(search);
    }
    else {
        // plain string
        return new RegExp(escape_string_regexp_1.default(search), 'g');
    }
}
function validateReplacers({ context, replacers }) {
    return replacers
        .map((replacer) => {
        try {
            return Object.assign(Object.assign({}, replacer), { search: toRegex(replacer.search) });
        }
        catch (e) {
            log_1.default({
                context,
                message: `Bad replacer regex: '${replacer.search}'`,
            });
            return false;
        }
    })
        .filter(Boolean);
}
exports.validateReplacers = validateReplacers;
function validateAutolabeler({ context, autolabeler }) {
    return autolabeler
        .map((autolabel) => {
        try {
            return Object.assign(Object.assign({}, autolabel), { branch: autolabel.branch.map((reg) => {
                    return toRegex(reg);
                }), title: autolabel.title.map((reg) => {
                    return toRegex(reg);
                }), body: autolabel.body.map((reg) => {
                    return toRegex(reg);
                }) });
        }
        catch (e) {
            log_1.default({
                context,
                message: `Bad autolabeler regex: '${autolabel.branch}', '${autolabel.title}' or '${autolabel.body}'`,
            });
            return false;
        }
    })
        .filter(Boolean);
}
exports.validateAutolabeler = validateAutolabeler;
function template(string, obj, customReplacers) {
    let str = string.replace(/(\$[A-Z_]+)/g, (_, k) => {
        let result;
        if (obj[k] === undefined || obj[k] === null) {
            result = k;
        }
        else if (typeof obj[k] === 'object') {
            result = template(obj[k].template, obj[k]);
        }
        else {
            result = `${obj[k]}`;
        }
        return result;
    });
    if (customReplacers) {
        customReplacers.forEach(({ search, replace }) => {
            str = str.replace(search, replace);
        });
    }
    return str;
}
exports.default = template;
//# sourceMappingURL=template.js.map