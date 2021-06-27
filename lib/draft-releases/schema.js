"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const lodash_1 = __importDefault(require("lodash"));
const joi_1 = __importDefault(require("@hapi/joi"));
const sort_pull_requests_1 = require("./sort-pull-requests");
const defaultConfig_1 = __importDefault(require("./defaultConfig"));
const template_1 = require("./template");
function schema(context) {
    const defaultBranch = lodash_1.default.get(context, 'payload.repository.default_branch', 'master');
    return joi_1.default.object()
        .keys({
        references: joi_1.default.array().items(joi_1.default.string()).default([defaultBranch]),
        'change-template': joi_1.default.string().default(defaultConfig_1.default['change-template']),
        'change-title-escapes': joi_1.default.string()
            .allow('')
            .default(defaultConfig_1.default['change-title-escapes']),
        'no-changes-template': joi_1.default.string().default(defaultConfig_1.default['no-changes-template']),
        'version-template': joi_1.default.string().default(defaultConfig_1.default['version-template']),
        'name-template': joi_1.default.string()
            .allow('')
            .default(defaultConfig_1.default['name-template']),
        'tag-template': joi_1.default.string()
            .allow('')
            .default(defaultConfig_1.default['tag-template']),
        'exclude-labels': joi_1.default.array()
            .items(joi_1.default.string())
            .default(defaultConfig_1.default['exclude-labels']),
        'include-labels': joi_1.default.array()
            .items(joi_1.default.string())
            .default(defaultConfig_1.default['include-labels']),
        'sort-by': joi_1.default.string()
            .valid(sort_pull_requests_1.SORT_BY.mergedAt, sort_pull_requests_1.SORT_BY.title)
            .default(defaultConfig_1.default['sort-by']),
        'sort-direction': joi_1.default.string()
            .valid(sort_pull_requests_1.SORT_DIRECTIONS.ascending, sort_pull_requests_1.SORT_DIRECTIONS.descending)
            .default(defaultConfig_1.default['sort-direction']),
        prerelease: joi_1.default.boolean().default(defaultConfig_1.default.prerelease),
        'filter-by-commitish': joi_1.default.boolean().default(defaultConfig_1.default['filter-by-commitish']),
        commitish: joi_1.default.string().allow('').default(defaultConfig_1.default['commitish']),
        replacers: joi_1.default.array()
            .items(joi_1.default.object().keys({
            search: joi_1.default.string()
                .required()
                .error(() => '"search" is required and must be a regexp or a string'),
            replace: joi_1.default.string().allow('').required(),
        }))
            .default(defaultConfig_1.default.replacers),
        autolabeler: joi_1.default.array()
            .items(joi_1.default.object().keys({
            label: joi_1.default.string().required(),
            files: joi_1.default.array().items(joi_1.default.string()).single().default([]),
            branch: joi_1.default.array().items(joi_1.default.string()).single().default([]),
            title: joi_1.default.array().items(joi_1.default.string()).single().default([]),
            body: joi_1.default.array().items(joi_1.default.string()).single().default([]),
        }))
            .default(defaultConfig_1.default.autolabeler),
        categories: joi_1.default.array()
            .items(joi_1.default.object()
            .keys({
            title: joi_1.default.string().required(),
            label: joi_1.default.string(),
            labels: joi_1.default.array().items(joi_1.default.string()).single().default([]),
        })
            .rename('label', 'labels', {
            ignoreUndefined: true,
            override: true,
        }))
            .default(defaultConfig_1.default.categories),
        'version-resolver': joi_1.default.object()
            .keys({
            major: joi_1.default.object({
                labels: joi_1.default.array().items(joi_1.default.string()).single(),
            }),
            minor: joi_1.default.object({
                labels: joi_1.default.array().items(joi_1.default.string()).single(),
            }),
            patch: joi_1.default.object({
                labels: joi_1.default.array().items(joi_1.default.string()).single(),
            }),
            default: joi_1.default.string()
                .valid('major', 'minor', 'patch')
                .default('patch'),
        })
            .default(defaultConfig_1.default['version-resolver']),
        'category-template': joi_1.default.string()
            .allow('')
            .default(defaultConfig_1.default['category-template']),
        template: joi_1.default.string().required(),
        _extends: joi_1.default.string(),
    })
        .rename('branches', 'references', {
        ignoreUndefined: true,
        override: true,
    });
}
exports.schema = schema;
function validateScheme(context, repoConfig) {
    const { error, value: config } = schema(context).validate(repoConfig, {
        abortEarly: false,
        allowUnknown: true,
    });
    if (error)
        throw error;
    try {
        config.replacers = template_1.validateReplacers({
            context,
            replacers: config.replacers,
        });
    }
    catch (error) {
        config.replacers = [];
    }
    try {
        config.autolabeler = template_1.validateAutolabeler({
            context,
            autolabeler: config.autolabeler,
        });
    }
    catch (error) {
        config.autolabeler = [];
    }
    return config;
}
exports.default = validateScheme;
//# sourceMappingURL=schema.js.map