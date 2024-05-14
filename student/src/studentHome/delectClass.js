import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd'; // 导入Button和message组件
import axios from 'axios';

const DelectClass = () => {
    const [dataSource, setDataSource] = useState([]);
    const [studentId, setStudentId] = useState();

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
            sorter: (a, b) => a.Course_name.localeCompare(b.Course_name),
        },
        {
            title: '上课地点',
            dataIndex: 'Classroom',
            key: 'Classroom',
            sorter: (a, b) => a.Classroom.localeCompare(b.Classroom),
        },
        {
            title: '上课时间',
            dataIndex: 'Time',
            key: 'Time',
            sorter: (a, b) => a.Time.localeCompare(b.Time),
        },
        {
            title: '教师',
            dataIndex: 'Name',
            key: 'Name',
            sorter: (a, b) => a.Teacher.localeCompare(b.Teacher),
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
        },
        {
            title: '退课',
            key: 'action',
            render: (text, record) => ( // 渲染删除按钮
                <Button onClick={() => handleDelete(record)}>退课</Button>
            ),
        }
        
    ];

    const handleDelete = async (record) => {
        try {
            const response = await axios.post('http://localhost:3000/deleteClass?', {
                Student_number: studentId,
                Course_number: record.Course_number
            });
            message.success('删除成功'); // 显示删除成功的消息
            fetchStudentCourses(); // 重新加载学生课程数据
        } catch (error) {
            console.error('Error deleting course:', error);
            message.error('删除失败'); // 显示删除失败的消息
        }
    };

    const fetchStudentCourses = async () => {
        try {
          console.log("studentId", studentId);
          const response = await axios.get(`http://localhost:3000/student_cources?studentNumber=${studentId}`);
          // 筛选学期为 "24春" 的课程
          const filteredCourses = response.data.filter(course => course.Term === "24春");
          setDataSource(filteredCourses);
          console.log("response", filteredCourses);
        } catch (error) {
          console.error('Error fetching student courses:', error);
          // 在这里你可以处理错误，比如显示错误信息给用户
        }
      };
      

    useEffect(() => {
        if (studentId) {
            fetchStudentCourses();
          }
    },  [studentId]);

    return (
        <div>
            <h1>退课</h1>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};

export default DelectClass;

