const express = require('express');
const connection = require('../Models/student');

const selectClass = express.Router(); // 创建一个新的路由实例

selectClass.get('/getClassInfo', async (req, res) => {
  try {
    let sql=`SELECT * FROM course ,  course_name  ,teacher  , teacher_name  
    WHERE course.Course_number=course_name.Course_number 
    AND course.Job_number=teacher.Job_number
    AND teacher.Job_number=teacher_name.Job_number`
    // 查询数据库中的课程信息
    connection.query(sql, async function (error, results, fields) {
      if (error) {
        console.error('Error fetching course information:', error);
        res.status(500).send('Error fetching course information');
      } else {
        // 将查询结果发送回客户端
        res.json(results);
      }
    });
  } catch (error) {
    console.error('Error fetching course information:', error);
    res.status(500).send('Error fetching course information');
  }
});

module.exports = selectClass;
