import { Context } from 'probot';
import { ConfigTypes } from './types';
export default function isTriggerableReference({ context, ref, config }: {
    context: Context;
    ref: string;
    config: ConfigTypes;
}): boolean;
