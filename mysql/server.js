const express = require('express');
const cors = require('cors');
const app = express();
const studentLogin = require('./routes/student_login');
const selectClass = require('./routes/select_class');
const student_course = require('./routes/student_class');
const delectClass = require('./routes/delect_class');
const mysql = require("mysql"); // 引入mysql2的promise版，方便使用async/await
const pool = require('./Models/student')

app.use(cors());
app.use(express.json());

app.use(studentLogin);
app.use(selectClass);
app.use(student_course);
app.use(delectClass);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
