import { Context } from "probot";
export default function ({ context, message, error }: {
    context: Context;
    message: string;
    error?: any;
}): void;
