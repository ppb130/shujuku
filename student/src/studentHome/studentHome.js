import React, { useState } from 'react';
import { ScheduleOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
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
