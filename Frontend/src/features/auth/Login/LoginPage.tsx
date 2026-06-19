import type { FormProps } from "antd";
import { Button, Form, Input, message, Divider } from "antd";
import axios from "axios";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api.ts";
import { saveToken } from "../Auth.ts";
import {
    MailOutlined,
    LockOutlined
} from "@ant-design/icons";


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

function LoginPage() {
    const navigate = useNavigate(); 
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<LoginRequest>["onFinish"] = async (values) => {
        try {
            const response = await api.post<LoginResponse>("/api/user/login", values);

            saveToken(response.data.token);
            navigate("/terminals");
        } catch (error) {
            console.error("Error logging in:", error);
            if (axios.isAxiosError(error) && error.response?.status !== 401 && error.response?.status !== 404) {
                messageApi.error("Не вдалося підключитися до сервера");
                return;
            }

            messageApi.error("Неправильна пошта або пароль");
        }
    };

    return (
        <div className="login-page">
            {contextHolder}
            <Form<LoginRequest>
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className="login-form">
                    <Divider
                        style={{
                            borderColor: "#666",
                            color: "white",
                            margin: "24px 0",
                            paddingBottom: "40px",
                        }}
                    >
                        <span style={{
                            textAlign: "center",
                            fontSize: "30px",
                        }}>Вхід в систему</span>
                    </Divider>
                <Form.Item<LoginRequest>
                    name="email"
                    rules={[{ type: 'email', required: true, message: 'Введіть коректну пошту' }]}
                >
                    <Input required  placeholder="Введіть пошту" prefix={<MailOutlined />} style={{
                        width: "300px",
                        marginTop: "50px",
                        height: "50px",
                        fontSize: "18px",
                    }} />
                </Form.Item>

                <Form.Item<LoginRequest>
                    name="password"
                >
                    <Input.Password required placeholder="Введіть пароль" prefix={<LockOutlined />} style={{
                        width: "300px",
                        height: "50px",
                        fontSize: "18px",
                        marginTop: "20px",
                    }}/>
                </Form.Item>

                <Button type="primary" htmlType="submit" style={{
                    height: "50px",
                    width: "200px",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    marginTop: "20px",
                    alignSelf: "center",
                }}>
                    <span style ={{
                        textAlign: "center",
                        fontSize: "18px",
                    }}>Увійти</span>
                </Button>
                </div>
            </Form>
        </div>
    );
}

export default LoginPage;
