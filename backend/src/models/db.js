const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, 'db.json')

function read() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ alunos: [] }))
  }
  return JSON.parse(fs.readFileSync(FILE))
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

module.exports = { read, write }
