import React, { useState } from 'react';
import {
    PieChartOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu} from 'antd';
import {logout} from "../../features/auth/Auth.ts";
import {Outlet} from "react-router-dom";

const {Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === '2') {
        logout();
    }
    if (e.key === '1') {
        window.location.href = '/terminals';
    }
};

const items: MenuItem[] = [
    getItem('Термінали', '1', <PieChartOutlined />),
    getItem('Вийти', '2', <LogoutOutlined />),
];

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{
                display: "flex",
                flexDirection: "column",
            }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                {!collapsed && ( <span style={{
                    fontSize: "24px",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",   
                    textAlign: "center",
                    marginTop: "20px",
                    marginBottom: "20px",
                    fontFamily: "Arial, sans-serif",
                }}>Менеджер терміналів</span>)}
                <Menu onClick={onClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}
                
                />
            </Sider>
            <Layout>
                <Outlet />
            </Layout>
        </Layout>
    );
};

export default App;