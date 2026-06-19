import { Button, Input, Space } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';

export const getTextFilterDropdown =
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

export const getDateRangeFilterDropdown = ({
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

export const filterIcon = (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
);
