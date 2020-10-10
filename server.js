const express = require('express')
const connectDB = require('./config/db')
const app = express()
const apiUsers = require('./apis/user')
const apiAuth = require('./apis/auth')
const apiReset = require('./apis/resetPassword')
const apiBook = require('./apis/book')

// Connecting Our DataBase
connectDB();

// Init Middleware
app.use(express.json({ extended: false }))
app.use('/public', express.static('public'))
            
app.get('/', (req, res)=> res.send('API Running'))
// Our Routes

app.use('/api/user', apiUsers)
app.use('/api/auth', apiAuth)
app.use('/api/resetPassword', apiReset)
app.use('/api/book', apiBook)


const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`Server Started On PORT ${PORT}`))

