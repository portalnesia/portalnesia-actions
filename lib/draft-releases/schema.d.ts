/// <reference types="hapi__joi" />
import Joi from '@hapi/joi';
import { Context } from 'probot';
import { ConfigTypes } from './types';
export declare function schema(context?: Context): Joi.ObjectSchema<any>;
export default function validateScheme(context: Context, repoConfig: any): ConfigTypes;
