const express = require('express');
const student_course = express.Router();
const pool = require('../Models/student');

student_course.get('/student_cources', async (req, res) => {
  const { studentNumber } = req.query;
  console.log("studentNumber",studentNumber);
  try {
    pool.getConnection(function (err, conn){
      if (err) {
        console.log("数据库连接失败");
    } else {
        console.log("数据库连接成功");
        // 定义sql查询语句
        let sql = `SELECT * FROM student_course, course_name, student_name, course
               WHERE student_course.Course_number = course_name.Course_number
               AND student_course.Student_number = student_name.Student_number
               AND student_course.Course_number = course.Course_number
               AND student_course.Student_number = ?`;
        // 查询操作
        conn.query(sql,[studentNumber], function (err, result) {
            if (err) {
                console.log("数据库查询失败");
            } else {
                res.json(result);
                conn.release();
            }
        })
    }
    })
  } catch (error) {
    console.error('Error fetching student course information:', error);
    res.status(500).send('Error fetching student course information');
  }
});

module.exports = student_course;
