const router = require('express').Router()
const multer = require('multer')
const { read, write } = require('../models/db')

const upload = multer({ dest: 'uploads/' })

// listar alunos (admin)
router.get('/', (req, res) => {
  const db = read()
  res.json(db.alunos)
})

// upload contrato
router.post('/:id/contrato', upload.single('file'), (req, res) => {
  const db = read()

  const aluno = db.alunos.find(a => a.id === req.params.id)

  aluno.contrato = req.file.filename

  write(db)

  res.send('Contrato anexado')
})

// assinar
router.post('/:id/assinar', (req, res) => {
  const db = read()

  const aluno = db.alunos.find(a => a.id === req.params.id)

  if (aluno.assinatura) {
    return res.send('Já assinado')
  }

  aluno.assinatura = req.body.assinatura
  aluno.dataAssinatura = new Date()
  aluno.ip = req.ip

  write(db)

  res.send('Assinado')
})

module.exports = router