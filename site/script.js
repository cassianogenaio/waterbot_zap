let usuarios = {};
async function carregarUsuarios() {
  const response = await fetch("../database/dados.json");
  usuarios = await response.json();

  const select = document.getElementById("selecao");

  Object.entries(usuarios).forEach(([id, usuario]) => {
    const option = document.createElement("option");

    option.value = id;
    option.textContent = usuario.nome;

    select.appendChild(option);
  });
}

carregarUsuarios();

function calcular() {
  const pessoaId = document.getElementById("selecao").value;
  const inicio = document.getElementById("data-inicio").value;
  const fim = document.getElementById("data-fim").value;

  if (!pessoaId || !inicio || !fim) return;

  const historico = usuarios[pessoaId].historico;

  let total = 0;
  let diasComAgua = 0;

  let dataAtual = new Date(inicio);
  const dataFinal = new Date(fim);

  while (dataAtual <= dataFinal) {
    const dataFormatada = dataAtual.toISOString().split("T")[0];

    if (historico[dataFormatada]) {
      total += historico[dataFormatada];
      diasComAgua++;
    }

    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  const dias =
    Math.floor((new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24)) + 1;

  const resultado = document.getElementById("resultado");

  resultado.textContent = `Resultado: Em ${dias} dias, você bebeu água por ${diasComAgua} dias, totalizando ${total} pontos.`;
  resultado.classList.remove("oculto");
}

const calcularBtn = document.getElementById("calcular-btn");
calcularBtn.addEventListener("click", calcular);
