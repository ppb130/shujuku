import React, { useState, useEffect } from "react";
import axios from "axios";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Table,
} from "antd";
const { Column } = Table;
const { Header, Content, Footer, Sider } = Layout;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("书籍录入", "1", <PieChartOutlined />),
  getItem("书籍查阅", "2", <DesktopOutlined />),
];

const breadcrumbItems = [getItem("User", "0"), getItem("Bill", "1")];
// const currentUser= JSON.parse(sessionStorage.getItem('user')) || {};

const App = () => {
  const [form] = Form.useForm(); // 使用Form.useForm()钩子获取form实例
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [data, setData] = useState([]); // 初始化data状态
  // const history = useHistory();

  useEffect(() => {
    if (selectedKey === "2") {
      axios
        .get("http://localhost:3100/api/search")
        .then((response) => {
          // 解析响应数据并设置到状态中
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedKey]); // 依赖数组中添加 selectedKey

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3100/api/search");
      setData(response.data);
    } catch (error) {
      console.error("获取书籍数据失败:", error);
    }
  };

  const onMenuSelect = ({ key }) => {
    setSelectedKey(key); // 设置选中的菜单项
  };
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3100/api/books",
        values
      );
      if (response.status === 200) {
        alert("提交成功！");
        form.resetFields(); // 清空表单
      }
    } catch (error) {
      console.error("提交失败：", error);
      alert("提交失败！");
    }
  };

  // 删除书籍
  const deleteBook = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3100/api/delete/${id}`
      );
      if (response.status === 200) {
        alert("书籍删除成功");
        fetchData(); // 重新获取更新后的数据
      }
    } catch (error) {
      console.error("删除书籍失败:", error);
      alert("删除书籍失败");
    }
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
            {selectedKey === "1" && (
              <Form
                {...formItemLayout}
                variant="filled"
                style={{
                  maxWidth: 600,
                }}
                form={form}
                onFinish={onFinish}
              >
                <Form.Item
                  label="书名"
                  name="bookName"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="作者"
                  name="author"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="出版商"
                  name="publisher"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="ISBN号"
                  name="isbn"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="出版年月"
                  name="cbTime"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>

                <Form.Item
                  label="生成册数"
                  name="bookNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="内容介绍"
                  name="info"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 6,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            )}

            {selectedKey === "2" && (
              <Table dataSource={data} rowKey="_id">
                <Column title="书名" dataIndex="bookName" key="bookName" />
                <Column title="作者" dataIndex="author" key="author" />
                <Column title="出版商" dataIndex="publisher" key="publisher" />
                <Column title="ISBN号" dataIndex="isbn" key="isbn" />
                <Column title="出版年月" dataIndex="cbTime" key="cbTime" />
                <Column title="册数" dataIndex="bookNumber" key="bookNumber" />
                <Column title="内容介绍" dataIndex="info" key="info" />
                <Column
                  title="操作"
                  key="action"
                  render={(_, record) => (
                    <Space size="middle">
                      <Button onClick={() => deleteBook(record._id)}>
                        删除
                      </Button>
                    </Space>
                  )}
                />
              </Table>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }} />
      </Layout>
    </Layout>
  );
};

export default App;
