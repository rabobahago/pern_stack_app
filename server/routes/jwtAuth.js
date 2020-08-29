const router = require('express').Router()
const pool = require('../db')

router.post('/register', async (req, res) => {
  try {
    //1) Destructure req.body;
    const { name, email, password } = req.body

    //2) Check if user exists (if user exists throw an Error)
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ])
    res.json(user.rows)
    //3) Bcrypt the user password

    //4) Enter the new user into our database

    //5) Generate token
  } catch (error) {
    console.error(error.message)
    res.status(401).send('server error')
  }
})

module.exports = router
