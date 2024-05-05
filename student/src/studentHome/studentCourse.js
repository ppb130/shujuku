import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

const TimeColumn = styled.div`
  width: 100px;
`;

const generateTimeColumn = () => {
  const times = [
    { key: 1, time: '08:00 - 08:45' },
    { key: 2, time: '08:55 - 09:40' },
    { key: 3, time: '10:00 - 10:45' },
    { key: 4, time: '10:55 - 11:40' },
    { key: 5, time: '13:00 - 13:45' },
    { key: 6, time: '13:55 - 14:40' },
    { key: 7, time: '15:00 - 15:45' },
    { key: 8, time: '15:55 - 16:40' },
    { key: 9, time: '18:00 - 18:45' },
    { key: 10, time: '18:55 - 19:40' },
    { key: 11, time: '20:00 - 20:45' },
    { key: 12, time: '20:55 - 21:40' },
  ];
  return times;
};

const generateWeekDates = () => {
  const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  return weekdays;
};

const StudentCourse = () => {
  const [dataSource, setDataSource] = useState([]);
  const weekdays = generateWeekDates();
  
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (text, record, rowIndex) => {
    
        return  <TimeColumn>{text}</TimeColumn>;
      },
    },
    
    ...weekdays.map((day, index) => ({
      title: day,
      dataIndex: `day${index}`, // 可以根据需求修改dataIndex
      key: `day${index}`,
      width: 150,
    })),
  ];

const fetchStudentCourses = async () => {
  try {
    const response = await fetch('http://localhost:3000/student_cources');
    if (!response.ok) {
      throw new Error('Failed to fetch student courses');
    }
    const data = await response.json();
    setDataSource(data);
    // 在这里你可以对返回的数据进行任何操作，比如存储到状态中或者进行其他处理
    console.log('Student courses data:', dataSource);
    return data;
  } catch (error) {
    console.error('Error fetching student courses:', error);
    // 在这里你可以处理错误，比如显示错误信息给用户
  }
};

// 调用函数来获取学生课程数据
useEffect(() => {
  fetchStudentCourses();
},[])

const getWeekend = (value) => {
  switch(value){
    case '星期一':
      return 0;
    case '星期二':
      return 1;
    case '星期三':
      return 2;
    case '星期四':
      return 3;
    case '星期五':
      return 4;
    case '星期六':
      return 5;
    case '星期日':
      return 6;
    default:
      return -1;
  }
}

const getTimeIndex = (value) => {
  const [inputStartTime, inputEndTime] = value.split('-').map(time => time.trim());
  const timeArray=generateTimeColumn();
  const indexes = [];

  // 遍历时间数组
  for (let i = 0; i < timeArray.length; i++) {
    const { time } = timeArray[i];
    // 将数组中的时间段拆分为开始时间和结束时间
    const [startTime, endTime] = time.split(' - ').map(time => time.trim());
    // 判断输入的时间段是否在数组中的某个时间段中
    if (inputStartTime <= endTime && inputEndTime >= startTime) {
      indexes.push(i); // 如果是，则将索引添加到结果数组中
    }
  }

  return indexes;
}

const getIndex = (value) => {
  // 如果值为空，则返回空对象
  if (!value) return {};

  const [day, timeRange] = value.split(' ');
  const dayIndex = getWeekend(day);
  const timeIndexs = getTimeIndex(timeRange);
  return { dayIndex, timeIndexs };
}




const data = generateTimeColumn().map((time, timeIndex) => {
  const rowData = {};
 
  // 根据dataSource中的每个课程的Time属性，将数据渲染到相应位置
  dataSource.forEach((course) => { 
    // 判断课程时间是否与当前时间段匹配
    const { dayIndex, timeIndexs } = getIndex(course.Time);
    // 将 dayIndex 和 timeIndexs 添加到 rowData 对象中
    if(timeIndexs.includes(timeIndex)){
      if(timeIndex%2===0){
      rowData[`day${dayIndex}`]=course.Course_name;
      }
      else{
      rowData[`day${dayIndex}`]=course.Classroom;
      }
    }
  });

  return {
    ...time,
    ...rowData,
  };
});




  

  return <Table columns={columns} dataSource={data} bordered pagination={{ pageSize: 12 }} />;
};

export default StudentCourse;
