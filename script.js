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

// ====================
// VOLTAR PARA O SISTEMA
// ====================

const voltarSistema = document.querySelector("#voltarSistema");

if (voltarSistema) {

    voltarSistema.addEventListener("click", function() {

        window.location.href = "sistema.html";

    });

}