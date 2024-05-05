import React, { useState, useEffect } from 'react';
import {  Table, Input, Button, Space,Layout } from 'antd';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import StudentCourse from './studentCourse';

const { Content } = Layout;

const SelectClass = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const columns = [
    {
      title: '课程名',
      dataIndex: 'Course_name',
      key: 'Course_name',
    },
    {
      title: '课程号',
      dataIndex: 'Course_number',
      key: 'Course_number',
    },
    {
      title: '课程教师',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '课程学分',
      dataIndex: 'Credit',
      key: 'Credit',
    },
    {
      title: '课程时间',
      dataIndex: 'Time',
      key: 'Time',
    },
  ];

  const fetchData = async (params = {}) => {
    try {
      const response = await axios.get('http://localhost:3000/getClassInfo', {
        params: {
          page: params.current,
          pageSize: params.pageSize,
        },
      });
      setDataSource(response.data);
      setPagination({
        ...pagination,
        current: params.current,
        total: response.data.length,
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
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
          if (visible) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
              setTimeout(() => searchInput.select(), 100);
            }
          }
        },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
  
  const handleSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
    console.log('selectedRowKeys changed: ', selectedRows);
  };

  const handleConfirmSelection = async () => {
    try {
      // 逐行发送数据
      for (const row of selectedRows) {
        const dataToSend = {
          Student_number: "21120777",  // 这里替换为真实的学生学号
          Course_number: row.Course_number,
          credit: row.Credit,
          Time: row.Time,
        };
    
        // 发送HTTP请求到后端
        const response = await axios.post('http://localhost:3000/addStudentClass', dataToSend);
        console.log('Response from server:', response.data);
      }
  
      // 清空选中的行
      setSelectedRows([]);
    } catch (error) {
      console.error('Error confirming selection:', error);
    }
  };
  

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: 0 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Table
            rowKey="Course_number"
            dataSource={dataSource}
            rowSelection={{
              type: 'checkbox',
              onChange: handleSelectChange,
            }}
            columns={columns.map(col => ({
              ...col,
              ...getColumnSearchProps(col.dataIndex),
            }))}
            pagination={pagination}
            onChange={handleTableChange}
          />
          <Button type="primary" onClick={handleConfirmSelection}>
            确认选课
          </Button>
        </div>
      </Content>
     <StudentCourse/>
    </Layout> 

  );
};

export default SelectClass;
