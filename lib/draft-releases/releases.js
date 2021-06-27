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
exports.updateRelease = exports.createRelease = exports.generateReleaseInfo = exports.resolveVersionKeyIncrement = exports.generateChangeLog = exports.categorizePullRequests = exports.getFilterExcludedPullRequests = exports.contributorsSentence = exports.findReleases = void 0;
const compare_version_1 = __importDefault(require("compare-version"));
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const template_1 = __importDefault(require("./template"));
const log_1 = __importDefault(require("./log"));
const version_1 = __importDefault(require("./version"));
function sortReleases(releases) {
    // For semver, we find the greatest release number
    // For non-semver, we use the most recently merged
    try {
        return releases.sort((r1, r2) => compare_version_1.default(r1.tag_name, r2.tag_name));
    }
    catch (error) {
        return releases.sort((r1, r2) => new Date(r1.created_at).getTime() - new Date(r2.created_at).getTime());
    }
}
function findReleases({ ref, context, config }) {
    return __awaiter(this, void 0, void 0, function* () {
        let releases = yield context.octokit.paginate(context.octokit.repos.listReleases.endpoint.merge(context.repo({
            per_page: 100,
        })));
        log_1.default({ context, message: `Found ${releases.length} releases` });
        const { 'filter-by-commitish': filterByCommitish } = config;
        const filteredReleases = filterByCommitish
            ? releases.filter((r) => ref.match(`/${r.target_commitish}$`))
            : releases;
        const sortedPublishedReleases = sortReleases(filteredReleases.filter((r) => !r.draft));
        const draftRelease = filteredReleases.find((r) => r.draft);
        const lastRelease = sortedPublishedReleases[sortedPublishedReleases.length - 1];
        if (draftRelease) {
            log_1.default({ context, message: `Draft release: ${draftRelease.tag_name}` });
        }
        else {
            log_1.default({ context, message: `No draft release found` });
        }
        if (lastRelease) {
            log_1.default({ context, message: `Last release: ${lastRelease.tag_name}` });
        }
        else {
            log_1.default({ context, message: `No last release found` });
        }
        return { draftRelease, lastRelease };
    });
}
exports.findReleases = findReleases;
function contributorsSentence({ commits, pullRequests }) {
    const contributors = new Set();
    commits.forEach((commit) => {
        if (commit.author.user) {
            contributors.add(`@${commit.author.user.login}`);
        }
        else {
            contributors.add(commit.author.name);
        }
    });
    pullRequests.forEach((pullRequest) => {
        if (pullRequest.author) {
            contributors.add(`@${pullRequest.author.login}`);
        }
    });
    const sortedContributors = Array.from(contributors).sort();
    if (sortedContributors.length > 1) {
        return (sortedContributors.slice(0, sortedContributors.length - 1).join(', ') +
            ' and ' +
            sortedContributors.slice(-1));
    }
    else {
        return sortedContributors[0];
    }
}
exports.contributorsSentence = contributorsSentence;
function getFilterExcludedPullRequests(excludeLabels) {
    return (pullRequest) => {
        const labels = pullRequest.labels.nodes;
        if (labels.some((label) => excludeLabels.includes(label.name))) {
            return false;
        }
        return true;
    };
}
exports.getFilterExcludedPullRequests = getFilterExcludedPullRequests;
const getFilterIncludedPullRequests = (includeLabels) => {
    return (pullRequest) => {
        const labels = pullRequest.labels.nodes;
        if (includeLabels.length == 0 ||
            labels.some((label) => includeLabels.includes(label.name))) {
            return true;
        }
        return false;
    };
};
function categorizePullRequests(pullRequests, config) {
    const { 'exclude-labels': excludeLabels, 'include-labels': includeLabels, categories, } = config;
    const allCategoryLabels = categories.flatMap((category) => category.labels);
    const uncategorizedPullRequests = [];
    const categorizedPullRequests = [...categories].map((category) => {
        return Object.assign(Object.assign({}, category), { pullRequests: [] });
    });
    const filterUncategorizedPullRequests = (pullRequest) => {
        const labels = pullRequest.labels.nodes;
        if (labels.length === 0 ||
            !labels.some((label) => allCategoryLabels.includes(label.name))) {
            uncategorizedPullRequests.push(pullRequest);
            return false;
        }
        return true;
    };
    // we only want pull requests that have yet to be categorized
    const filteredPullRequests = pullRequests
        .filter(getFilterExcludedPullRequests(excludeLabels))
        .filter(getFilterIncludedPullRequests(includeLabels))
        .filter(filterUncategorizedPullRequests);
    categorizedPullRequests.map((category) => {
        filteredPullRequests.map((pullRequest) => {
            // lets categorize some pull request based on labels
            // note that having the same label in multiple categories
            // then it is intended to "duplicate" the pull request into each category
            const labels = pullRequest.labels.nodes;
            if (labels.some((label) => { var _a; return (_a = category === null || category === void 0 ? void 0 : category.labels) === null || _a === void 0 ? void 0 : _a.includes(label.name); })) {
                category.pullRequests.push(pullRequest);
            }
        });
    });
    return [uncategorizedPullRequests, categorizedPullRequests];
}
exports.categorizePullRequests = categorizePullRequests;
function generateChangeLog(mergedPullRequests, config) {
    if (mergedPullRequests.length === 0) {
        return config['no-changes-template'];
    }
    const [uncategorizedPullRequests, categorizedPullRequests,] = categorizePullRequests(mergedPullRequests, config);
    const escapeTitle = (title) => 
    // If config['change-title-escapes'] contains backticks, then they will be escaped along with content contained inside backticks
    // If not, the entire backtick block is matched so that it will become a markdown code block without escaping any of its content
    title.replace(new RegExp(`[${escape_string_regexp_1.default(config['change-title-escapes'])}]|\`.*?\``, 'g'), (match) => {
        if (match.length > 1)
            return match;
        if (match == '@' || match == '#')
            return `${match}<!---->`;
        return `\\${match}`;
    });
    const pullRequestToString = (pullRequests) => pullRequests
        .map((pullRequest) => template_1.default(config['change-template'], {
        $TITLE: escapeTitle(pullRequest.title),
        $NUMBER: pullRequest.number,
        $AUTHOR: pullRequest.author ? pullRequest.author.login : 'ghost',
        $BODY: pullRequest.body,
        $URL: pullRequest.url,
    }))
        .join('\n');
    const changeLog = [];
    if (uncategorizedPullRequests.length) {
        changeLog.push(pullRequestToString(uncategorizedPullRequests));
        changeLog.push('\n\n');
    }
    categorizedPullRequests.map((category, index) => {
        if (category.pullRequests.length) {
            changeLog.push(template_1.default(config['category-template'], { $TITLE: category.title }));
            changeLog.push('\n\n');
            changeLog.push(pullRequestToString(category.pullRequests));
            if (index + 1 !== categorizedPullRequests.length)
                changeLog.push('\n\n');
        }
    });
    return changeLog.join('').trim();
}
exports.generateChangeLog = generateChangeLog;
function resolveVersionKeyIncrement(mergedPullRequests, config) {
    const priorityMap = {
        patch: 1,
        minor: 2,
        major: 3,
    };
    const versionResolver = config['version-resolver'];
    const labelToKeyMap = Object.fromEntries(Object.keys(priorityMap)
        .flatMap((key) => [
        versionResolver[key].labels.map((label) => [label, key]),
    ])
        .flat());
    const keys = mergedPullRequests
        .filter(getFilterExcludedPullRequests(config['exclude-labels']))
        .filter(getFilterIncludedPullRequests(config['include-labels']))
        .flatMap((pr) => pr.labels.nodes.map((node) => labelToKeyMap[node.name]))
        .filter(Boolean);
    const keyPriorities = keys.map((key) => priorityMap[key]);
    const priority = Math.max(...keyPriorities);
    const versionKey = Object.keys(priorityMap).find((key) => priorityMap[key] === priority);
    const result = (versionKey || config['version-resolver'].default);
    return result;
}
exports.resolveVersionKeyIncrement = resolveVersionKeyIncrement;
function generateReleaseInfo({ commits, config, lastRelease, mergedPullRequests, version = undefined, tag = undefined, name = undefined, isPreRelease, shouldDraft }) {
    let body = config.template;
    body = template_1.default(body, {
        $PREVIOUS_TAG: lastRelease ? lastRelease.tag_name : '',
        $CHANGES: generateChangeLog(mergedPullRequests, config),
        $CONTRIBUTORS: contributorsSentence({
            commits,
            pullRequests: mergedPullRequests,
        }),
    }, config.replacers);
    const versionInfo = version_1.default(lastRelease, config['version-template'], 
    // Use the first override parameter to identify
    // a version, from the most accurate to the least
    version || tag || name, resolveVersionKeyIncrement(mergedPullRequests, config));
    if (versionInfo) {
        body = template_1.default(body, versionInfo);
    }
    if (tag === undefined) {
        tag = versionInfo ? template_1.default(config['tag-template'] || '', versionInfo) : '';
    }
    if (name === undefined) {
        name = versionInfo
            ? template_1.default(config['name-template'] || '', versionInfo)
            : '';
    }
    let commitish = config['commitish'] || '';
    return {
        name,
        tag,
        body,
        commitish,
        prerelease: isPreRelease,
        draft: shouldDraft,
    };
}
exports.generateReleaseInfo = generateReleaseInfo;
function createRelease({ context, releaseInfo }) {
    return context.octokit.repos.createRelease(context.repo({
        target_commitish: releaseInfo.commitish,
        name: releaseInfo.name,
        tag_name: releaseInfo.tag,
        body: releaseInfo.body,
        draft: releaseInfo.draft,
        prerelease: releaseInfo.prerelease,
    }));
}
exports.createRelease = createRelease;
function updateRelease({ context, releaseInfo, draftRelease }) {
    const updateReleaseParams = updateDraftReleaseParams({
        name: releaseInfo.name || draftRelease.name,
        tag_name: releaseInfo.tag || draftRelease.tag_name,
    });
    return context.octokit.repos.updateRelease(context.repo(Object.assign({ release_id: draftRelease.id, body: releaseInfo.body, draft: releaseInfo.draft, prerelease: releaseInfo.prerelease }, updateReleaseParams)));
}
exports.updateRelease = updateRelease;
function updateDraftReleaseParams(params) {
    const updateReleaseParams = Object.assign({}, params);
    // Let GitHub figure out `name` and `tag_name` if undefined
    if (!updateReleaseParams.name === null) {
        delete updateReleaseParams.name;
    }
    if (!updateReleaseParams.tag_name) {
        delete updateReleaseParams.tag_name;
    }
    return updateReleaseParams;
}
//# sourceMappingURL=releases.js.map