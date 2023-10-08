import React, { useContext, useState } from "react";
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
import BusinessHeaderComp from "../../components/Headercomp/BusinessHeaderComp";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import { removeLocalUserInfo } from "../../utils/helpers/setUserLocalInfo";
import { LogoutProvider } from "../../App";

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
  getItem("Marketplace", "/marketplace", <HomeOutlined style={iconStyle} />),
  getItem("Orders", "/order", <ShoppingCartOutlined style={iconStyle} />),
  // getItem("Products", "/products", <ShoppingOutlined style={iconStyle} />),
];

const siderBottomItem: MenuItem[] = [
  getItem("Settings", "/settings", <SettingOutlined style={iconStyle} />),
  getItem("Logout", "/logout", <LoginOutlined style={iconStyle} />),
];

interface Props {
  children: React.ReactNode;
}

const BusinessLayout: React.FC<Props> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const { haveToken, logoutFunc } = useContext(LogoutProvider);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  return (
    <ShoppingCartProvider>
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
                console.log(item);
                if (item.key === "/logout") logoutFunc();
                else navigate(item.key)
              }}
              mode="inline"
              items={siderBottomItem}
              style={{ fontSize: "1rem", fontWeight: "500" }}
            />
          </div>
        </Sider>

        <Layout>
          <BusinessHeaderComp pageName={selectedKeys} />
          <Content style={{ margin: "0 16px" }}>
            <div
              style={{
                padding: 0,
                // minHeight: 360,
                // background: colorBgContainer,
              }}
            >
              {props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ShoppingCartProvider>
  );
};

export default BusinessLayout;
