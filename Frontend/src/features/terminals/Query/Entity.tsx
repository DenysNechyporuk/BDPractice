import type { TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { gql } from '@apollo/client';
export interface Terminal {
    id: number;
    name: string;
    serialNumber: string;
    address: string;
    status: 'ONLINE' | 'OFFLINE' | 'OUTOFSERVICE';
    createdAt: string;
    updatedAt: string;
}

export interface TableParams {
    pagination: TablePaginationConfig;
    sorter: SorterResult<Terminal>;
    filters: Record<string, FilterValue | null>;
}

export const GET_TERMINALS = gql`
  query GetTerminals(
    $skip: Int
    $take: Int
    $where: TerminalsFilterInput
    $order: [TerminalsSortInput!]
  ) {
    terminals(skip: $skip, take: $take, where: $where, order: $order) {
      items {
        id
        name
        serialNumber
        address
        status
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;
