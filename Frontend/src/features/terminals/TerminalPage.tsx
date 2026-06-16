import React from 'react';
import { Flex, Space, Table, Tag} from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    name: string;
    serialnumber: number;
    address: string;
    status: string[];
    createdAt: string;
    updatedAt: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Serial number',
        dataIndex: 'serialnumber',
        key: 'serialnumber',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (_, { status }) => (
            <Flex gap="small" align="center" wrap>
                {status.map((status) => {
                    let color = status.length > 6 ? 'green' : 'geekblue';
                    if (status === 'Offline') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={status}>
                            {status.toUpperCase()}
                        </Tag>
                    );
                })}
            </Flex>
        ),
    },
    {
        title: 'Created at',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Edit {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    
];

const App: React.FC = () => <Table<DataType> columns={columns} dataSource={data} />;

export default App
