const Pool = require('pool').Pool

const pool = new Pool({
  user: 'postgres',
  password: 'u07me1030',
  host: 'localhost',
  port: 5432,
  database: 'authDatabase',
})

module.exports = pool
