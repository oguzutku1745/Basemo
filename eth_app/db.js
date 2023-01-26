const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '36912-eeou-Y1116',
    database: 'basemo'
  });

connection.connect();

module.exports = connection;