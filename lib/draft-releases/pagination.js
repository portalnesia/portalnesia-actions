"use strict";
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
const lodash_1 = __importDefault(require("lodash"));
function paginate(queryFn, query, variables, paginatePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodesPath = [...paginatePath, 'nodes'];
        const pageInfoPath = [...paginatePath, 'pageInfo'];
        const endCursorPath = [...pageInfoPath, 'endCursor'];
        const hasNextPagePath = [...pageInfoPath, 'hasNextPage'];
        const hasNextPage = (data) => lodash_1.default.get(data, hasNextPagePath);
        let data = yield queryFn(query, variables);
        if (!lodash_1.default.has(data, nodesPath)) {
            throw new Error("Data doesn't contain `nodes` field. Make sure the `paginatePath` is set to the field you wish to paginate and that the query includes the `nodes` field.");
        }
        if (!lodash_1.default.has(data, pageInfoPath) ||
            !lodash_1.default.has(data, endCursorPath) ||
            !lodash_1.default.has(data, hasNextPagePath)) {
            throw new Error("Data doesn't contain `pageInfo` field with `endCursor` and `hasNextPage` fields. Make sure the `paginatePath` is set to the field you wish to paginate and that the query includes the `pageInfo` field.");
        }
        while (hasNextPage(data)) {
            const newData = yield queryFn(query, Object.assign(Object.assign({}, variables), { after: lodash_1.default.get(data, [...pageInfoPath, 'endCursor']) }));
            const newNodes = lodash_1.default.get(newData, nodesPath);
            const newPageInfo = lodash_1.default.get(newData, pageInfoPath);
            lodash_1.default.set(data, pageInfoPath, newPageInfo);
            lodash_1.default.update(data, nodesPath, (d) => d.concat(newNodes));
        }
        return data;
    });
}
exports.default = paginate;
//# sourceMappingURL=pagination.js.map