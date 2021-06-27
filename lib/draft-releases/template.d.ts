import { Context } from 'probot';
import { AutoLabelsType, ReplacersType } from './types';
export declare function validateReplacers({ context, replacers }: {
    context: Context;
    replacers: ReplacersType[];
}): (false | {
    search: RegExp;
    replace: string;
})[];
export declare function validateAutolabeler({ context, autolabeler }: {
    context: Context;
    autolabeler: AutoLabelsType[];
}): (false | {
    branch: RegExp[];
    title: RegExp[];
    body: RegExp[];
    label: string;
    files: string;
})[];
export default function template(string: string, obj: Record<string, any>, customReplacers?: ReplacersType[]): string;
