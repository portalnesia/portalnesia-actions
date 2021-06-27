import { Context } from 'probot';
import { CategoriesConfigTypes, CommitDataType, ConfigTypes, FunctionReleaseArgs, GeneratedReleaseInfoResult, PullRequestTypes, ReleasesType } from './types';
import { ReleaseType } from 'semver';
export declare function findReleases({ ref, context, config }: {
    ref: string;
    context: Context;
    config: ConfigTypes;
}): Promise<{
    draftRelease: ReleasesType;
    lastRelease: ReleasesType;
}>;
export declare function contributorsSentence({ commits, pullRequests }: {
    commits: CommitDataType[];
    pullRequests: any[];
}): unknown;
export declare function getFilterExcludedPullRequests(excludeLabels: string[]): (pullRequest: any) => boolean;
declare type CategoriesPullRequests = CategoriesConfigTypes & {
    pullRequests: PullRequestTypes[];
};
export declare function categorizePullRequests(pullRequests: PullRequestTypes[], config: ConfigTypes): [PullRequestTypes[], CategoriesPullRequests[]];
export declare function generateChangeLog(mergedPullRequests: PullRequestTypes[], config: ConfigTypes): string;
export declare function resolveVersionKeyIncrement(mergedPullRequests: any[], config: ConfigTypes): ReleaseType;
export declare function generateReleaseInfo({ commits, config, lastRelease, mergedPullRequests, version, tag, name, isPreRelease, shouldDraft }: FunctionReleaseArgs): GeneratedReleaseInfoResult;
export declare function createRelease({ context, releaseInfo }: {
    context: Context;
    releaseInfo: GeneratedReleaseInfoResult;
}): Promise<import("@octokit/types").OctokitResponse<{
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
    body?: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    author: {
        name?: string;
        email?: string;
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
        starred_at?: string;
    };
    assets: {
        url: string;
        browser_download_url: string;
        id: number;
        node_id: string;
        name: string;
        label: string;
        state: "open" | "uploaded";
        content_type: string;
        size: number;
        download_count: number;
        created_at: string;
        updated_at: string;
        uploader: {
            name?: string;
            email?: string;
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
            starred_at?: string;
        };
    }[];
    body_html?: string;
    body_text?: string;
    discussion_url?: string;
    reactions?: {
        url: string;
        total_count: number;
        "+1": number;
        "-1": number;
        laugh: number;
        confused: number;
        heart: number;
        hooray: number;
        eyes: number;
        rocket: number;
    };
}, 201>>;
export declare function updateRelease({ context, releaseInfo, draftRelease }: {
    context: Context;
    releaseInfo: GeneratedReleaseInfoResult;
    draftRelease: ReleasesType;
}): Promise<import("@octokit/types").OctokitResponse<{
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
    body?: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    author: {
        name?: string;
        email?: string;
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
        starred_at?: string;
    };
    assets: {
        url: string;
        browser_download_url: string;
        id: number;
        node_id: string;
        name: string;
        label: string;
        state: "open" | "uploaded";
        content_type: string;
        size: number;
        download_count: number;
        created_at: string;
        updated_at: string;
        uploader: {
            name?: string;
            email?: string;
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
            starred_at?: string;
        };
    }[];
    body_html?: string;
    body_text?: string;
    discussion_url?: string;
    reactions?: {
        url: string;
        total_count: number;
        "+1": number;
        "-1": number;
        laugh: number;
        confused: number;
        heart: number;
        hooray: number;
        eyes: number;
        rocket: number;
    };
}, 200>>;
export {};