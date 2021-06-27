import { Context } from 'probot';
import { CommitDataType, ConfigTypes, ReleasesType } from './types';
export declare const findCommitsWithAssociatedPullRequestsQuery = "\nquery findCommitsWithAssociatedPullRequests(\n    $name: String!\n    $owner: String!\n    $ref: String!\n    $withPullRequestBody: Boolean!\n    $withPullRequestURL: Boolean!\n    $since: GitTimestamp\n    $after: String\n  ) {\n    repository(name: $name, owner: $owner) {\n      object(expression: $ref) {\n        ... on Commit {\n          history(first: 100, since: $since, after: $after) {\n            totalCount\n            pageInfo {\n              hasNextPage\n              endCursor\n            }\n            nodes {\n              id\n              committedDate\n              message\n              author {\n                name\n                user {\n                  login\n                }\n              }\n              associatedPullRequests(first: 5) {\n                nodes {\n                  title\n                  number\n                  url @include(if: $withPullRequestURL)\n                  body @include(if: $withPullRequestBody)\n                  author {\n                    login\n                  }\n                  baseRepository {\n                    nameWithOwner\n                  }\n                  mergedAt\n                  isCrossRepository\n                  labels(first: 10) {\n                    nodes {\n                      name\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n";
export default function findCommitsWithAssociatedPullRequests({ ref, context, lastRelease, config }: {
    ref: string;
    context: Context;
    config: ConfigTypes;
    lastRelease: ReleasesType;
}): Promise<{
    commits: CommitDataType[];
    pullRequests: import("./types").PullRequestTypes[];
}>;
