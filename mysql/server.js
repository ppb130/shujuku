var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '116.63.107.106',
  user     : 'root',
  password : '375201',
  database : 'xuanke'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});