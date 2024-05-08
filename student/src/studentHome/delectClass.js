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
            title: 'Course Name',
            dataIndex: 'Course_name',
            key: 'Course_name',
            sorter: (a, b) => a.Course_name.localeCompare(b.Course_name),
        },
        {
            title: 'Classroom',
            dataIndex: 'Classroom',
            key: 'Classroom',
            sorter: (a, b) => a.Classroom.localeCompare(b.Classroom),
        },
        {
            title: 'Time',
            dataIndex: 'Time',
            key: 'Time',
            sorter: (a, b) => a.Time.localeCompare(b.Time),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => ( // 渲染删除按钮
                <Button onClick={() => handleDelete(record)}>退课</Button>
            ),
        },
    ];

    const handleDelete = async (record) => {
        try {
            const response = await axios.post('http://localhost:3000/deleteClass?', {
                Student_number: studentId,
                Course_number: record.Course_number
            });
            message.success('Course deleted successfully'); // 显示删除成功的消息
            fetchStudentCourses(); // 重新加载学生课程数据
        } catch (error) {
            console.error('Error deleting course:', error);
            message.error('Failed to delete course'); // 显示删除失败的消息
        }
    };

    const fetchStudentCourses = async () => {
        try {
            console.log("studentId",studentId);
            const response = await axios.get(`http://localhost:3000/student_cources?studentNumber=${studentId}`);
            // const response = await axios.get(`http://localhost:3000/student_cources?studentNumber=21120777`);
            setDataSource(response.data);
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
            <h1>Student Courses</h1>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};

export default DelectClass;

