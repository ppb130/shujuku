import React from 'react';
import { ScheduleOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import  SelectClass from "./selectClass"

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: '选课',
    icon: <UserOutlined />,
    label: '选课',
  },
  {
    key: '退课',
    icon: <ScheduleOutlined />,
    label: '退课',
  },
  {
    key: '查看课表',
    icon: <SnippetsOutlined />,
    label: '查看课表',
  },
  {
    key: '查看成绩',
    icon: <ScheduleOutlined />,
    label: '查看成绩',
  }
];

const StudentHome = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <SelectClass/>
          </Content>
        </Layout>
      </Layout>
      <Content>
          
      </Content>
    </Layout>
  );
};

export default StudentHome;
