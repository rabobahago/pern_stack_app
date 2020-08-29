const express = require('express')
const cors = require('cors')

app = express()
app.use(express.json())
app.use(cors())

app.use('/auth', require('./routes/jwtAuth'))

let port = 5000
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
