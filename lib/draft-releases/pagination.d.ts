import { graphql } from "@octokit/graphql";
import { CommitType, VariablesPagination } from './types';
export default function paginate(queryFn: typeof graphql, query: string, variables: VariablesPagination, paginatePath: string[]): Promise<CommitType>;
