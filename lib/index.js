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
const config_1 = __importDefault(require("./draft-releases/config"));
const triggerable_reference_1 = __importDefault(require("./draft-releases/triggerable-reference"));
const releases_1 = require("./draft-releases/releases");
const commits_1 = __importDefault(require("./draft-releases/commits"));
const sort_pull_requests_1 = __importDefault(require("./draft-releases/sort-pull-requests"));
const log_1 = __importDefault(require("./draft-releases/log"));
const utils_1 = require("./draft-releases/utils");
const core = __importStar(require("@actions/core"));
const ignore_1 = __importDefault(require("ignore"));
function App(app, { getRouter }) {
    const event = utils_1.runnerIsActions() ? '*' : 'push';
    if (!utils_1.runnerIsActions() && typeof getRouter === 'function') {
        getRouter().get('/healthz', (req, res) => {
            res.status(200).json({ status: 'pass' });
        });
    }
    app.on([
        'pull_request.opened',
        'pull_request.reopened',
        'pull_request.synchronize',
    ], (context) => __awaiter(this, void 0, void 0, function* () {
        const { disableAutolabeler } = getInput();
        const config = yield config_1.default({
            context,
        });
        if (config === null || disableAutolabeler)
            return;
        let issue = Object.assign({}, context.issue({ pull_number: context.payload.pull_request.number }));
        const changedFiles = yield context.octokit.paginate(context.octokit.pulls.listFiles.endpoint.merge(issue), (res) => res.data.map((file) => file.filename));
        const labels = new Set();
        for (const autolabel of config['autolabeler']) {
            let found = false;
            // check modified files
            if (!found && autolabel.files.length > 0) {
                const matcher = ignore_1.default().add(autolabel.files);
                if (changedFiles.find((file) => matcher.ignores(file))) {
                    labels.add(autolabel.label);
                    found = true;
                    log_1.default({
                        context,
                        message: `Found label for files: '${autolabel.label}'`,
                    });
                }
            }
            // check branch names
            if (!found && autolabel.branch.length > 0) {
                for (const matcher of autolabel.branch) {
                    if (context.payload.pull_request.head.ref.match(matcher)) {
                        labels.add(autolabel.label);
                        found = true;
                        log_1.default({
                            context,
                            message: `Found label for branch: '${autolabel.label}'`,
                        });
                        break;
                    }
                }
            }
            // check pr title
            if (!found && autolabel.title.length > 0) {
                for (const matcher of autolabel.title) {
                    if (context.payload.pull_request.title.match(matcher)) {
                        labels.add(autolabel.label);
                        found = true;
                        log_1.default({
                            context,
                            message: `Found label for title: '${autolabel.label}'`,
                        });
                        break;
                    }
                }
            }
            // check pr body
            if (!found && autolabel.body.length > 0) {
                for (const matcher of autolabel.body) {
                    if (context.payload.pull_request.body.match(matcher)) {
                        labels.add(autolabel.label);
                        found = true;
                        log_1.default({
                            context,
                            message: `Found label for body: '${autolabel.label}'`,
                        });
                        break;
                    }
                }
            }
        }
        const labelsToAdd = Array.from(labels);
        if (labelsToAdd.length > 0) {
            let labelIssue = Object.assign({}, context.issue({
                issue_number: context.payload.pull_request.number,
                labels: labelsToAdd,
            }));
            yield context.octokit.issues.addLabels(labelIssue);
            if (utils_1.runnerIsActions()) {
                core.setOutput('number', context.payload.pull_request.number);
                core.setOutput('labels', labelsToAdd.join(','));
            }
            return;
        }
    }));
    app.on(event, (context) => __awaiter(this, void 0, void 0, function* () {
        const { shouldDraft, configName, version, tag, name, disableReleaser, } = getInput();
        const config = yield config_1.default({
            context,
        });
        if (config === null || disableReleaser)
            return;
        const { isPreRelease } = getInput({ config });
        // GitHub Actions merge payloads slightly differ, in that their ref points
        // to the PR branch instead of refs/heads/master
        const ref = process.env['GITHUB_REF'] || context.payload.ref;
        if (!triggerable_reference_1.default({ ref, context, config })) {
            return;
        }
        const { draftRelease, lastRelease } = yield releases_1.findReleases({
            ref,
            context,
            config,
        });
        const { commits, pullRequests: mergedPullRequests, } = yield commits_1.default({
            context,
            ref,
            lastRelease,
            config,
        });
        const sortedMergedPullRequests = sort_pull_requests_1.default(mergedPullRequests, config['sort-by'], config['sort-direction']);
        const releaseInfo = releases_1.generateReleaseInfo({
            commits,
            config,
            lastRelease,
            mergedPullRequests: sortedMergedPullRequests,
            version,
            tag,
            name,
            isPreRelease,
            shouldDraft,
        });
        let createOrUpdateReleaseResponse;
        if (!draftRelease) {
            log_1.default({ context, message: 'Creating new release' });
            createOrUpdateReleaseResponse = yield releases_1.createRelease({
                context,
                releaseInfo,
            });
        }
        else {
            log_1.default({ context, message: 'Updating existing release' });
            createOrUpdateReleaseResponse = yield releases_1.updateRelease({
                context,
                draftRelease,
                releaseInfo,
            });
        }
        if (utils_1.runnerIsActions()) {
            setActionOutput(createOrUpdateReleaseResponse, releaseInfo);
        }
    }));
}
exports.default = App;
function getInput({ config } = {}) {
    // Returns all the inputs that doesn't need a merge with the config file
    let result;
    if (!config) {
        result = {
            shouldDraft: core.getInput('publish').toLowerCase() !== 'true',
            configName: core.getInput('config-name'),
            version: core.getInput('version') || undefined,
            tag: core.getInput('tag') || undefined,
            name: core.getInput('name') || undefined,
            disableReleaser: core.getInput('disable-releaser').toLowerCase() === 'true',
            disableAutolabeler: core.getInput('disable-autolabeler').toLowerCase() === 'true',
        };
        return result;
    }
    // Merges the config file with the input
    // the input takes precedence, because it's more easy to change at runtime
    const preRelease = core.getInput('prerelease').toLowerCase();
    result = {
        isPreRelease: preRelease === 'true' || (!preRelease && config.prerelease),
    };
    return result;
}
function setActionOutput(releaseResponse, { body }) {
    const { data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl, tag_name: tagName, name: name, }, } = releaseResponse;
    if (releaseId && Number.isInteger(releaseId))
        core.setOutput('id', releaseId.toString());
    if (htmlUrl)
        core.setOutput('html_url', htmlUrl);
    if (uploadUrl)
        core.setOutput('upload_url', uploadUrl);
    if (tagName)
        core.setOutput('tag_name', tagName);
    if (name)
        core.setOutput('name', name);
    core.setOutput('body', body);
}
//# sourceMappingURL=index.js.map