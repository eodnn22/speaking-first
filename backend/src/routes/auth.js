const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { read, write } = require('../models/db')

// cadastro
router.post('/register', async (req, res) => {
  const db = read()

  const hash = await bcrypt.hash(req.body.senha, 10)

  const aluno = {
    id: Date.now().toString(),
    nome: req.body.nome,
    email: req.body.email,
    senha: hash,
    contrato: null,
    assinatura: null,
    dataAssinatura: null
  }

  db.alunos.push(aluno)
  write(db)

  res.json(aluno)
})

// login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body

  // admin
  if (
    email === process.env.ADMIN_EMAIL &&
    senha === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: 'ADMIN' }, process.env.JWT_SECRET)
    return res.json({ token, role: 'ADMIN' })
  }

  const db = read()
  const aluno = db.alunos.find(a => a.email === email)

  if (!aluno) return res.status(404).send('Não encontrado')

  const ok = await bcrypt.compare(senha, aluno.senha)
  if (!ok) return res.status(401).send('Senha inválida')

  const token = jwt.sign(
    { id: aluno.id, role: 'ALUNO' },
    process.env.JWT_SECRET
  )

  res.json({ token, role: 'ALUNO', aluno })
})

module.exports = router