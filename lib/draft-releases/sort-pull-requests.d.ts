import { PullRequestTypes } from "./types";
export declare const SORT_BY: {
    mergedAt: string;
    title: string;
};
export declare const SORT_DIRECTIONS: {
    ascending: string;
    descending: string;
};
export default function sortPullRequests(pullRequests: PullRequestTypes[], sortBy: 'merged_at' | 'title', sortDirection: 'ascending' | 'descending'): PullRequestTypes[];
