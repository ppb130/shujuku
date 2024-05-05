const express = require('express');
const bcrypt = require('bcrypt');
const pool  = require('../Models/student'); // 导入线程池
const saltRounds = 10; // 加密的盐值轮数

const studentLogin = express.Router(); // 创建一个新的路由实例

studentLogin.post('/studentlogin', async (req, res) => {
    const { username, password } = req.body;
    // 检查用户名和密码是否为空
    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    try {
        // 查询用户信息
        const [results, fields] = await pool.query('SELECT * FROM student WHERE Student_number = ?', [username]);
        //const [results, fields] = await pool.query('SELECT * FROM student ', []);
        console.log("results",results);
        // 检查是否有匹配的用户
        if (results.length === 0) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const user = results;
        console.log("user",user);
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
    } catch (error) {
        console.error('数据库查询出错:', error);
        return res.status(500).json({ error: '数据库查询失败' });
    }
});

// 将密码加密函数修改为bcrypt的加密函数
async function encryptPassword(password) {
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
        const hashedPassword = await encryptPassword(password);

        // 查询用户是否已存在
        const [existingUser, fields] = await pool.query('SELECT * FROM student WHERE Student_number = ?', [username]);

        if (existingUser.length > 0) {
            // 如果用户已存在，则更新密码
            await pool.query('UPDATE student SET Password = ? WHERE Student_number = ?', [hashedPassword, username]);
            res.json({
                status: 0,
                message: '密码更新成功'
            });
        } else {
            // 如果用户不存在，则创建新用户
            await pool.query('INSERT INTO student (Student_number, Password) VALUES (?, ?)', [username, hashedPassword]);
            res.json({
                status: 0,
                message: '新用户创建成功'
            });
        }
    } catch (error) {
        console.error('数据库操作出错:', error);
        return res.status(500).json({ error: '数据库操作失败' });
    }
});

module.exports = studentLogin; // 导出路由实例
