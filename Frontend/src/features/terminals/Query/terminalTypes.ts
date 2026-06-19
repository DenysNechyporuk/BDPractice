import type { Terminal } from './Entity';

export type TerminalWhereCondition = {
    id?: { eq?: number };
    name?: { contains?: string };
    serialNumber?: { contains?: string };
    address?: { contains?: string };
    status?: { in?: Terminal['status'][] };
    createdAt?: { gte?: string; lte?: string };
    updatedAt?: { gte?: string; lte?: string };
};

export type TerminalWhere = TerminalWhereCondition & {
    and?: TerminalWhereCondition[];
};

export interface GetTerminalsVariables {
    skip?: number;
    take?: number;
    where?: TerminalWhere;
    order?: Record<string, 'ASC' | 'DESC'>[];
}
