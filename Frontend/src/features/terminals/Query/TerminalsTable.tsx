import { Button, Form, message, Modal, Table } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import type { PopconfirmProps } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { FileAddOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client/react';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { api } from '../../../api/api.ts';
import { GET_TERMINALS } from './Entity';
import type { TableParams, Terminal } from './Entity';
import { createTerminalColumns } from './terminalColumns';
import { TerminalForm } from './TerminalForm';
import type { GetTerminalsVariables, TerminalWhereCondition } from './terminalTypes';

interface GetTerminalsResponse {
    terminals: {
        items: Terminal[];
        totalCount: number;
    };
}

const getFirstFilterValue = (filter?: FilterValue | null) => filter?.[0]?.toString().trim();

export const TerminalsTable = () => {
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: { current: 1, pageSize: 10 },
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
        if (!selectedTerminal) {
            return;
        }

        const values = await form.validateFields();

        try {
            await api.put('/api/terminals', {
                id: selectedTerminal.id,
                ...values,
            });

            setIsEditModalOpen(false);
            form.resetFields();
            setSelectedTerminal(null);
            await refetch();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error('Помилка редагування');
                return;
            }

            messageApi.error('Невідома помилка');
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
            await api.post('/api/terminals', values);

            setIsCreateModalOpen(false);
            form.resetFields();
            setSelectedTerminal(null);
            await refetch();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error('Помилка створення');
                return;
            }

            messageApi.error('Невідома помилка');
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
                messageApi.error('Помилка видалення');
                return;
            }

            messageApi.error('Невідома помилка');
        }

        messageApi.success('Видалено');
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

    const columns = createTerminalColumns({
        onCancelDelete: cancel,
        onConfirmDelete: confirmDelete,
        onEdit: showEditModal,
    });

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div style={{paddingLeft: "20px", paddingRight: "20px", backgroundColor: 'white', borderRadius: '10px', marginTop: '20px', marginLeft: '20px', marginRight: '20px' }}>
            <Modal
                title="Створити термінал"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isCreateModalOpen}
                onOk={handleCreateOk}
                onCancel={handleCreateCancel}
            >
                <TerminalForm form={form} nameMinMessage="Назва має бути мінімум 3 символи" />
            </Modal>

            <Modal
                title="Редагувати термінал"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <TerminalForm form={form} nameMinMessage="Назва має бути мінімум 3 символа" />
            </Modal>

            {contextHolder}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    onClick={showCreateModal}
                    style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                        margin: '20px 60px 20px 0',
                    }}
                >
                    <FileAddOutlined />
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
