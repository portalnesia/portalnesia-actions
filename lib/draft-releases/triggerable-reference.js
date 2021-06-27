"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("./log"));
function isTriggerableReference({ context, ref, config }) {
    const { GITHUB_ACTIONS } = process.env;
    if (GITHUB_ACTIONS) {
        // Let GitHub Action determine when to run the action based on the workflow's on syntax
        // See https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#on
        return true;
    }
    const refRegex = /^refs\/(?:heads|tags)\//;
    const refernces = config.references.map((r) => r.replace(refRegex, ''));
    const shortRef = ref.replace(refRegex, '');
    const validReference = new RegExp(refernces.join('|'));
    const relevant = validReference.test(shortRef);
    if (!relevant) {
        log_1.default({
            context,
            message: `Ignoring push. ${shortRef} does not match: ${refernces.join(', ')}`,
        });
    }
    return relevant;
}
exports.default = isTriggerableReference;
//# sourceMappingURL=triggerable-reference.js.map