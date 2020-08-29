const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  password: 'u07me1030',
  host: 'localhost',
  port: 5432,
  database: 'authdatabase',
})

module.exports = pool
