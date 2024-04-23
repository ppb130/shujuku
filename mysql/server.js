const express = require('express');
const cors = require('cors');
const app = express();
const studentLogin = require('./routes/student_login');
const connection = require('./Models/student');

app.use(cors());
app.use(express.json());

connection.connect(function(err) {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    return;
  }
  console.log('数据库连接成功，连接ID:', connection.threadId);
});

app.use(studentLogin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
