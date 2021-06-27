"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sort_pull_requests_1 = require("./sort-pull-requests");
exports.default = Object.freeze({
    'name-template': '',
    'tag-template': '',
    'change-template': `* $TITLE (#$NUMBER) @$AUTHOR`,
    'change-title-escapes': '',
    'no-changes-template': `* No changes`,
    'version-template': `$MAJOR.$MINOR.$PATCH`,
    'version-resolver': {
        major: { labels: [] },
        minor: { labels: [] },
        patch: { labels: [] },
        default: 'patch',
    },
    categories: [],
    'exclude-labels': [],
    'include-labels': [],
    replacers: [],
    autolabeler: [],
    'sort-by': sort_pull_requests_1.SORT_BY.mergedAt,
    'sort-direction': sort_pull_requests_1.SORT_DIRECTIONS.descending,
    prerelease: false,
    'filter-by-commitish': false,
    commitish: '',
    'category-template': `## $TITLE`,
});
//# sourceMappingURL=defaultConfig.js.map