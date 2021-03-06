const router = require('express').Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../utils/jwtGenerator')
const validinfo = require('../middleware/validinfo')
const authorization = require('../middleware/authorization')

router.post('/register', validinfo, async (req, res) => {
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
    //5) Generate token
    const token = jwtGenerator(newUser.rows[0].user_id)
    res.json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(401).send('server error')
  }
})

//Login Route
router.post('/login', validinfo, async (req, res) => {
  try {
    // 1) destructure req.body
    const { email, password } = req.body
    //2) check if you user don't exist, if not throw error
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ])
    if (user.rows.length === 0) {
      return res.status(401).json('Incorrect password or email')
    }
    //3) check if incoming password is the same as database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password,
    )
    if (!validPassword) {
      return res.status(401).send('Incorrect password or email')
    }
    //4)  give jwt token
    const token = jwtGenerator(user.rows[0].user_id)
    res.json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(401).send('server error')
  }
})
router.get('/is-verify', authorization, async (req, res) => {
  try {
    res.json(true)
  } catch (error) {
    console.error(error.message)
    res.status(401).send('server error')
  }
})

module.exports = router
