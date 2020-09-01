const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.headers('token')
    if (!jwtToken) {
      return res.status(403).send('Not authorized')
    }
    const payload = jwt.verify(jwtToken, `${process.env.jwtSecret}`)
    req.user = payload.user
  } catch (error) {
    console.log(error.message)
    return res.status(403).send('you are not authorized')
  }
}
