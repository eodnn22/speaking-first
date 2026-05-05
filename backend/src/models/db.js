const fs = require('fs')

const FILE = './db.json'

function read() {
  return JSON.parse(fs.readFileSync(FILE))
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

module.exports = { read, write }