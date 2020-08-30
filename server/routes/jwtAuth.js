const router = require('express').Router()
const pool = require('../db')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
  try {
    //1) Destructure req.body;
    const { name, email, password } = req.body

    //2) Check if user exists (if user exists throw an Error)
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ])
    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists')
    }
    //3) Bcrypt the user password
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const hashPassword = await bcrypt.hash(password, salt)
    //4) Enter the new user into our database
    const newUser = await pool.query(
      'INSERT INTO users(user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *',
      [name, email, hashPassword],
    )
    res.json(newUser.rows[0])
    //5) Generate token
  } catch (error) {
    console.error(error.message)
    res.status(401).send('server error')
  }
})

module.exports = router
