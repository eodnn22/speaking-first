const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/auth', require('./routes/auth'))
app.use('/alunos', require('./routes/alunos'))

app.listen(process.env.PORT, () =>
  console.log('Servidor rodando')
)