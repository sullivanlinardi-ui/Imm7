import { useEffect, useState } from 'react'

const formInicial = {
  nome: '',
  telefone: '',
  rg: '',
  cpf: '',
  pix: '',
  carro: '',
  placa: ''
}

export default function App() {
  const [freelancers, setFreelancers] = useState(() => {
    const dadosSalvos = localStorage.getItem('immersion_freelancers')
    return dadosSalvos ? JSON.parse(dadosSalvos) : []
  })

  const [selecionados, setSelecionados] = useState([])
  const [form, setForm] = useState(formInicial)
  const [editing, setEditing] = useState(null)

  const [evento, setEvento] = useState(() => {
    const eventoSalvo = localStorage.getItem('immersion_evento')
    return eventoSalvo ? JSON.parse(eventoSalvo) : {
      cliente: '',
      local: '',
      dataInicio: '',
      dataTermino: ''
    }
  })

  useEffect(() => {
    localStorage.setItem('immersion_freelancers', JSON.stringify(freelancers))
  }, [freelancers])

  useEffect(() => {
    localStorage.setItem('immersion_evento', JSON.stringify(evento))
  }, [evento])

  function salvarFreelancer() {
    if (!form.nome.trim()) {
      alert('Digite o nome do freelancer.')
      return
    }

    if (editing !== null) {
      const listaAtualizada = [...freelancers]
      listaAtualizada[editing] = form
      setFreelancers(listaAtualizada)
      setEditing(null)
    } else {
      setFreelancers([...freelancers, form])
    }

    setForm(formInicial)
  }

  function editarFreelancer(index) {
    setForm(freelancers[index])
    setEditing(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function excluirFreelancer(index) {
    const confirmar = confirm('Deseja excluir este freelancer?')
    if (!confirmar) return

    const novaLista = freelancers.filter((_, i) => i !== index)
    setFreelancers(novaLista)
    setSelecionados(selecionados.filter(i => i !== index))
  }

  function alternarSelecionado(index) {
    if (selecionados.includes(index)) {
      setSelecionados(selecionados.filter(i => i !== index))
    } else {
      setSelecionados([...selecionados, index])
    }
  }

  const listaTecnicos = selecionados.map(index => freelancers[index]).filter(Boolean)

  function textoWhatsapp() {
    let texto = `Immersion Eventos\n\n`
    texto += `Cliente: ${evento.cliente}\n`
    texto += `Local: ${evento.local}\n`
    texto += `Data início: ${evento.dataInicio}\n`
    texto += `Data término: ${evento.dataTermino}\n\n`
    texto += `Lista de técnicos:\n\n`

    listaTecnicos.forEach((f, index) => {
      texto += `${index + 1}. ${f.nome}\n`
      texto += `Telefone: ${f.telefone}\n`
      texto += `RG: ${f.rg}\n`
      texto += `CPF: ${f.cpf}\n`
      texto += `Modelo do carro: ${f.carro}\n`
      texto += `Placa: ${f.placa}\n\n`
    })

    return texto
  }

  function compartilharWhatsapp() {
    if (listaTecnicos.length === 0) {
      alert('Selecione pelo menos um técnico para compartilhar.')
      return
    }

    const url = `https://wa.me/?text=${encodeURIComponent(textoWhatsapp())}`
    window.open(url, '_blank')
  }

  return (
    <div className="container">
      <div className="card no-print">
        <div className="logo-area">
          <img className="logo" src="/logo.png" alt="Logo Immersion Eventos" />
          <div>
            <h1>Immersion Eventos</h1>
            <p className="small">Cadastro e lista de técnicos</p>
          </div>
        </div>

        <h2>Cadastro de Freelancer</h2>

        <div className="grid">
          <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} />
          <input placeholder="RG" value={form.rg} onChange={e => setForm({...form, rg: e.target.value})} />
          <input placeholder="CPF" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} />
          <input placeholder="Chave Pix" value={form.pix} onChange={e => setForm({...form, pix: e.target.value})} />
          <input placeholder="Modelo do carro" value={form.carro} onChange={e => setForm({...form, carro: e.target.value})} />
          <input placeholder="Placa do carro" value={form.placa} onChange={e => setForm({...form, placa: e.target.value})} />
        </div>

        <button className="primary" onClick={salvarFreelancer}>
          {editing !== null ? 'Atualizar cadastro' : 'Salvar freelancer'}
        </button>
      </div>

      <div className="card no-print">
        <h2>Dados da lista de técnicos</h2>

        <div className="grid">
          <input placeholder="Cliente" value={evento.cliente} onChange={e => setEvento({...evento, cliente: e.target.value})} />
          <input placeholder="Local" value={evento.local} onChange={e => setEvento({...evento, local: e.target.value})} />
          <input placeholder="Data início" value={evento.dataInicio} onChange={e => setEvento({...evento, dataInicio: e.target.value})} />
          <input placeholder="Data término" value={evento.dataTermino} onChange={e => setEvento({...evento, dataTermino: e.target.value})} />
        </div>
      </div>

      <div className="card no-print">
        <h2>Freelancers cadastrados</h2>
        <p className="small">Marque quem deve aparecer na lista de técnicos.</p>

        {freelancers.length === 0 && <p>Nenhum freelancer cadastrado ainda.</p>}

        {freelancers.map((f, index) => (
          <div className="freelancer" key={index}>
            <div className="row">
              <input
                className="checkbox"
                type="checkbox"
                checked={selecionados.includes(index)}
                onChange={() => alternarSelecionado(index)}
              />
              <div>
                <strong>{f.nome}</strong><br />
                Telefone: {f.telefone}<br />
                RG: {f.rg}<br />
                CPF: {f.cpf}<br />
                Chave Pix: {f.pix}<br />
                Modelo do carro: {f.carro}<br />
                Placa: {f.placa}<br />

                <button className="secondary" onClick={() => editarFreelancer(index)}>Editar cadastro</button>
                <button className="danger" onClick={() => excluirFreelancer(index)}>Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="cliente-lista">
          <div className="header-lista">
            <img className="logo-lista" src="/logo.png" alt="Logo Immersion Eventos" />
            <h2>Immersion Eventos</h2>
            <p><strong>Cliente:</strong> {evento.cliente}</p>
            <p><strong>Local:</strong> {evento.local}</p>
            <p><strong>Data início:</strong> {evento.dataInicio}</p>
            <p><strong>Data término:</strong> {evento.dataTermino}</p>
          </div>

          <h3>Lista de técnicos</h3>

          {listaTecnicos.length === 0 && <p>Nenhum técnico selecionado.</p>}

          {listaTecnicos.map((f, index) => (
            <div className="item-lista" key={index}>
              <strong>{f.nome}</strong><br />
              Telefone: {f.telefone}<br />
              RG: {f.rg}<br />
              CPF: {f.cpf}<br />
              Modelo do carro: {f.carro}<br />
              Placa: {f.placa}
            </div>
          ))}
        </div>

        <div className="no-print">
          <button className="primary" onClick={() => window.print()}>Imprimir / Salvar PDF</button>
          <button className="whatsapp" onClick={compartilharWhatsapp}>Compartilhar via WhatsApp</button>
        </div>
      </div>
    </div>
  )
}
