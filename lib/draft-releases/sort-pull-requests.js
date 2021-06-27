"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SORT_DIRECTIONS = exports.SORT_BY = void 0;
exports.SORT_BY = {
    mergedAt: 'merged_at',
    title: "title"
};
exports.SORT_DIRECTIONS = {
    ascending: "ascending",
    descending: "descending"
};
function getTitle(pullRequest) {
    return pullRequest.title;
}
function getMergeAt(pullRequest) {
    return new Date(pullRequest.mergedAt);
}
function dateSortAscending(date1, date2) {
    if (date1 > date2)
        return 1;
    if (date1 < date2)
        return -1;
    return 0;
}
function dateSortDescending(date1, date2) {
    if (date1 > date2)
        return -1;
    if (date1 < date2)
        return 1;
    return 0;
}
function sortPullRequests(pullRequests, sortBy, sortDirection) {
    const getSortFieldFn = sortBy === exports.SORT_BY.title ? getTitle : getMergeAt;
    const sortFn = sortDirection === exports.SORT_DIRECTIONS.ascending ? dateSortAscending : dateSortDescending;
    return pullRequests
        .slice()
        .sort((a, b) => sortFn(getSortFieldFn(a), getSortFieldFn(b)));
}
exports.default = sortPullRequests;
//# sourceMappingURL=sort-pull-requests.js.map