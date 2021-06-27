"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1({ context, message, error }) {
    const repo = context.payload.repository;
    const prefix = repo ? `${repo.full_name}: ` : '';
    const logString = `${prefix}${message}`;
    if (error) {
        context.log.warn(error, logString);
    }
    else {
        context.log.info(logString);
    }
}
exports.default = default_1;
//# sourceMappingURL=log.js.map