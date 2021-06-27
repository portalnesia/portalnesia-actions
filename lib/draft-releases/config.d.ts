import { Context } from 'probot';
export default function getConfig({ context }: {
    context: Context;
}): Promise<import("./types").ConfigTypes>;
