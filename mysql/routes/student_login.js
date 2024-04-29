const express = require('express');
const connection = require('../Models/student');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 加密的盐值轮数


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

        console.log(user);
  
        // 检查密码是否匹配
        const passwordMatch = await bcrypt.compare(password, user.Password);
  
        if (!passwordMatch) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
  
        // 登录成功，返回用户信息
        res.json({
            status: 0,
            user: {
                id: user.Student_number,
                identity: user.identity
            }
        });
    });
  });
  
  // 将密码加密函数修改为bcrypt的加密函数
  async function encryptPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

studentLogin.post('/addOrUpdateStudent', async (req, res) => {
    console.log('收到请求');
    console.log(req.body);
    const { username, password } = req.body;

    // 检查用户名和密码是否为空
    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    try {
        // 加密用户的密码
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 检查用户是否已存在
        connection.query('SELECT * FROM student WHERE Student_number = ?', [username], async function (error, results, fields) {
            if (error) {
                console.error('数据库查询出错:', error);
                return res.status(500).json({ error: '数据库查询失败' });
            }

            if (results.length > 0) {
                // 如果用户已存在，则更新密码
                connection.query('UPDATE student SET Password = ? WHERE Student_number = ?', [hashedPassword, username], async function (error, results, fields) {
                    if (error) {
                        console.error('更新密码出错:', error);
                        return res.status(500).json({ error: '更新密码失败' });
                    }

                    res.json({
                        status: 0,
                        message: '密码更新成功'
                    });
                });
            } else {
                // 如果用户不存在，则创建新用户
                connection.query('INSERT INTO student (Student_number, Password) VALUES (?, ?)', [username, hashedPassword], async function (error, results, fields) {
                    if (error) {
                        console.error('创建新用户出错:', error);
                        return res.status(500).json({ error: '创建新用户失败' });
                    }

                    res.json({
                        status: 0,
                        message: '新用户创建成功'
                    });
                });
            }
        });
    } catch (error) {
        console.error('加密密码出错:', error);
        return res.status(500).json({ error: '加密密码失败' });
    }
});

module.exports = studentLogin; // 导出路由实例

