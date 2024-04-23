const express = require('express');
const connection = require('../Models/student');

const studentLogin = express.Router(); // 创建一个新的路由实例

studentLogin.post('/studentlogin', async (req, res) => {
  const { username, password } = req.body;

  // 检查用户名和密码是否为空
  if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  connection.query('SELECT * FROM student WHERE Student_number = ?', [username], async function (error, results, fields) {
      if (error) {
          console.error('数据库查询出错:', error);
          return res.status(500).json({ error: '数据库查询失败' });
      }

      // 检查是否有匹配的用户
      if (results.length === 0) {
          return res.status(401).json({ error: '用户名或密码错误' });
      }

      const user = results[0];

      // 检查密码是否匹配
      const passwordMatch = await compare(password, user.Password);

      if (!passwordMatch) {
          return res.status(401).json({ error: '用户名或密码错误' });
      }

      // 登录成功，返回用户信息
      res.json({
          status: 0,
          user: {
              id: user.id,
              username: user.username,
              identity: user.identity
          }
      });
  });
});

function compare(x1,x2){
  if(x1===x2) return true;
  else return false;

}

module.exports = studentLogin; // 导出路由实例

