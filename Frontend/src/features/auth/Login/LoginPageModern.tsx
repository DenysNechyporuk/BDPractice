import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api.ts";
import { saveToken } from "../Auth.ts";
import "./LoginPageModern.css";

type LoginRequest = {
    email: string;
    password: string;
};

type LoginResponse = {
    token: string;
};

const onFinishFailed: FormProps<LoginRequest>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

function LoginPageModern() {
    const navigate = useNavigate();

    const onFinish: FormProps<LoginRequest>["onFinish"] = async (values) => {
        try {
            const response = await api.post<LoginResponse>("/api/user/login", values);

            saveToken(response.data.token);
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
        <main className="modern-login-page">
            <section className="modern-login-info" aria-label="Terminal Manager">
            </section>

            <section className="modern-login-panel" aria-label="Sign in">
                <div className="modern-login-brand">
                    <div>
                        <h2>LOGIN</h2>
                    </div>
                </div>

                <div className="modern-login-tabs">
                    <span className="modern-login-tab modern-login-tab-active">Account login</span>
                </div>

                <Form<LoginRequest>
                    className="modern-login-form"
                    name="modern-login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item<LoginRequest> label="E-mail" name="email">
                        <Input
                            size="large"
                            prefix={<MailOutlined />}
                            placeholder="operator@example.com"
                            autoComplete="email"
                        />
                    </Form.Item>

                    <Form.Item<LoginRequest> label="Password" name="password">
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Enter password"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Button className="modern-login-submit" type="primary" htmlType="submit" size="large" block>
                        Sign in
                    </Button>
                </Form>
            </section>
        </main>
    );
}

export default LoginPageModern;
