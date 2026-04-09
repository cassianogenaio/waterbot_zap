const fs = require("fs");

// carregar dados do arquivo JSON

// let dados = {};
function carregarDados() {
  if (fs.existsSync("database/dados.json")) {
    dados = JSON.parse(
      fs.readFileSync("database/dados.json", "utf8")
    );
  }
}

// salvar dados no arquivo JSON
function salvarDados() {
  fs.writeFileSync(
    "database/dados.json",
    JSON.stringify(dados, null, 2)
  );
}


// calendario
function hoje() {
  return new Date().toISOString().split('T')[0];
}

// function ontem() {
//   const d = new Date();
//   d.setDate(d.getDate() - 1);
//   return d.toISOString().split('T')[0];
// }


function buscarPontoHoje(alvoId) {
  try {
    if (fs.existsSync("database/dados.json")) {
      const dados = JSON.parse(
        fs.readFileSync("database/dados.json", "utf8")
      );

      const alvo = dados[alvoId];

      if (!alvo) return { nome: "Desconhecido", pontos: 0 };

      const data = hoje();
      const pontosHoje = alvo.historico?.[data] || 0;

      return {
        nome: alvo.nome,
        pontos: pontosHoje
      };
    }
  } catch (erro) {
    console.log("Erro ao ler dados:", erro);
    return { nome: "Desconhecido", pontos: 0 };
  }
}

async function pegarAlvo(msg) {
  const mentions = await msg.getMentions();

  // se mencionou alguém
  if (mentions.length > 0) {

    const contato = mentions[0];

    return {
      id: contato.id._serialized,
      nome: contato.pushname || contato.name || contato.number
    };
  }

  if (msg.fromMe) {
    return {
      id: msg.from,
      nome: "Cassiano"
    };
  }

  // se não mencionou → quem enviou
  const contato = await msg.getContact();

  return {
    id: contato.id._serialized,
    nome: contato.pushname || contato.name || contato.number
  };
}

function adicionarPonto(id, nome) {
  const data = hoje();

  if (!dados[id]) {
    dados[id] = {
      nome: nome,
      historico: {}
    };
  }

  if (!dados[id].historico[data]) {
    dados[id].historico[data] = 0;
  }

  dados[id].historico[data]++;

  salvarDados();
}


module.exports = {
  carregarDados,
  adicionarPonto,
  buscarPontoHoje,
  pegarAlvo,
};
