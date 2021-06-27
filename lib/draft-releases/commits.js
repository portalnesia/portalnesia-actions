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
exports.findCommitsWithAssociatedPullRequestsQuery = void 0;
const lodash_1 = __importDefault(require("lodash"));
const log_1 = __importDefault(require("./log"));
const pagination_1 = __importDefault(require("./pagination"));
exports.findCommitsWithAssociatedPullRequestsQuery = `
query findCommitsWithAssociatedPullRequests(
    $name: String!
    $owner: String!
    $ref: String!
    $withPullRequestBody: Boolean!
    $withPullRequestURL: Boolean!
    $since: GitTimestamp
    $after: String
  ) {
    repository(name: $name, owner: $owner) {
      object(expression: $ref) {
        ... on Commit {
          history(first: 100, since: $since, after: $after) {
            totalCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              committedDate
              message
              author {
                name
                user {
                  login
                }
              }
              associatedPullRequests(first: 5) {
                nodes {
                  title
                  number
                  url @include(if: $withPullRequestURL)
                  body @include(if: $withPullRequestBody)
                  author {
                    login
                  }
                  baseRepository {
                    nameWithOwner
                  }
                  mergedAt
                  isCrossRepository
                  labels(first: 10) {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
function findCommitsWithAssociatedPullRequests({ ref, context, lastRelease, config }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner, repo } = context.repo();
        const variables = {
            name: repo,
            owner,
            ref,
            withPullRequestBody: config['change-template'].includes('$BODY'),
            withPullRequestURL: config['change-template'].includes('$URL'),
        };
        const dataPath = ['repository', 'object', 'history'];
        const repoNameWithOwner = `${owner}/${repo}`;
        let commits, data;
        if (lastRelease) {
            log_1.default({
                context,
                message: `Fetching all commits for reference ${ref} since ${lastRelease.created_at}`,
            });
            data = yield pagination_1.default(context.octokit.graphql, exports.findCommitsWithAssociatedPullRequestsQuery, Object.assign(Object.assign({}, variables), { since: lastRelease.created_at }), dataPath);
            // GraphQL call is inclusive of commits from the specified dates.  This means the final
            // commit from the last tag is included, so we remove this here.
            commits = lodash_1.default.get(data, [...dataPath, 'nodes']).filter((commit) => commit.committedDate != lastRelease.created_at);
        }
        else {
            log_1.default({ context, message: `Fetching all commits for reference ${ref}` });
            data = yield pagination_1.default(context.octokit.graphql, exports.findCommitsWithAssociatedPullRequestsQuery, variables, dataPath);
            commits = lodash_1.default.get(data, [...dataPath, 'nodes']);
        }
        const pullRequests = lodash_1.default.uniqBy(lodash_1.default.flatten(commits.map((commit) => commit.associatedPullRequests.nodes)), 'number').filter((pr) => pr.baseRepository.nameWithOwner === repoNameWithOwner);
        return { commits, pullRequests };
    });
}
exports.default = findCommitsWithAssociatedPullRequests;
//# sourceMappingURL=commits.js.map