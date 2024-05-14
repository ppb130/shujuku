import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { Radar } from 'react-chartjs-2';
Chart.register(...registerables);

const StudentCourseChart = () => {
  const [courseData, setCourseData] = useState(null);
  const [studentId, setStudentId] = useState();
  const [chartInstance, setChartInstance] = useState(null);
  const [selectTerm, setSelectTerm] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null); // 新增的选择学期状态

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (id) {
      setStudentId(id);
    }
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);  

  useEffect(() => {
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [studentId]); 

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/student_cources?studentNumber=${studentId}`);
      setCourseData(response.data);
      // 提取可选择的学期
      const terms = response.data.map(course => course.Term);
      // 使用 Set 去除重复项，并转换成数组
      const uniqueTerms = [...new Set(terms)];
      setSelectTerm(uniqueTerms);
    } catch (error) {
      console.error('获取学生课程信息时出错:', error);
    }
  };

  const parseCourseData = (courseData) => {
    if (!courseData) {
      return getDefaultData();
    }
  
    const filteredCourses = courseData.filter(course => course.Term === selectedTerm); // 使用选择的学期进行过滤
    const labels = filteredCourses.map(course => course.Course_name);
    const data = filteredCourses.map(course => parseFloat(course.Grade_point));
  
    return {
      labels: labels,
      datasets: [{
        label: '绩点分布',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: data
      }]
    };
  };
  
  const getDefaultData = () => {
    return {
      labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
      datasets: [{
        label: '绩点分布',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: [0, 0, 0, 0, 0]
      }]
    };
  };

  // Function to handle term selection
  const handleTermChange = (event) => {
    const selectedTerm = event.target.value;
    setSelectedTerm(selectedTerm); // 更新选择的学期状态
    // Here you can fetch data for the selected term if needed
    console.log('Selected Term:', selectedTerm);
  };

  return (
    <div>
      <h2>学生课程绩点分布雷达图</h2>
      {/* Render radio buttons for each term */}
      <div>
        {
          selectTerm && selectTerm.length > 0 && (
            <div>
              {
                selectTerm.map((term, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      value={term}
                      checked={selectedTerm === term} // 使用选择的学期来确定选中状态
                      onChange={handleTermChange}
                    />
                    {term}
                  </label>
                ))
              }
            </div>
          )
        }
      </div>
      {/* Radar chart component */}
      <div style={{ width: '70%', height: '70%' }}>
      <Radar
        data={parseCourseData(courseData)}
        options={{
          scale: {
            angle: {
              min: 0,
              max: 360,
              ticks: {
                display: false
              },
              grid: {
                display: false
              }
            },
            r: {
              min: 0,
              max: 4,
              stepSize: 1
            }
          },
          onCanvasDestroy: (chartInstance) => setChartInstance(chartInstance)
        }}
      />
      </div>
    </div>
  );
};

export default StudentCourseChart;
