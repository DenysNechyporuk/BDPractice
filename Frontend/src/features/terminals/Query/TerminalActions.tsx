import { Button, Popconfirm } from 'antd';
import type { PopconfirmProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import type { Terminal } from './Entity';

interface TerminalActionsProps {
    terminal: Terminal;
    onCancelDelete: PopconfirmProps['onCancel'];
    onConfirmDelete: (id: number) => Promise<void>;
    onEdit: (terminal: Terminal) => void;
}

const actionButtonStyle = {
    width: '50px',
    height: '32px',
};

export const TerminalActions = ({
    terminal,
    onCancelDelete,
    onConfirmDelete,
    onEdit,
}: TerminalActionsProps) => (
    <div style={{ display: 'flex', gap: '12px' }}>
        <Button style={actionButtonStyle} onClick={() => onEdit(terminal)}>
            <EditOutlined />
        </Button>

        <Popconfirm
            title="Видалити термінал"
            description="Ви впевнені що хочете видалити цей термінал?"
            onConfirm={() => onConfirmDelete(terminal.id)}
            onCancel={onCancelDelete}
            okText="Yes"
            cancelText="No"
        >
            <Button style={actionButtonStyle} danger>
                <DeleteOutlined />
            </Button>
        </Popconfirm>
    </div>
);
