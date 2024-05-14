import React, { useState, useEffect } from 'react';
import {  Table, Input, Button, Space,Layout,message} from 'antd';
import { useNavigate } from 'react-router-dom';
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
  const [studentId, setStudentId] = useState();
  const [key, setKey] = useState(0); // 定义 key 属性的状态

  const navigate = useNavigate();

  
  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (id) {
      setStudentId(id);
    }
  }, []);

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
    {
      title: '选课人数',
      dataIndex: 'CurCapacity',
      key: 'CurCapacity',
    },
    {
      title: '课程容量',
      dataIndex: 'Capacity',
      key: 'Capacity',
    }
  ];

  const fetchData = async (params = {}) => {
    try {
      const response = await axios.get('http://localhost:3000/getClassInfo', {
        params: {
          page: params.current,
          pageSize: params.pageSize,
        },
      });
      console.log("response",response.data);
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
          placeholder={`搜索 `}
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
          Student_number: studentId,  // 这里替换为真实的学生学号
          Course_number: row.Course_number,
          credit: row.Credit,
          Time: row.Time,
          Job_number: row.Job_number,
          Term: row.Term,
        };
  
        // 发送HTTP请求到后端
        const response = await axios.post('http://localhost:3000/addStudentClass', dataToSend);
        console.log('Response from server:', response.data);
        
        // 检查是否有后端返回的错误信息
        if (response.data.error) {
          // 如果有错误信息，则显示给用户
          alert("选课失败：" + response.data.error);
          return;
        }
      }
      
      // 清空选中的行
      setSelectedRows([]);
      console.log('Selected rows confirmed:', selectedRows);
      navigate(window.location.pathname, { replace: true });
      console.log('Navigated to studentHome');
      message.success("选课成功");
      fetchData();
      setKey(prevKey => prevKey + 1);
    } 
    catch (error) {
      console.error('Error confirming selection:', error);
      // 如果是 Axios 错误，则尝试显示具体的错误原因
      if (error.response && error.response.data && error.response.data.error) {
        message.error("选课失败：" + error.response.data.error);
      } else {
        // 如果是其他类型的错误，显示通用错误消息
        message.error("选课失败：服务器错误，请稍后重试");
      }
    }
  };
  
  
  

  return (

    <Layout>
      <Content style={{ padding: '0 50px', marginTop: 0 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Table
            // rowKey=index
            // dataSource={dataSource}
            dataSource={dataSource.map((row, index) => ({
              ...row,
              key: `${row.Course_number}-${row.Course_number}-${row.Job_number}`, // 使用 Course_number 和 Time 组合作为 key
            }))}
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
     <StudentCourse key={key}/>
    </Layout> 
  );
};

export default SelectClass;
