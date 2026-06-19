import {Button, Input, Space, Table, Modal, Form, Select, message, Popconfirm} from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import type { PopconfirmProps } from 'antd';
import type { FilterDropdownProps, FilterValue, SorterResult } from 'antd/es/table/interface';
import { EditOutlined, DeleteOutlined, FileAddOutlined, SearchOutlined} from '@ant-design/icons';
import { GET_TERMINALS } from './Entity';
import type { TableParams, Terminal } from './Entity';
import {api} from "../../../api/api.ts";
import axios from "axios";
import { useQuery } from '@apollo/client/react';
import { useMemo, useState } from 'react';
interface GetTerminalsResponse {
    terminals: {
        items: Terminal[];
        totalCount: number;
    };
}

interface GetTerminalsVariables {
    skip?: number;
    take?: number;
    where?: TerminalWhere;
    order?: Record<string, 'ASC' | 'DESC'>[];
}

type TerminalWhereCondition = {
    id?: { eq?: number };
    name?: { contains?: string };
    serialNumber?: { contains?: string };
    address?: { contains?: string };
    status?: { in?: Terminal['status'][] };
    createdAt?: { gte?: string; lte?: string };
    updatedAt?: { gte?: string; lte?: string };
};


type TerminalWhere = TerminalWhereCondition & {
    and?: TerminalWhereCondition[];
};


const getFirstFilterValue = (filter?: FilterValue | null) => filter?.[0]?.toString().trim();

export const TerminalsTable = () => {
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {current: 1, pageSize: 10},
        filters: {},
        sorter: {},
    });
    
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

    const showEditModal = (terminal: Terminal) => {

        form.setFieldsValue({
            id: terminal.id,
            name: terminal.name,
            serialNumber: terminal.serialNumber,
            address: terminal.address,
            status: terminal.status,
        });

        setSelectedTerminal(terminal);
        setIsEditModalOpen(true);
    };

    const handleEditOk = async () => {
        if (!selectedTerminal) return;

        const values = await form.validateFields();

        try {
            await api.put("/api/terminals", {
                id: selectedTerminal.id,
                ...values,
            });

            setIsEditModalOpen(false);
            form.resetFields();
            setSelectedTerminal(null);
            await refetch();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error(`Помилка редагування`);
                return;
            }
            messageApi.error("Невідома помилка");
        }
    };

    const handleEditCancel = () => {
        setIsCreateModalOpen(false);
        form.resetFields();
        setSelectedTerminal(null);
    };

    const showCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(true);
    };

    const handleCreateOk = async () => {

        const values = await form.validateFields();

        try {
            await api.post("/api/terminals", values);

            setIsCreateModalOpen(false);
            form.resetFields();
            setSelectedTerminal(null);
            await refetch();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error(`Помилка створення`);
                return;
            }
            messageApi.error("Невідома помилка");
        }
    };

    const handleCreateCancel = () => {
        setIsCreateModalOpen(false);
        form.resetFields();
        setSelectedTerminal(null);
    };


    const confirmDelete = async (id: number) => {
        try {
            await api.delete(`/api/terminals/${id}`);
            
            await refetch();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error(`Помилка видалення`);
                return;
            }
            messageApi.error("Невідома помилка");
        }
        messageApi.success("Видалено");
    };
    

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        messageApi.error('Відмінено');
    };
    


    const queryVariables = useMemo<GetTerminalsVariables>(() => {
        const current = tableParams.pagination.current ?? 1;
        const pageSize = tableParams.pagination.pageSize ?? 10;
        const skip = (current - 1) * pageSize;
        const take = pageSize;

        let order: GetTerminalsVariables['order'];
        if (tableParams.sorter.field && tableParams.sorter.order) {
            const direction = tableParams.sorter.order === 'ascend' ? 'ASC' : 'DESC';
            order = [{ [tableParams.sorter.field.toString()]: direction }];
        }

        const filterConditions: TerminalWhereCondition[] = [];

        const idFilter = getFirstFilterValue(tableParams.filters.id);
        const id = idFilter ? Number(idFilter) : undefined;
        if (id !== undefined && !Number.isNaN(id)) {
            filterConditions.push({ id: { eq: id } });
        }

        const name = getFirstFilterValue(tableParams.filters.name);
        if (name) {
            filterConditions.push({ name: { contains: name } });
        }

        const serialNumber = getFirstFilterValue(tableParams.filters.serialNumber);
        if (serialNumber) {
            filterConditions.push({ serialNumber: { contains: serialNumber } });
        }

        const address = getFirstFilterValue(tableParams.filters.address);
        if (address) {
            filterConditions.push({ address: { contains: address } });
        }

        const statuses = tableParams.filters.status?.map(String) as Terminal['status'][] | undefined;
        if (statuses?.length) {
            filterConditions.push({ status: { in: statuses } });
        }

        const createdAtFilter = getFirstFilterValue(tableParams.filters.createdAt);
        if (createdAtFilter) {
            const [from, to] = createdAtFilter.split('|');
            const createdAt: NonNullable<TerminalWhereCondition['createdAt']> = {};

            if (from) {
                createdAt.gte = new Date(`${from}T00:00:00`).toISOString();
            }

            if (to) {
                createdAt.lte = new Date(`${to}T23:59:59.999`).toISOString();
            }

            if (createdAt.gte || createdAt.lte) {
                filterConditions.push({ createdAt });
            }
        }

        const where = filterConditions.length ? { and: filterConditions } : undefined;

        return { skip, take, where, order };
    }, [tableParams]);

    const { data, loading, error, refetch } = useQuery<GetTerminalsResponse, GetTerminalsVariables>(
        GET_TERMINALS,
        {
            variables: queryVariables,
            fetchPolicy: 'network-only',
        },
    );

    const handleTableChange: TableProps<Terminal>['onChange'] = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Terminal> | SorterResult<Terminal>[],
    ) => {
        setTableParams({
            pagination,
            filters,
            sorter: Array.isArray(sorter) ? sorter[0] ?? {} : sorter,
        });
    };

    const getTextFilterDropdown =
        (placeholder: string, inputType: 'number' | 'text' = 'text') =>
        ({ selectedKeys, setSelectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
                <Input
                    type={inputType}
                    placeholder={placeholder}
                    value={selectedKeys[0]}
                    onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" icon={<SearchOutlined />} size="small" onClick={() => confirm()}>
                        Search
                    </Button>
                    <Button size="small" onClick={() => clearFilters?.()}>
                        Reset
                    </Button>
                </Space>
            </div>
        );

    const getDateRangeFilterDropdown = ({
        selectedKeys,
        setSelectedKeys,
        confirm,
        clearFilters,
    }: FilterDropdownProps) => {
        const [from = '', to = ''] = selectedKeys[0]?.toString().split('|') ?? [];
        const setRange = (nextFrom: string, nextTo: string) => {
            setSelectedKeys(nextFrom || nextTo ? [`${nextFrom}|${nextTo}`] : []);
        };

        return (
            <div style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
                <Space direction="vertical" style={{ marginBottom: 8 }}>
                    <Input type="date" value={from} onChange={(event) => setRange(event.target.value, to)} />
                    <Input type="date" value={to} onChange={(event) => setRange(from, event.target.value)} />
                </Space>
                <Space>
                    <Button type="primary" icon={<SearchOutlined />} size="small" onClick={() => confirm()}>
                        Search
                    </Button>
                    <Button size="small" onClick={() => clearFilters?.()}>
                        Reset
                    </Button>
                </Space>
            </div>
        );
    };

    const filterIcon = (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />;

    const columns: TableProps<Terminal>['columns'] = [
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
            filters: [
                { text: 'Online', value: 'ONLINE' },
                { text: 'Offline', value: 'OFFLINE' },
                { text: 'Out of Service', value: 'OUTOFSERVICE' },
            ],
            render: (status: Terminal['status']) => {
                const color = status === 'ONLINE' ? 'green' : status === 'OFFLINE' ? 'red' : 'orange';
                return <span style={{ color }}>{status}</span>;
            },
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
            
            render: (_, record: Terminal) => <div style={{
                display: 'flex',
                gap: '12px',
            }}>

                <Button style={{ width: '50px', height: '32px' }} onClick={() => showEditModal(record)}>
                    <EditOutlined />
                </Button>
                <Popconfirm
                    title="Видалити термінал"
                    description="Ви впевнені що хочете видалити цей термінал?"
                    onConfirm={() => confirmDelete(record.id)}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button style={{
                        width: '50px',
                        height: '32px',
                    }} danger> <DeleteOutlined /> </Button>
                </Popconfirm>
            </div>
        },
        
    ];

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        
        
        
        <div>
            <Modal
                title="Створити термінал"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isCreateModalOpen}
                onOk={handleCreateOk}
                onCancel={handleCreateCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Назва"
                        rules={[
                            { required: true, message: "Введіть назву термінала" },
                            { min: 3, message: "Назва має бути мінімум 3 символи" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="serialNumber"
                        label="Серійний номер"
                        rules={[
                            {required: true, message: "Введіть серійний номер" },
                            { max: 10, message: "Серійний номер може бути максимум 10 символів" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Адреса"
                        rules={[
                            { required: true, message: "Введіть адресу" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Статус"
                        rules={[
                            { required: true, message: "Оберіть статус" }
                        ]}
                    >
                        <Select
                            options={[
                                { value: "ONLINE", label: "Online" },
                                { value: "OFFLINE", label: "Offline" },
                                { value: "OUTOFSERVICE", label: "Out of Service" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            
            
            <Modal
                title="Редагувати термінал"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Назва"
                        rules={[
                            { required: true, message: "Введіть назву термінала" },
                            { min: 3, message: "Назва має бути мінімум 3 символа" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="serialNumber"
                        label="Серійний номер"
                        rules={[
                            {  required: true, message: "Введіть серійний номер" },
                            { max: 10, message: "Серійний номер може бути максимум 10 символів" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Адреса"
                        rules={[
                            { required: true, message: "Введіть адресу" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Статус"
                        rules={[
                            { required: true, message: "Оберіть статус" }
                        ]}
                    >
                        <Select
                            options={[
                                { value: "ONLINE", label: "Online" },
                                { value: "OFFLINE", label: "Offline" },
                                { value: "OUTOFSERVICE", label: "Out of Service" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            
            {contextHolder}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',

            }}>
                 <Button onClick={() => showCreateModal()} style={{
                    display: 'flex',
                    alignSelf: 'flex-end',
                    margin: '20px 0',
                    marginRight: '60px'
                }}>
                    <FileAddOutlined  />
                    Додати термінал
                </Button>

            </div>
            <Table<Terminal>
                columns={columns}
                rowKey={(record) => record.id.toString()}
                dataSource={data?.terminals?.items ?? []}
                pagination={{
                    ...tableParams.pagination,
                    total: data?.terminals?.totalCount ?? 0,
                    showSizeChanger: true,
                }}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
        
    );
};
