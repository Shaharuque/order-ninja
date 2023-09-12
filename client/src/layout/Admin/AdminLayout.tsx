import React, { useState } from "react";
import {
  DesktopOutlined,
  SettingOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import appLogo from "../../../public/logo.png";
import Headercomp from "../../components/Headercomp/Headercomp";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { removeLocalUserInfo } from "../../utils/helpers/setUserLocalInfo";

const { Header, Content, Footer, Sider } = Layout;

function IconDiv() {
  return (
    <div className="logo-container">
      <img src={appLogo} alt="app-logo" className="app-logo" />
      <h3 className="app-logo-title">Order Ninja </h3>
    </div>
  );
}

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
const iconStyle = { fontSize: "20px", color: "#73fbfd" };

const items: MenuItem[] = [
  getItem("Dashboard", "/dashboard", <HomeOutlined style={iconStyle} />),
  getItem("Orders", "/order", <ShoppingCartOutlined style={iconStyle} />),
  getItem("Products", "/products", <ShoppingOutlined style={iconStyle} />),
  // getItem("Manage", "/manage", <BarChartOutlined style={iconStyle} />),
  getItem("User List", "/user-list", <BarChartOutlined style={iconStyle} />),
  // getItem("Analytics", "/analytics", <DesktopOutlined style={iconStyle} />),
  // getItem("User", "sub1", <UserOutlined />, [
  //     getItem("Tom", "3"),
  //     getItem("Bill", "4"),
  //     getItem("Alex", "5"),
  // ]),
  // getItem("Team", "sub2", <TeamOutlined />, [
  //     getItem("Team 1", "6"),
  //     getItem("Team 2", "8"),
  // ]),
  // getItem("Files", "9", <FileOutlined />),
];

const siderBottomItem: MenuItem[] = [
  // getItem("Settings", "/settings", <SettingOutlined style={iconStyle} />),
  getItem("Logout", "/logout", <LoginOutlined style={iconStyle} />),
];

interface Props {
  children: React.ReactNode;
}

// removeLocalUserInfo

const AdminLayout: React.FC<Props> = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{ position: "relative" }}
        collapsible={false}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div>
          <div className="demo-logo-vertical">
            <IconDiv />
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            style={{ fontSize: "1rem", fontWeight: "500" }}
            onClick={(item) => navigate(item.key)}
            selectedKeys={[selectedKeys]}
          />
        </div>

        <div style={{ position: "absolute", bottom: 0 }}>
          <Menu
            theme="dark"
            onClick={(item) => {
              if (item.key === "/logout") {
                removeLocalUserInfo();
                navigate("/login");
              } else {
                navigate(item.key);
              }
            }}
            mode="inline"
            items={siderBottomItem}
            style={{ fontSize: "1rem", fontWeight: "500" }}
          />
        </div>
      </Sider>

      <Layout>
        <Headercomp pageName={selectedKeys} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 0,
              // minHeight: 360,
              // background: colorBgContainer,
            }}
          >
            {props.children}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
