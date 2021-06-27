"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runnerIsActions = void 0;
function runnerIsActions() {
    return process.env['GITHUB_ACTION'] !== undefined;
}
exports.runnerIsActions = runnerIsActions;
//# sourceMappingURL=utils.js.map