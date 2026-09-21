// ==============================
// SISTEMA DE DESPESAS - CORRIGIDO CELULAR
// ==============================

// LIMPEZA AUTOMÁTICA PARA CELULAR - remove despesas sem usuario_id
(function limparFantasmas(){
  let todas = JSON.parse(localStorage.getItem("despesas")) || [];
  let limpas = todas.filter(d => d.usuario_id);
  if(todas.length!== limpas.length){
    localStorage.setItem("despesas", JSON.stringify(limpas));
    console.log(`Limpas ${todas.length - limpas.length} despesas fantasmas`);
  }
})();

const formulario = document.querySelector("#despesas form");
const tabelaHistorico = document.querySelector("#historico tbody");
const dataFiltro = document.querySelector("#dataFiltro");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnLimparFiltro = document.querySelector("#btnLimparFiltro");

function mostrarAviso(texto, titulo = "Aviso") {
  const modal = document.getElementById("modalAviso");
  if(!modal) { alert(titulo + ": " + texto); return; }
  document.getElementById("modalTitulo").textContent = titulo;
  document.getElementById("modalTexto").textContent = texto;
  document.getElementById("modalBtnCancelar").style.display = "none";
  modal.style.display = "flex";
  document.getElementById("modalBtnOk").onclick = () => {
    modal.style.display = "none";
  };
}

function mostrarConfirmacao(texto, titulo = "Confirmação") {
  return new Promise((resolve) => {
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalTexto").textContent = texto;
    document.getElementById("modalBtnCancelar").style.display = "block";
    document.getElementById("modalAviso").style.display = "flex";
    document.getElementById("modalBtnOk").onclick = () => {
      document.getElementById("modalAviso").style.display = "none";
      resolve(true);
    };
    document.getElementById("modalBtnCancelar").onclick = () => {
      document.getElementById("modalAviso").style.display = "none";
      resolve(false);
    };
  });
}

function mostrarToast(texto) {
  const toast = document.getElementById("toast");
  if(!toast){ console.log(texto); return; }
  toast.textContent = texto;
  toast.classList.add("mostrar");
  setTimeout(() => toast.classList.remove("mostrar"), 3000);
}

async function carregarHistorico() {
    if (!tabelaHistorico) return;
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const todasDespesas = JSON.parse(localStorage.getItem("despesas")) || [];
    const despesasSalvas = todasDespesas.filter(d => d.usuario_id === usuarioId);
    const totalGeral = despesasSalvas.reduce((total, d) => total + d.total, 0);
    const quantidadeRegistros = despesasSalvas.length;
    const mediaDespesas = quantidadeRegistros > 0? totalGeral / quantidadeRegistros : 0;
    const elTotal = document.querySelector("#totalGeral");
    if(elTotal) elTotal.textContent = `R$ ${totalGeral.toFixed(2)}`;
    const elQtd = document.querySelector("#quantidadeRegistros");
    if(elQtd) elQtd.textContent = quantidadeRegistros;
    const elMedia = document.querySelector("#mediaDespesas");
    if(elMedia) elMedia.textContent = `R$ ${mediaDespesas.toFixed(2)}`;
    tabelaHistorico.innerHTML = "";
    despesasSalvas.forEach(function(despesa) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${despesa.data}</td>
            <td>${despesa.pessoas}</td>
            <td>R$ ${despesa.aluguel.toFixed(2)}</td>
            <td>R$ ${despesa.gas.toFixed(2)}</td>
            <td>R$ ${despesa.energia.toFixed(2)}</td>
            <td>R$ ${despesa.agua.toFixed(2)}</td>
            <td>R$ ${despesa.total.toFixed(2)}</td>
            <td>R$ ${despesa.valor_por_pessoa.toFixed(2)}</td>
            <td>
                <button onclick="editarDespesa(${despesa.id})">Editar</button>
                <button onclick="excluirDespesa(${despesa.id})">Excluir</button>
            </td>`;
        tabelaHistorico.appendChild(linha);
    });
}

async function filtrarPorData() {
    const dataSelecionada = dataFiltro?.value;
    if (!dataSelecionada) {
        mostrarAviso("Selecione uma data.");
        return;
    }
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const todasDespesas = JSON.parse(localStorage.getItem("despesas")) || [];
    const despesasSalvas = todasDespesas.filter(d => d.usuario_id === usuarioId);
    const despesasFiltradas = despesasSalvas.filter(d => d.data === dataSelecionada);
    tabelaHistorico.innerHTML = "";
    despesasFiltradas.forEach(function(despesa) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${despesa.data}</td>
            <td>${despesa.pessoas}</td>
            <td>R$ ${despesa.aluguel.toFixed(2)}</td>
            <td>R$ ${despesa.gas.toFixed(2)}</td>
            <td>R$ ${despesa.energia.toFixed(2)}</td>
            <td>R$ ${despesa.agua.toFixed(2)}</td>
            <td>R$ ${despesa.total.toFixed(2)}</td>
            <td>R$ ${despesa.valor_por_pessoa.toFixed(2)}</td>
            <td>
                <button onclick="editarDespesa(${despesa.id})">Editar</button>
                <button onclick="excluirDespesa(${despesa.id})">Excluir</button>
            </td>`;
        tabelaHistorico.appendChild(linha);
    });
    if (despesasFiltradas.length === 0) {
        tabelaHistorico.innerHTML = `<tr><td colspan="9">Nenhuma despesa encontrada nessa data.</td></tr>`;
    }
}

btnFiltrar?.addEventListener("click", () => filtrarPorData());
btnLimparFiltro?.addEventListener("click", () => {
    if(dataFiltro) dataFiltro.value = "";
    carregarHistorico();
});

if (formulario) {
    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();
        const data = document.querySelector("#data").value;
        const pessoas = Number(document.querySelector("#pessoas").value);
        const aluguel = Number(document.querySelector("#aluguel").value);
        const gas = Number(document.querySelector("#gas").value);
        const energia = Number(document.querySelector("#energia").value);
        const agua = Number(document.querySelector("#agua").value);
        if (data === "") { mostrarAviso("Informe a data."); return; }
        if (pessoas <= 0) { mostrarAviso("A quantidade de pessoas deve ser maior que zero."); return; }
        const total = aluguel + gas + energia + agua;
        const valorPorPessoa = total / pessoas;
        document.querySelector("#resultado").innerHTML = `
            <h2>Resultado</h2>
            <p>Total: <strong>R$ ${total.toFixed(2)}</strong></p>
            <p>Por pessoa: <strong>R$ ${valorPorPessoa.toFixed(2)}</strong></p>`;
        const usuarioId = Number(localStorage.getItem("usuario_id"));
        const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
        const novaDespesa = { id: Date.now(), usuario_id: usuarioId, data, pessoas, aluguel, gas, energia, agua, total, valor_por_pessoa: valorPorPessoa };
        despesas.push(novaDespesa);
        localStorage.setItem("despesas", JSON.stringify(despesas));
        carregarHistorico();
    });
}

if (tabelaHistorico) carregarHistorico();

function editarDespesa(id) {
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
    const despesa = despesas.find(d => d.id === id && d.usuario_id === usuarioId);
    if (!despesa) { mostrarAviso("Despesa não encontrada."); return; }
    const novaData = prompt("Data:", despesa.data);
    if (novaData === null) return;
    const novasPessoas = Number(prompt("Quantidade de pessoas:", despesa.pessoas));
    if (novasPessoas <= 0) { mostrarAviso("A quantidade de pessoas deve ser maior que zero."); return; }
    const novoAluguel = Number(prompt("Aluguel:", despesa.aluguel));
    const novoGas = Number(prompt("Gás:", despesa.gas));
    const novaEnergia = Number(prompt("Energia:", despesa.energia));
    const novaAgua = Number(prompt("Água:", despesa.agua));
    const novoTotal = novoAluguel + novoGas + novaEnergia + novaAgua;
    despesa.data = novaData; despesa.pessoas = novasPessoas; despesa.aluguel = novoAluguel; despesa.gas = novoGas; despesa.energia = novaEnergia; despesa.agua = novaAgua; despesa.total = novoTotal; despesa.valor_por_pessoa = novoTotal / novasPessoas;
    localStorage.setItem("despesas", JSON.stringify(despesas));
    mostrarAviso("Despesa editada com sucesso!");
    location.reload();
}

async function excluirDespesa(id) {
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
    const despesa = despesas.find(d => d.id === id && d.usuario_id === usuarioId);
    if (!despesa) { mostrarAviso("Despesa não encontrada.", "Erro"); return; }
    const confirmar = await mostrarConfirmacao(`Deseja excluir a despesa do dia ${despesa.data}?`, "Excluir despesa?");
    if (!confirmar) return;
    const novasDespesas = despesas.filter(d => d.id!== id);
    localStorage.setItem("despesas", JSON.stringify(novasDespesas));
    mostrarToast("Despesa excluída! 🗑️");
    setTimeout(() => location.reload(), 800);
}

document.querySelector("#sistema") || document.querySelector("#historicoPagina")? (()=>{ if(localStorage.getItem("logado")!== "true") window.location.href = "index.html"; })() : null;

document.querySelector("#formCadastro")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const usuario = document.querySelector("#novoUsuario").value;
    const senha = document.querySelector("#novaSenha").value;
    const confirmarSenha = document.querySelector("#confirmarSenha").value;
    if (senha!== confirmarSenha) { mostrarAviso("As senhas não são iguais.", "Atenção"); return; }
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.find(u => u.usuario === usuario)) { mostrarAviso("Esse nome de usuário já existe. Tente outro nome.", "Usuário já cadastrado"); return; }
    usuarios.push({ id: Date.now(), usuario, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarToast("Cadastro realizado! ✅");
    setTimeout(() => window.location.href = "index.html", 1000);
});

document.querySelector("#formLogin")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const usuario = document.querySelector("#usuario").value;
    const senha = document.querySelector("#senha").value;
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if (!usuarioEncontrado) { mostrarAviso("Usuário ou senha incorretos.", "Erro"); return; }
    localStorage.setItem("logado", "true");
    localStorage.setItem("usuario_id", usuarioEncontrado.id);
    mostrarToast("Login realizado! ✅");
    setTimeout(() => window.location.href = "sistema.html", 800);
});

document.querySelector("#logout")?.addEventListener("click", () => {
    localStorage.removeItem("logado"); localStorage.removeItem("usuario_id");
    window.location.href = "index.html";
});
document.querySelector("#btnSairConfiguracoes")?.addEventListener("click", () => {
    localStorage.removeItem("logado"); localStorage.removeItem("usuario_id");
    window.location.href = "index.html";
});
document.querySelector("#voltarSistema")?.addEventListener("click", () => window.location.href = "sistema.html");
document.querySelector("#btnDashboard")?.addEventListener("click", () => window.location.href = "dashboard.html");
document.querySelector("#btnTema")?.addEventListener("click", function() {
    document.body.classList.toggle("tema-escuro");
    if (document.body.classList.contains("tema-escuro")) {
        localStorage.setItem("tema", "escuro"); this.textContent = "☀️ Tema claro";
    } else {
        localStorage.setItem("tema", "claro"); this.textContent = "🌙 Tema escuro";
    }
});
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "escuro") document.body.classList.add("tema-escuro");

const nomeUsuario = document.querySelector("#nomeUsuario");
if (nomeUsuario) {
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioLogado = usuarios.find(u => u.id === usuarioId);
    if (usuarioLogado) {
        nomeUsuario.textContent = usuarioLogado.usuario;
        const elConf = document.querySelector("#usuarioConfiguracao");
        if(elConf) elConf.textContent = usuarioLogado.usuario;
    }
}

document.querySelector("#btnConfiguracoes")?.addEventListener("click", () => {
    const menu = document.querySelector("#menuConfiguracoes");
    if(menu) menu.style.display = "flex";
});
document.querySelector("#btnFecharConfiguracoes")?.addEventListener("click", () => {
    const menu = document.querySelector("#menuConfiguracoes");
    if(menu) menu.style.display = "none";
});
document.querySelector("#btnExcluirHistorico")?.addEventListener("click", async function() {
    const confirmar = await mostrarConfirmacao("Tem certeza que deseja excluir todo o histórico?", "Excluir tudo?");
    if (!confirmar) return;
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const todas = JSON.parse(localStorage.getItem("despesas")) || [];
    const minhas = todas.filter(d => d.usuario_id!== usuarioId);
    // só apaga as minhas, não apaga de outros
    if(todas.length === minhas.length) {
       // se não tinha usuario_id, limpa tudo mesmo
       localStorage.removeItem("despesas");
    } else {
       localStorage.setItem("despesas", JSON.stringify(minhas));
       // na verdade queremos manter as minhas? corrigindo:
       // O botão excluir historico deve apagar SÓ do usuario logado
       const todas2 = JSON.parse(localStorage.getItem("despesas")) || [];
       // refaz certo:
    }
    // correção final simples:
    const todasFinal = JSON.parse(localStorage.getItem("despesas")) || [];
    const manterOutros = todasFinal.filter(d => d.usuario_id!== usuarioId);
    localStorage.setItem("despesas", JSON.stringify(manterOutros));
    mostrarToast("Histórico excluído! 🗑️");
    setTimeout(() => location.reload(), 800);
});

document.querySelector("#btnExportarDados")?.addEventListener("click", function() {
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const todasDespesas = JSON.parse(localStorage.getItem("despesas")) || [];
    const minhasDespesas = todasDespesas.filter(d => d.usuario_id === usuarioId);
    if (minhasDespesas.length === 0) { mostrarAviso("Não há despesas para exportar.", "Aviso"); return; }
    const dados = JSON.stringify(minhasDespesas, null, 2);
    const arquivo = new Blob([dados], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url; link.download = "despesas-backup.json"; link.click();
    URL.revokeObjectURL(url);
    mostrarToast("Dados exportados! 📁");
});

const btnImportarDados = document.querySelector("#btnImportarDados");
const arquivoImportacao = document.querySelector("#arquivoImportacao");
if (btnImportarDados && arquivoImportacao) {
    btnImportarDados.addEventListener("click", () => arquivoImportacao.click());
    arquivoImportacao.addEventListener("change", function() {
        const arquivo = arquivoImportacao.files[0]; if (!arquivo) return;
        const leitor = new FileReader();
        leitor.onload = async function(evento) {
            try {
                let texto = evento.target.result.replace(/^\uFEFF/, '').trim();
                const despesasImportadas = JSON.parse(texto);
                const usuarioIdAtual = Number(localStorage.getItem("usuario_id"));
                if (!usuarioIdAtual) { mostrarAviso("Você precisa estar logado.", "Erro"); return; }
                const confirmar = await mostrarConfirmacao(`Encontradas ${despesasImportadas.length} despesas. Importar?`, "Importar dados?");
                if (!confirmar) { arquivoImportacao.value = ""; return; }
                const despesasCorrigidas = despesasImportadas.map(d => ({...d, id: d.id || Date.now() + Math.random(), usuario_id: usuarioIdAtual }));
                const despesasAtuais = JSON.parse(localStorage.getItem("despesas")) || [];
                const todas = [...despesasAtuais,...despesasCorrigidas];
                const unicas = Array.from(new Map(todas.map(d => [d.id, d])).values());
                localStorage.setItem("despesas", JSON.stringify(unicas));
                mostrarToast(`Importado! ${despesasCorrigidas.length} despesas ✅`);
                setTimeout(() => location.reload(), 1000);
            } catch (erro) {
                mostrarAviso("Erro ao importar: " + erro.message, "Erro");
                arquivoImportacao.value = "";
            }
        };
        leitor.readAsText(arquivo, 'UTF-8');
    });
}

document.querySelector("#btnBaixarPDF")?.addEventListener("click", function() {
    const usuarioId = Number(localStorage.getItem("usuario_id"));
    const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
    const minhasDespesas = despesas.filter(d => d.usuario_id === usuarioId);
    if (minhasDespesas.length === 0) { mostrarAviso("Não existem despesas para gerar o PDF."); return; }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.setFontSize(20); pdf.setFont("helvetica", "bold"); pdf.text("Divisão de Despesas da Casa", 20, 20);
    pdf.setFontSize(14); pdf.setFont("helvetica", "normal"); pdf.text("Histórico de Despesas", 20, 29);
    pdf.setFontSize(10); pdf.text(`Total: ${minhasDespesas.length}`, 20, 38); pdf.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 45);
    pdf.setDrawColor(150); pdf.line(20, 52, 190, 52);
    let y = 58;
    pdf.autoTable({
        startY: y,
        head: [["Data","Pessoas","Aluguel","Gás","Energia","Água","Total","Por pessoa"]],
        body: minhasDespesas.map(d => [d.data.split("-").reverse().join("/"), d.pessoas, `R$ ${Number(d.aluguel).toFixed(2)}`, `R$ ${Number(d.gas).toFixed(2)}`, `R$ ${Number(d.energia).toFixed(2)}`, `R$ ${Number(d.agua).toFixed(2)}`, `R$ ${Number(d.total).toFixed(2)}`, `R$ ${Number(d.valor_por_pessoa).toFixed(2)}`]),
        styles: { fontSize: 8, cellPadding: 4, halign: "center" }, margin: { left: 10, right: 10 }
    });
    y = pdf.lastAutoTable.finalY + 15;
    const totalGeral = minhasDespesas.reduce((total, d) => total + Number(d.total), 0);
    if (y > 250) { pdf.addPage(); y = 20; }
    pdf.setFontSize(16); pdf.text("Resumo das despesas", 20, y); y += 5;
    pdf.autoTable({ startY: y, body: [["Total geral", `R$ ${totalGeral.toFixed(2)}`]], styles: { fontSize: 11, cellPadding: 5 }, margin: { left: 20, right: 20 } });
    const totalPaginas = pdf.internal.getNumberOfPages();
    for (let p = 1; p <= totalPaginas; p++) { pdf.setPage(p); pdf.setFontSize(9); pdf.text(`Página ${p} de ${totalPaginas}`, 105, 290, { align: "center" }); }
    pdf.save("historico-despesas.pdf");
});