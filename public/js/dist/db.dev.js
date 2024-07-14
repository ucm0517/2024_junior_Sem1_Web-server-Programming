"use strict";

var mysql = require('mysql2');

var pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0517',
  database: 'webserver3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool;
//# sourceMappingURL=db.dev.js.map
