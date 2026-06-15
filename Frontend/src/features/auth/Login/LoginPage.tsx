import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import axios from "axios";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api.ts";
import { saveToken } from "../Auth.ts";

type LoginRequest = {
    email: string;
    password: string;
    remember?: boolean;
};

type LoginResponse = {
    token: string;
};

const onFinishFailed: FormProps<LoginRequest>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

function LoginPage() {
    const navigate = useNavigate();

    const onFinish: FormProps<LoginRequest>["onFinish"] = async (values) => {
        try {
            const response = await api.post<LoginResponse>("/api/user/login", values);

            saveToken(response.data.token, values.remember);
            navigate("/terminals");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status !== 401 && error.response?.status !== 404) {
                message.error("Не вдалося підключитися до сервера");
                return;
            }

            message.error("Неправильна пошта або пароль");
        }
    };

    return (
        <div className="login-page">
            <Form<LoginRequest>
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<LoginRequest>
                    label="E-mail"
                    name="email"
                >
                    <Input />
                </Form.Item>

                <Form.Item<LoginRequest>
                    label="Password"
                    name="password"
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<LoginRequest>
                    name="remember"
                    valuePropName="checked"
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default LoginPage;
