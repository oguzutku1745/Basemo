const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "database-basemo.cujmyyxkgayi.eu-central-1.rds.amazonaws.com",
    user: "admin",
    password: "Basemo-ooa.1",
    database: "basemoDB",
});

module.exports = con;
