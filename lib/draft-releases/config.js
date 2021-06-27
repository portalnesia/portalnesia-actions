"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const schema_1 = __importDefault(require("./schema"));
const defaultConfig_1 = __importDefault(require("./defaultConfig"));
const log_1 = __importDefault(require("./log"));
const utils_1 = require("./utils");
const cli_table3_1 = __importDefault(require("cli-table3"));
const CONFIG_NAME = 'portalnesia.yml';
function joiValidationErrorsAsTable(error) {
    const table = new cli_table3_1.default({ head: ['Property', 'Error'] });
    error.details.forEach(({ path, message }) => {
        const prettyPath = path
            .map((pathPart) => Number.isInteger(pathPart) ? `[${pathPart}]` : pathPart)
            .join('.');
        table.push([prettyPath, message]);
    });
    return table.toString();
}
function getConfig({ context }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repoConfig = yield context.config(CONFIG_NAME, defaultConfig_1.default);
            const config = schema_1.default(context, repoConfig);
            return config;
        }
        catch (error) {
            log_1.default({ context, error, message: 'Invalid config file' });
            if (error.isJoi) {
                log_1.default({
                    context,
                    message: 'Config validation errors, please fix the following issues in release-drafter.yml:\n' +
                        joiValidationErrorsAsTable(error),
                });
            }
            if (utils_1.runnerIsActions()) {
                core.setFailed('Invalid config file');
            }
            return null;
        }
    });
}
exports.default = getConfig;
//# sourceMappingURL=config.js.map