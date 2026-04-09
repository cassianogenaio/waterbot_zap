const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const cron = require("node-cron");

const {
  carregarDados,
  adicionarPonto,
  buscarPontoHoje,
  pegarAlvo,
} = require("./funcoes.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

const GRUPO_ID = "120363428006824755@g.us";

let grupo;

carregarDados();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Bot conectado!");
  grupo = await client.getChatById(GRUPO_ID);
});


client.on('message_create', async (msg) => {
  if (msg.from.includes('@newsletter')) return;
  // vericar se a mensagem é do grupo específico (Água)
  const chat = await msg.getChat(); 
  if (!chat.isGroup || chat.id._serialized !== GRUPO_ID) return;
  //
  
  let nome;
  let userId
  if (msg.fromMe) {
    nome = "Cassiano";
    userId = msg.from; // Nome do remetente (BOT)
  } else {
    const contact = await msg.getContact();
    nome = contact.pushname || contact.name || contact.number;
    userId = contact.id._serialized;
  }
  
  // userId = msg.author || msg.from;
  

  // Log detalhado
  console.log("//-------------------//"); 
  console.log("ID do usuário:", userId); 
  console.log("Grupo:", grupo.name);
  console.log("nome:", nome);
  console.log("Mensagem:", msg.body);
  console.log("//-------------------//\n");
  
  // Adicionar ponto
  if (msg.body.startsWith(".")) {

    // const mentions = msg.mentions;
    // console.log("Mencionados:", mentions.map(m => m.name || m.pushname || m.number).join(", "));
    
    alvo = await pegarAlvo(msg);
    console.log("Alvo identificado adicionar:", alvo);

    adicionarPonto(alvo.id, alvo.nome);
    chat.sendMessage(`Ponto adicionado ao *${alvo.nome}* 💧!!`);
    console.log("Ponto adicionado para", alvo.nome);
  }

    // Consultar pontos
  if (msg.body.startsWith("!consultar")) {
    const alvo = await pegarAlvo(msg);
    console.log("Alvo identificado para consulta:", alvo);

    const pessoa = buscarPontoHoje(alvo.id);

    const pontosHoje = pessoa.pontos;
    let mensagem = `💧 Pontos de hoje de *${pessoa.nome}*\n\n${pontosHoje}`;
    chat.sendMessage(mensagem);
  }
});

client.initialize();