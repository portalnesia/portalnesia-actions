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
Object.defineProperty(exports, "__esModule", { value: true });
const semver = __importStar(require("semver"));
function splitSemVer(inputs, versionKey = 'version') {
    const input = versionKey === 'inputVersion' ? inputs.inputVersion : inputs.version;
    const version = inputs.inc
        ? semver.inc(input, inputs.inc, true)
        : semver.parse(input);
    if (version === null)
        return null;
    return Object.assign(Object.assign({}, input), { version, $MAJOR: semver.major(version), $MINOR: semver.minor(version), $PATCH: semver.patch(version) });
}
const coerceVersion = (input) => {
    if (!input) {
        return null;
    }
    return typeof input === 'object'
        ? semver.coerce(input.tag_name) || semver.coerce(input.name)
        : semver.coerce(input);
};
function getTemplatableVersion(input) {
    const templatableVersion = {
        $NEXT_MAJOR_VERSION: splitSemVer(Object.assign(Object.assign({}, input), { inc: 'major' })),
        $NEXT_MINOR_VERSION: splitSemVer(Object.assign(Object.assign({}, input), { inc: 'minor' })),
        $NEXT_PATCH_VERSION: splitSemVer(Object.assign(Object.assign({}, input), { inc: 'patch' })),
        $INPUT_VERSION: splitSemVer(input, 'inputVersion'),
        $RESOLVED_VERSION: splitSemVer(Object.assign(Object.assign({}, input), { inc: input.versionKeyIncrement !== null ? input.versionKeyIncrement : 'patch' })),
    };
    templatableVersion.$RESOLVED_VERSION =
        templatableVersion.$INPUT_VERSION || templatableVersion.$RESOLVED_VERSION;
    return templatableVersion;
}
function getVersionInfo(release, template, argsInputVersion = null, versionKeyIncrement = null) {
    const version = coerceVersion(release);
    const inputVersion = coerceVersion(argsInputVersion);
    if (version === null || inputVersion === null) {
        return undefined;
    }
    return Object.assign({}, getTemplatableVersion({
        version,
        template,
        inputVersion,
        versionKeyIncrement,
    }));
}
exports.default = getVersionInfo;
//# sourceMappingURL=version.js.map