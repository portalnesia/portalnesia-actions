import { SemVer, ReleaseType } from 'semver';
export declare type ReplacersType = {
    replace: string;
    search: string;
};
export declare type AutoLabelsType = {
    label: string;
    files: string;
    branch: string[];
    title: string[];
    body: string[];
};
export declare type VersionTypes = {
    labels: string[];
};
export declare type CategoriesConfigTypes = {
    title: string;
    labels?: string[];
    label?: string;
};
export declare type GithubAuthorType = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
};
export declare type ReleasesType = {
    url: string;
    html_url: string;
    assets_url: string;
    upload_url: string;
    tarball_url: string;
    zipball_url: string;
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    author: GithubAuthorType;
};
export interface ConfigTypes {
    template: string;
    'category-template': string;
    'name-template': string;
    'tag-template': string;
    'version-template': string;
    'change-template': string;
    'change-title-escapes': string;
    'no-changes-template': string;
    references: string[];
    categories: CategoriesConfigTypes[];
    'exclude-labels': string[];
    'include-labels': string[];
    replacers: ReplacersType[];
    'sort-by': 'merged_at' | 'title';
    'sort-direction': 'ascending' | 'descending';
    prerelease: boolean;
    'version-resolver': {
        'major': VersionTypes;
        'minor': VersionTypes;
        'patch': VersionTypes;
        'default': string;
    };
    'filter-by-commitish': boolean;
    commitish: string;
    autolabeler: AutoLabelsType[];
}
export declare type FunctionVersionArgs = {
    version: SemVer;
    inputVersion: SemVer;
    template: string;
    versionKeyIncrement: ReleaseType | null;
    inc?: ReleaseType;
};
export declare type VersionType = {
    patch: number;
    minor: number;
    major: number;
};
export declare type VariablesPagination = {
    name: any;
    owner: any;
    ref: string;
    withPullRequestBody: boolean;
    withPullRequestURL: boolean;
    since?: string;
};
export declare type FunctionReleaseArgs = {
    commits: any;
    config: ConfigTypes;
    lastRelease: ReleasesType;
    mergedPullRequests: PullRequestTypes[];
    version?: string;
    tag?: string;
    name?: string;
    isPreRelease: boolean;
    shouldDraft: boolean;
};
export declare type GitUser = {
    login: string;
};
export declare type GitActor = {
    name: string;
    user?: GitUser;
};
export declare type CommitDataType = {
    id: number;
    committedDate: string;
    message: string;
    author: GitActor;
    associatedPullRequests: {
        nodes: PullRequestTypes[];
    };
};
export declare type CommitType = {
    totalCount: number;
    pageInfo: {
        hasNextPage: boolean;
        endCursor: number;
    };
    nodes: CommitDataType;
};
export declare type PullRequestTypes = {
    title: string;
    number: number;
    url?: string;
    body?: string;
    author?: GitUser;
    baseRepository: {
        nameWithOwner: string;
    };
    mergedAt: string;
    isCrossRepository: boolean;
    labels: {
        nodes: {
            name: string;
        }[];
    };
};
export declare type GeneratedReleaseInfoResult = {
    name: string;
    tag: string;
    body: string;
    commitish: string;
    prerelease: boolean;
    draft: boolean;
};
export declare type GetInputResult = {
    shouldDraft: boolean;
    configName: string;
    version?: string;
    tag?: string;
    name?: string;
    disableReleaser: boolean;
    disableAutolabeler: boolean;
};
export declare type GetInputPreReleaseResult = {
    isPreRelease: boolean;
};
