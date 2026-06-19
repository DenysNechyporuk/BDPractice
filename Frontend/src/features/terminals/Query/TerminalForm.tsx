import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';

interface TerminalFormProps {
    form: FormInstance;
    nameMinMessage: string;
}

const statusOptions = [
    { value: 'ONLINE', label: 'Online' },
    { value: 'OFFLINE', label: 'Offline' },
    { value: 'OUTOFSERVICE', label: 'Out of Service' },
];

export const TerminalForm = ({ form, nameMinMessage }: TerminalFormProps) => (
    <Form form={form} layout="vertical">
        <Form.Item
            name="name"
            label="Назва"
            rules={[
                { required: true, message: 'Введіть назву термінала' },
                { min: 3, message: nameMinMessage },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="serialNumber"
            label="Серійний номер"
            rules={[
                { required: true, message: 'Введіть серійний номер' },
                {
                    max: 10,
                    message: 'Серійний номер може бути максимум 10 символів',
                },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="address"
            label="Адреса"
            rules={[{ required: true, message: 'Введіть адресу' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true, message: 'Оберіть статус' }]}
        >
            <Select options={statusOptions} />
        </Form.Item>
    </Form>
);
