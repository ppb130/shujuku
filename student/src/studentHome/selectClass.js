import React, { useState, useEffect } from 'react';
import { Table, Layout, Breadcrumb } from 'antd';
import axios from 'axios';

const { Content } = Layout;

const SelectClass = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = [
    {
      title: '课程名',
      dataIndex: 'Course_name', // 修改为后端返回的字段名
      key: 'Course_name',
    },
    {
      title: '课程号',
      dataIndex: 'Course_number', // 修改为后端返回的字段名
      key: 'Course_number',
    },
    {
      title: '课程教室',
      dataIndex: 'Professional_title', // 修改为后端返回的字段名
      key: 'Professional_title',
    },
    {
      title: '课程学分',
      dataIndex: 'Credit', // 修改为后端返回的字段名
      key: 'Credit',
    },
    {
      title: '课程时间',
      dataIndex: 'Time', // 修改为后端返回的字段名
      key: 'Time',
    },
  ];

  const fetchData = async (params = {}) => {
    try {
      const response = await axios.get('http://localhost:3000/getClassInfo');
      console.log(response.data);
      setDataSource(response.data);
      setPagination({
        ...pagination,
        current: params.current,
        total: response.data.length, // 假设返回的是所有数据，这里设置总数为数据长度
      });
    } catch (error) {
      console.error('Error fetching course information:', error);
    }
  };

  useEffect(() => {
    fetchData({ current: pagination.current, pageSize: pagination.pageSize });
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    fetchData({ current: pagination.current, pageSize: pagination.pageSize });
  };

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default SelectClass;


