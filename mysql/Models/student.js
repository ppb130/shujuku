var mysql      = require('mysql')
var connection = mysql.createConnection({
  host     : '116.63.107.106',
  user     : 'root',
  password : '375201',
  database : 'xuanke'
});

module.exports = connection; 
