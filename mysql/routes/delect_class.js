const express = require('express');
const delectClass = express.Router();
const pool = require('../Models/student');

delectClass.post('/deleteClass', async (req, res) => {
    try {
        const { Student_number, Course_number } = req.body;
        console.log(Student_number, Course_number);
        const sql = `DELETE FROM student_course WHERE Student_number = ? AND Course_number = ?;`;
        const result = await pool.query(sql, [Student_number, Course_number]);
        console.log('Deleted ' + result.affectedRows + ' rows');
        res.json(result);
    } catch (error) {
        console.error('Error deleting student course:', error);
        res.status(500).send('Error deleting student course');
    }
});

module.exports = delectClass;

