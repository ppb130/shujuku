import React, { useState,useEffect } from "react";
import axios from "axios";
import {
  DesktopOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  Table,
  // Mentions,
  // Select,
  // TreeSelect,
} from "antd";
const { Column  } = Table;
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("书籍查阅", "2", <DesktopOutlined />),
];

const breadcrumbItems = [getItem("User", "0"), getItem("Bill", "1")];
// const currentUser= JSON.parse(sessionStorage.getItem('user')) || {};

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [data, setData] = useState([]); // 初始化data状态
  // const history = useHistory();  

  useEffect(() => {
    // 在组件挂载后获取数据
    axios
      .get("http://localhost:3100/api/search")
      .then((response) => {
        // 解析响应数据并设置到状态中
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  const onMenuSelect = ({ key }) => {
    setSelectedKey(key); // 设置选中的菜单项
  };
    
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onSelect={onMenuSelect} // 设置onSelect事件处理函数
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={breadcrumbItems.map((item) => ({
              label: item.label,
              key: item.key,
            }))}
          />
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >

            {selectedKey === "2" && (
              <Table dataSource={data} rowKey="_id">
                <Column title="书名" dataIndex="bookName" key="bookName" />
                <Column title="作者" dataIndex="author" key="author" />
                <Column title="出版商" dataIndex="publisher" key="publisher" />
                <Column title="ISBN号" dataIndex="isbn" key="isbn" />
                <Column title="出版年月" dataIndex="cbTime" key="cbTime" />
                <Column title="册数" dataIndex="bookNumber" key="bookNumber" />
                <Column title="内容介绍" dataIndex="info" key="info" />
                
              </Table>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
