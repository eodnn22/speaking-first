const API = "http://localhost:3000"

// CADASTRO
async function register() {
  await fetch(API + "/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })
  })

  alert("Cadastrado!")
}

// LOGIN
async function login() {
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      senha: senha.value
    })
  })

  const data = await res.json()

  if (data.role === "ADMIN") {
    localStorage.setItem("token", data.token)
    window.location = "admin.html"
  } else {
    localStorage.setItem("aluno", JSON.stringify(data.aluno))
    window.location = "aluno.html"
  }
}

// ADMIN - LISTAR ALUNOS
async function carregarAlunos() {
  const res = await fetch(API + "/alunos")
  const alunos = await res.json()

  lista.innerHTML = alunos.map(a => `
    <div style="background:white; margin:10px; padding:10px;">
      <b>${a.nome}</b><br>

      <input type="file" onchange="upload('${a.id}', this)">

      ${a.contrato ? `<p>Contrato enviado</p>` : ''}

      ${a.assinatura ? `
        <p>Assinado em: ${new Date(a.dataAssinatura).toLocaleString()}</p>
        <img src="${a.assinatura}" width="200"/>
      ` : '<p>Não assinado</p>'}
    </div>
  `).join('')
}

// UPLOAD CONTRATO
async function upload(id, input) {
  const form = new FormData()
  form.append("file", input.files[0])

  await fetch(API + "/alunos/" + id + "/contrato", {
    method: "POST",
    body: form
  })

  alert("Contrato enviado!")
  carregarAlunos()
}

// ALUNO - MOSTRAR CONTRATO
if (window.location.pathname.includes("aluno.html")) {
  const aluno = JSON.parse(localStorage.getItem("aluno"))

  if (aluno && aluno.contrato) {
    document.getElementById("contrato").src =
      API + "/uploads/" + aluno.contrato
  }

  // CANVAS ASSINATURA
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")

  let desenhando = false

  canvas.onmousedown = () => desenhando = true
  canvas.onmouseup = () => desenhando = false

  canvas.onmousemove = e => {
    if (!desenhando) return
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
  }
}

// ASSINAR
async function assinar() {
  const aluno = JSON.parse(localStorage.getItem("aluno"))
  const canvas = document.getElementById("canvas")

  const assinatura = canvas.toDataURL()

  await fetch(API + "/alunos/" + aluno.id + "/assinar", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ assinatura })
  })

  alert("Contrato assinado!")
}