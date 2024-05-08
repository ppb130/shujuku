import React, { useState,useEffect } from 'react';
import { ScheduleOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme,Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import SelectClass from "./selectClass";
import StudentCourse from "./studentCourse";
import DelectClass from "./delectClass";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: '选课',
    icon: <UserOutlined />,
    label: '选课',
    component: <SelectClass />,
  },
  {
    key: '退课',
    icon: <ScheduleOutlined />,
    label: '退课',
    component: <DelectClass />,
  },
  {
    key: '查看课表',
    icon: <SnippetsOutlined />,
    label: '查看课表',
    component: <StudentCourse />, // Add component for '查看课表' if needed
  },
  {
    key: '查看成绩',
    icon: <ScheduleOutlined />,
    label: '查看成绩',
    component: null, // Add component for '查看成绩' if needed
  }
];

const StudentHome = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(items[0].key);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
  };

  // 在学生主页（/StudentHome）中的JavaScript文件中实现注销功能
  const logout = () => {
    console.log("注销成功");
  // 清除本地存储中的token
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
  // 重定向到主页（/）
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        // 如果不存在token，重定向到主页
        navigate("/");
    }
}, []);


  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Button onClick={logout}>注销</Button>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['选课']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            onSelect={({ key }) => handleMenuItemClick(key)}
          >
            {items.map(item => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              padding: 0,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {items.find(item => item.key === selectedMenuItem)?.component}
          </Content>
        </Layout>
      </Layout>
      <Content>
          
      </Content>
    </Layout>
  );
};

export default StudentHome;
