import type { PopconfirmProps, TableProps } from 'antd';

import type { Terminal } from './Entity';
import { TerminalActions } from './TerminalActions';
import { filterIcon, getDateRangeFilterDropdown, getTextFilterDropdown } from './terminalFilters';

interface CreateTerminalColumnsParams {
    onCancelDelete: PopconfirmProps['onCancel'];
    onConfirmDelete: (id: number) => Promise<void>;
    onEdit: (terminal: Terminal) => void;
}

const statusFilters = [
    { text: 'Online', value: 'ONLINE' },
    { text: 'Offline', value: 'OFFLINE' },
    { text: 'Out of Service', value: 'OUTOFSERVICE' },
];

const getStatusColor = (status: Terminal['status']) => {
    if (status === 'ONLINE') {
        return 'green';
    }

    return status === 'OFFLINE' ? 'red' : 'orange';
};

export const createTerminalColumns = ({
    onCancelDelete,
    onConfirmDelete,
    onEdit,
}: CreateTerminalColumnsParams): TableProps<Terminal>['columns'] => [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        filterDropdown: getTextFilterDropdown('Search ID', 'number'),
        filterIcon,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        filterDropdown: getTextFilterDropdown('Search name'),
        filterIcon,
    },
    {
        title: 'Serial number',
        dataIndex: 'serialNumber',
        sorter: true,
        filterDropdown: getTextFilterDropdown('Search serial number'),
        filterIcon,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        sorter: true,
        filterDropdown: getTextFilterDropdown('Search address'),
        filterIcon,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        filters: statusFilters,
        render: (status: Terminal['status']) => <span style={{ color: getStatusColor(status) }}>{status}</span>,
    },
    {
        title: 'Created at',
        dataIndex: 'createdAt',
        sorter: true,
        filterDropdown: getDateRangeFilterDropdown,
        filterIcon,
        render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
        title: 'Updated at',
        dataIndex: 'updatedAt',
        sorter: true,
        filterDropdown: getDateRangeFilterDropdown,
        filterIcon,
        render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
        title: 'Actions',
        render: (_, record: Terminal) => (
            <TerminalActions
                terminal={record}
                onCancelDelete={onCancelDelete}
                onConfirmDelete={onConfirmDelete}
                onEdit={onEdit}
            />
        ),
    },
];
