import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd'; // 导入Button和message组件
import axios from 'axios';

const DelectClass = () => {
    const [dataSource, setDataSource] = useState([]);

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'Course_name',
            key: 'Course_name',
        },
        {
            title: 'Classroom',
            dataIndex: 'Classroom',
            key: 'Classroom',
        },
        {
            title: 'Time',
            dataIndex: 'Time',
            key: 'Time',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => ( // 渲染删除按钮
                <Button onClick={() => handleDelete(record)}>Delete</Button>
            ),
        },
    ];

    const handleDelete = async (record) => {
        try {
            const response = await axios.post('http://localhost:3000/deleteClass', {
                Student_number: "21120777",
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
            const response = await axios.get('http://localhost:3000/student_cources');
            setDataSource(response.data);
        } catch (error) {
            console.error('Error fetching student courses:', error);
            // 在这里你可以处理错误，比如显示错误信息给用户
        }
    };

    useEffect(() => {
        fetchStudentCourses();
    }, []);

    return (
        <div>
            <h1>Student Courses</h1>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};

export default DelectClass;

