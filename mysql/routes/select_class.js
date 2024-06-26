const express = require('express');
const selectClass = express.Router();
const pool = require('../Models/student');

selectClass.get('/getClassInfo', async (req, res) => {
  try {
    // 定义 SQL 查询语句
    let sql = `SELECT * FROM course, course_name, teacher, teacher_name
               WHERE course.Course_number = course_name.Course_number
               AND course.Job_number = teacher.Job_number
               AND teacher.Job_number = teacher_name.Job_number`;

    // 查询数据库中的课程信息
    pool.getConnection(function(err, conn) {
      if (err) {
        console.log("数据库连接失败");
        res.status(500).send('Error connecting to database');
      } else {
        console.log("数据库连接成功");
        conn.query(sql, function (err, result) {
          if (err) {
            console.error('Database error:', err);
            if (err.code === 'ER_SIGNAL_EXCEPTION') {
              const errorMessage = err.message;
              return res.status(400).json({ error: errorMessage });
            }
            res.status(500).send(err.message); // 发送数据库报错信息给前端
          } else {
            res.json(result);
            conn.release();
          }
        });
      }
    });
  } catch (error) {
    console.error('Error fetching course information:', error);
    res.status(500).send('Error fetching course information');
  }
});


selectClass.post('/addStudentClass', async (req, res) => {
  try {
    const { Student_number, Course_number,Time,Job_number,Term } = req.body;
    let sql = `INSERT INTO student_course (Student_number, Course_number, Term,Time,Job_number) VALUES (?, ?, ?,?,?)`;
    const results = await pool.query(sql, [Student_number, Course_number,Term,Time,Job_number]);
    res.json(results);
  } catch (error) {
    console.error('Error adding student class:', error);
    // 检查是否有触发器发送的错误消息
    if (error.code === 'ER_SIGNAL_EXCEPTION' && error.sqlMessage) {
      // 从触发器中获取错误消息，并发送给前端
      const errorMessage = error.sqlMessage;
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).send('Error adding student class');
    }
  }
});

module.exports = selectClass;


