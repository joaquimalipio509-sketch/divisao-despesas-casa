// ==============================
// SISTEMA DE DESPESAS
// ==============================

const formulario = document.querySelector("#despesas form");
const tabelaHistorico = document.querySelector("#historico tbody");
const dataFiltro = document.querySelector("#dataFiltro");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnLimparFiltro = document.querySelector("#btnLimparFiltro");

// ==============================
// CARREGAR HISTÓRICO
// ==============================

async function carregarHistorico() {

    if (!tabelaHistorico) {
        return;
    }

   const usuarioId =
    Number(localStorage.getItem("usuario_id"));

const todasDespesas =
    JSON.parse(localStorage.getItem("despesas")) || [];

const despesasSalvas =
    todasDespesas.filter(function(despesa) {
        return despesa.usuario_id === usuarioId;
    });

// ==============================
// FILTRAR POR DATA
// ==============================

async function filtrarPorData() {

    console.log("FUNÇÃO FILTRAR FOI CHAMADA");

    const dataSelecionada = dataFiltro.value;
    console.log("Data selecionada:", dataSelecionada);

    if (dataSelecionada === "") {
        alert("Selecione uma data.");
        return;
    }

    const usuarioId =
    Number(localStorage.getItem("usuario_id"));

const todasDespesas =
    JSON.parse(localStorage.getItem("despesas")) || [];

const despesasSalvas =
    todasDespesas.filter(function(despesa) {
        return despesa.usuario_id === usuarioId;
    });

    const despesasFiltradas =
        despesasSalvas.filter(function(despesa) {
            return despesa.data === dataSelecionada;
        });

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
                <button onclick="editarDespesa(${despesa.id})">
                    Editar
                </button>

                <button onclick="excluirDespesa(${despesa.id})">
                    Excluir
                </button>
            </td>
        `;

        tabelaHistorico.appendChild(linha);
    });

    if (despesasFiltradas.length === 0) {
        tabelaHistorico.innerHTML = `
            <tr>
                <td colspan="9">
                    Nenhuma despesa encontrada nessa data.
                </td>
            </tr>
        `;
    }
}

if (btnFiltrar) {

    btnFiltrar.addEventListener("click", function() {
        filtrarPorData();
    });

}

if (btnLimparFiltro) {

    btnLimparFiltro.addEventListener("click", function() {

        dataFiltro.value = "";

        carregarHistorico();

    });

}


    // ==============================
    // RESUMO DO HISTÓRICO
    // ==============================

    const totalGeral = despesasSalvas.reduce(function(total, despesa) {
        return total + despesa.total;
    }, 0);

    const quantidadeRegistros = despesasSalvas.length;

    const mediaDespesas =
        quantidadeRegistros > 0
            ? totalGeral / quantidadeRegistros
            : 0;


    document.querySelector("#totalGeral").textContent =
        `R$ ${totalGeral.toFixed(2)}`;

    document.querySelector("#quantidadeRegistros").textContent =
        quantidadeRegistros;

    document.querySelector("#mediaDespesas").textContent =
        `R$ ${mediaDespesas.toFixed(2)}`;


    // ==============================
    // TABELA
    // ==============================

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
                <button onclick="editarDespesa(${despesa.id})">
                    Editar
                </button>

                <button onclick="excluirDespesa(${despesa.id})">
                    Excluir
                </button>
            </td>
        `;

        tabelaHistorico.appendChild(linha);
    });
}

if (formulario) {

    // ==============================
    // CALCULAR E SALVAR DESPESA
    // ==============================

    formulario.addEventListener("submit", async function(event) {

        event.preventDefault();

        const data = document.querySelector("#data").value;

        const pessoas =
            Number(document.querySelector("#pessoas").value);

        const aluguel =
            Number(document.querySelector("#aluguel").value);

        const gas =
            Number(document.querySelector("#gas").value);

        const energia =
            Number(document.querySelector("#energia").value);

        const agua =
            Number(document.querySelector("#agua").value);


        // Validação

        if (data === "") {
            alert("Informe a data.");
            return;
        }

        if (pessoas <= 0) {
            alert("A quantidade de pessoas deve ser maior que zero.");
            return;
        }


        // Calculando o total

        const total =
            aluguel +
            gas +
            energia +
            agua;


        // Calculando valor por pessoa

        const valorPorPessoa =
            total / pessoas;


        // Mostrando resultado

        document.querySelector("#resultado").innerHTML = `
            <h2>Resultado</h2>

            <p>
                Total das despesas:
                <strong>R$ ${total.toFixed(2)}</strong>
            </p>

            <p>
                Valor por pessoa:
                <strong>R$ ${valorPorPessoa.toFixed(2)}</strong>
            </p>
        `;


      // ==============================
// SALVAR DESPESA LOCALMENTE
// ==============================

const usuarioId =
    Number(localStorage.getItem("usuario_id"));

const despesas =
    JSON.parse(localStorage.getItem("despesas")) || [];

const novaDespesa = {
    id: Date.now(),
    usuario_id: usuarioId,
    data: data,
    pessoas: pessoas,
    aluguel: aluguel,
    gas: gas,
    energia: energia,
    agua: agua,
    total: total,
    valor_por_pessoa: valorPorPessoa
};

despesas.push(novaDespesa);

localStorage.setItem(
    "despesas",
    JSON.stringify(despesas)
);

    });

}

if (tabelaHistorico) {
    carregarHistorico();
}

// ==============================
// EDITAR DESPESA
// ==============================

function editarDespesa(id) {

    const usuarioId =
        Number(localStorage.getItem("usuario_id"));

    const despesas =
        JSON.parse(localStorage.getItem("despesas")) || [];

    const despesa = despesas.find(function(despesa) {
        return despesa.id === id &&
               despesa.usuario_id === usuarioId;
    });

    if (!despesa) {
        alert("Despesa não encontrada.");
        return;
    }

    const novaData =
        prompt("Data:", despesa.data);

    if (novaData === null) {
        return;
    }

    const novasPessoas =
        Number(prompt("Quantidade de pessoas:", despesa.pessoas));

    if (novasPessoas <= 0) {
        alert("A quantidade de pessoas deve ser maior que zero.");
        return;
    }

    const novoAluguel =
        Number(prompt("Aluguel:", despesa.aluguel));

    const novoGas =
        Number(prompt("Gás:", despesa.gas));

    const novaEnergia =
        Number(prompt("Energia:", despesa.energia));

    const novaAgua =
        Number(prompt("Água:", despesa.agua));

    const novoTotal =
        novoAluguel +
        novoGas +
        novaEnergia +
        novaAgua;

    const novoValorPorPessoa =
        novoTotal / novasPessoas;

    despesa.data = novaData;
    despesa.pessoas = novasPessoas;
    despesa.aluguel = novoAluguel;
    despesa.gas = novoGas;
    despesa.energia = novaEnergia;
    despesa.agua = novaAgua;
    despesa.total = novoTotal;
    despesa.valor_por_pessoa = novoValorPorPessoa;

    localStorage.setItem(
        "despesas",
        JSON.stringify(despesas)
    );

    alert("Despesa editada com sucesso!");

    location.reload();
}

// ==============================
// EXCLUIR DESPESA
// ==============================

function excluirDespesa(id) {

    const usuarioId =
        Number(localStorage.getItem("usuario_id"));

    // Pega todas as despesas salvas
    const despesas =
        JSON.parse(localStorage.getItem("despesas")) || [];

    // Procura a despesa do usuário
    const despesa = despesas.find(function(despesa) {
        return despesa.id === id &&
               despesa.usuario_id === usuarioId;
    });

    if (!despesa) {
        alert("Despesa não encontrada.");
        return;
    }

    const confirmar = confirm(
        `Deseja excluir a despesa do dia ${despesa.data}?\n\n` +
        `Total: R$ ${despesa.total.toFixed(2)}\n` +
        `Valor por pessoa: R$ ${despesa.valor_por_pessoa.toFixed(2)}`
    );

    if (!confirmar) {
        return;
    }

    // Remove a despesa
    const novasDespesas = despesas.filter(function(despesa) {
        return despesa.id !== id;
    });

    // Salva novamente no localStorage
    localStorage.setItem(
        "despesas",
        JSON.stringify(novasDespesas)
    );

    alert("Despesa excluída com sucesso!");

    location.reload();
}

// ====================
// PROTEGER PÁGINAS DO SISTEMA
// ====================

const paginaProtegida =
    document.querySelector("#sistema") ||
    document.querySelector("#historicoPagina");

if (paginaProtegida) {

    const logado = localStorage.getItem("logado");

    if (logado !== "true") {
        window.location.href = "index.html";
    }
}


// ====================
// CADASTRO
// ====================

const formCadastro =
    document.querySelector("#formCadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", function(event) {

        event.preventDefault();

        const usuario =
            document.querySelector("#novoUsuario").value;

        const senha =
            document.querySelector("#novaSenha").value;

        const confirmarSenha =
            document.querySelector("#confirmarSenha").value;

        if (senha !== confirmarSenha) {
            alert("As senhas não são iguais.");
            return;
        }

        // Pega os usuários já cadastrados
        const usuarios =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verifica se o usuário já existe
        const usuarioExiste =
            usuarios.find(function(usuarioSalvo) {
                return usuarioSalvo.usuario === usuario;
            });

        if (usuarioExiste) {
            alert("Esse usuário já está cadastrado.");
            return;
        }

        // Cria o novo usuário
        const novoUsuario = {
            id: Date.now(),
            usuario: usuario,
            senha: senha
        };

        // Adiciona o usuário à lista
        usuarios.push(novoUsuario);

        // Salva no dispositivo
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

        alert("Cadastro realizado com sucesso!");

        window.location.href = "index.html";
    });
}


// ====================
// LOGIN
// ====================

const formLogin =
    document.querySelector("#formLogin");

if (formLogin) {

    formLogin.addEventListener("submit", function(event) {

        event.preventDefault();

        const usuario =
            document.querySelector("#usuario").value;

        const senha =
            document.querySelector("#senha").value;

        // Pega os usuários cadastrados no dispositivo
        const usuarios =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        // Procura o usuário
        const usuarioEncontrado =
            usuarios.find(function(usuarioSalvo) {
                return usuarioSalvo.usuario === usuario &&
                       usuarioSalvo.senha === senha;
            });

        // Verifica se encontrou
        if (!usuarioEncontrado) {
            alert("Usuário ou senha incorretos.");
            return;
        }

        // Salva quem está logado
        localStorage.setItem("logado", "true");
        localStorage.setItem(
            "usuario_id",
            usuarioEncontrado.id
        );

        window.location.href = "sistema.html";
    });
}

// ====================
// LOGOUT
// ====================

const botaoLogout = document.querySelector("#logout");

if (botaoLogout) {

    botaoLogout.addEventListener("click", function() {

        localStorage.removeItem("logado");
        localStorage.removeItem("usuario_id");

        window.location.href = "index.html";

    });

}

// ==============================
// SAIR PELO MENU DE CONFIGURAÇÕES
// ==============================

const btnSairConfiguracoes =
    document.querySelector("#btnSairConfiguracoes");

if (btnSairConfiguracoes) {
    btnSairConfiguracoes.addEventListener("click", function() {

        localStorage.removeItem("logado");
        localStorage.removeItem("usuario_id");

        window.location.href = "index.html";
    });
}

// ====================
// VOLTAR PARA O SISTEMA
// ====================

const voltarSistema = document.querySelector("#voltarSistema");

if (voltarSistema) {

    voltarSistema.addEventListener("click", function() {

        window.location.href = "sistema.html";

    });

}

// ====================
// TEMA CLARO / ESCURO
// ====================

const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "escuro") {
    document.body.classList.add("tema-escuro");
}

// ====================
// ALTERNAR TEMA
// ====================

const btnTema = document.querySelector("#btnTema");

if (btnTema) {
    btnTema.addEventListener("click", function() {

        document.body.classList.toggle("tema-escuro");

        if (document.body.classList.contains("tema-escuro")) {
            localStorage.setItem("tema", "escuro");
            btnTema.textContent = "☀️ Tema claro";
        } else {
            localStorage.setItem("tema", "claro");
            btnTema.textContent = "🌙 Tema escuro";
        }

    });
}

// ====================
// MOSTRAR NOME DO USUÁRIO
// ====================

const nomeUsuario = document.querySelector("#nomeUsuario");

if (nomeUsuario) {
    const usuarioId = Number(localStorage.getItem("usuario_id"));

    const usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioLogado = usuarios.find(function(usuario) {
        return usuario.id === usuarioId;
    });

    if (usuarioLogado) {
    nomeUsuario.textContent = usuarioLogado.usuario;

    const usuarioConfiguracao =
        document.querySelector("#usuarioConfiguracao");

    if (usuarioConfiguracao) {
        usuarioConfiguracao.textContent =
            usuarioLogado.usuario;
    }
}
}

// ====================
// MENU DE CONFIGURAÇÕES
// ====================

const btnConfiguracoes =
    document.querySelector("#btnConfiguracoes");

const menuConfiguracoes =
    document.querySelector("#menuConfiguracoes");

const btnFecharConfiguracoes =
    document.querySelector("#btnFecharConfiguracoes");

if (btnConfiguracoes && menuConfiguracoes) {

    btnConfiguracoes.addEventListener("click", function() {
        menuConfiguracoes.style.display = "flex";
    });
}

if (btnFecharConfiguracoes && menuConfiguracoes) {

    btnFecharConfiguracoes.addEventListener("click", function() {
        menuConfiguracoes.style.display = "none";
    });
}

// ==============================
// EXCLUIR HISTÓRICO
// ==============================

const btnExcluirHistorico =
    document.querySelector("#btnExcluirHistorico");

if (btnExcluirHistorico) {
    btnExcluirHistorico.addEventListener("click", function() {

        const confirmar = confirm(
            "Tem certeza que deseja excluir todo o histórico de despesas?"
        );

        if (!confirmar) {
            return;
        }

        localStorage.removeItem("despesas");

        alert("Histórico excluído com sucesso!");

        location.reload();
    });
}

// ==============================
// EXPORTAR DADOS
// ==============================

const btnExportarDados =
    document.querySelector("#btnExportarDados");

if (btnExportarDados) {
    btnExportarDados.addEventListener("click", function() {

        const despesas =
            JSON.parse(localStorage.getItem("despesas")) || [];

        const dados = JSON.stringify(despesas, null, 2);

        const arquivo = new Blob(
            [dados],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(arquivo);

        const link = document.createElement("a");

        link.href = url;
        link.download = "despesas-backup.json";

        link.click();

        URL.revokeObjectURL(url);

        alert("Dados exportados com sucesso!");
    });
}

// ==============================
// IMPORTAR DADOS
// ==============================

const btnImportarDados =
    document.querySelector("#btnImportarDados");

const arquivoImportacao =
    document.querySelector("#arquivoImportacao");

if (btnImportarDados && arquivoImportacao) {

    btnImportarDados.addEventListener("click", function() {
        arquivoImportacao.click();
    });

    arquivoImportacao.addEventListener("change", function() {

        const arquivo = arquivoImportacao.files[0];

        if (!arquivo) {
            return;
        }

        const leitor = new FileReader();

        leitor.onload = function(evento) {

            try {

                const despesasImportadas =
                    JSON.parse(evento.target.result);

                if (!Array.isArray(despesasImportadas)) {
                    throw new Error("Formato inválido");
                }

                const confirmar = confirm(
                    "Importar este arquivo substituirá o histórico atual de despesas. Deseja continuar?"
                );

                if (!confirmar) {
                    arquivoImportacao.value = "";
                    return;
                }

                localStorage.setItem(
                    "despesas",
                    JSON.stringify(despesasImportadas)
                );

                alert("Dados importados com sucesso!");

                location.reload();

            } catch (erro) {

                alert(
                    "Não foi possível importar o arquivo. Verifique se ele é um backup válido."
                );
            }
        };

        leitor.readAsText(arquivo);
    });
}

// ==============================
// BAIXAR HISTÓRICO EM PDF
// ==============================

const btnBaixarPDF =
    document.querySelector("#btnBaixarPDF");

if (btnBaixarPDF) {

    btnBaixarPDF.addEventListener("click", function() {

        const usuarioId =
            Number(localStorage.getItem("usuario_id"));

        const despesas =
            JSON.parse(localStorage.getItem("despesas")) || [];

        const minhasDespesas =
            despesas.filter(function(despesa) {
                return despesa.usuario_id === usuarioId;
            });

        if (minhasDespesas.length === 0) {
            alert("Não existem despesas para gerar o PDF.");
            return;
        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();

        // CABEÇALHO PROFISSIONAL

pdf.setFontSize(20);
pdf.setFont("helvetica", "bold");
pdf.text("Divisão de Despesas da Casa", 20, 20);

pdf.setFontSize(14);
pdf.setFont("helvetica", "normal");
pdf.text("Histórico de Despesas", 20, 29);

pdf.setFontSize(10);
pdf.text(
    `Total de registros: ${minhasDespesas.length}`,
    20,
    38
);

pdf.text(
    `Relatório gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
    20,
    45
);

pdf.setDrawColor(150);
pdf.line(20, 52, 190, 52);

let y = 58;

        // TABELA
pdf.autoTable({
    startY: y,
    head: [[
        "Data",
        "Pessoas",
        "Aluguel",
        "Gás",
        "Energia",
        "Água",
        "Total",
        "Por pessoa"
    ]],
    body: minhasDespesas.map(function(despesa) {
        return [
            despesa.data.split("-").reverse().join("/"),
            despesa.pessoas,
            `R$ ${Number(despesa.aluguel).toFixed(2)}`,
            `R$ ${Number(despesa.gas).toFixed(2)}`,
            `R$ ${Number(despesa.energia).toFixed(2)}`,
            `R$ ${Number(despesa.agua).toFixed(2)}`,
            `R$ ${Number(despesa.total).toFixed(2)}`,
            `R$ ${Number(despesa.valor_por_pessoa).toFixed(2)}`
        ];
    }),
    styles: {
    fontSize: 8,
    cellPadding: 4,
    lineWidth: 0.1,
    halign: "center",
    valign: "middle"
    },
    headStyles: {
    fontSize: 8,
    fontStyle: "bold",
    halign: "center",
    valign: "middle"
    },
    margin: {
        left: 10,
        right: 10
    }
});

y = pdf.lastAutoTable.finalY + 15;

       

        // RESUMO
        const totalGeral =
            minhasDespesas.reduce(function(total, despesa) {
                return total + Number(despesa.total);
            }, 0);

        const totalPessoas =
            minhasDespesas.reduce(function(total, despesa) {
                return total + Number(despesa.pessoas);
            }, 0);

        const mediaPorPessoa =
            totalPessoas > 0
                ? totalGeral / totalPessoas
                : 0;

        y += 10;

        if (y > 250) {
            pdf.addPage();
            y = 20;
        }

        // RESUMO
pdf.setFontSize(16);
pdf.text("Resumo das despesas", 20, y);

y += 5;

pdf.autoTable({
    startY: y,
    body: [
        ["Total geral", `R$ ${totalGeral.toFixed(2)}`],
        ["Total de pessoas", String(totalPessoas)],
        ["Média por pessoa", `R$ ${mediaPorPessoa.toFixed(2)}`]
    ],
    styles: {
        fontSize: 11,
        cellPadding: 5
    },
    columnStyles: {
        0: {
            fontStyle: "bold"
        },
        1: {
            halign: "right"
        }
    },
    margin: {
        left: 20,
        right: 20
    }
});

        // RODAPÉ COM NÚMERO DA PÁGINA

const totalPaginas = pdf.internal.getNumberOfPages();

for (let pagina = 1; pagina <= totalPaginas; pagina++) {

    pdf.setPage(pagina);

    pdf.setFontSize(9);

    pdf.text(
        `Página ${pagina} de ${totalPaginas}`,
        105,
        290,
        { align: "center" }
    );
}

pdf.save("historico-despesas.pdf");

        
    });
}