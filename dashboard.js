// ==============================
// DASHBOARD
// ==============================

const usuarioId =
    Number(localStorage.getItem("usuario_id"));

const todasDespesas =
    JSON.parse(localStorage.getItem("despesas")) || [];


// ==============================
// PEGAR DESPESAS DO USUÁRIO
// ==============================

const despesas =
    todasDespesas.filter(function(despesa) {

        return despesa.usuario_id === usuarioId;

    });


// ==============================
// TOTAL DE DESPESAS
// ==============================

let total = 0;

despesas.forEach(function(despesa) {

    total += Number(despesa.total) || 0;

});


// ==============================
// QUANTIDADE DE DESPESAS
// ==============================

const quantidade =
    despesas.length;


// ==============================
// MÉDIA POR PESSOA
// ==============================

let mediaPorPessoa = 0;

if (quantidade > 0) {

    let soma = 0;

    despesas.forEach(function(despesa) {

        soma += Number(despesa.valor_por_pessoa) || 0;

    });

    mediaPorPessoa = soma / quantidade;

}


// ==============================
// MOSTRAR NOS CARDS
// ==============================

document.querySelector("#totalDespesas").textContent =
    "R$ " + total.toFixed(2);

document.querySelector("#quantidadeDespesas").textContent =
    quantidade;

document.querySelector("#mediaPorPessoa").textContent =
    "R$ " + mediaPorPessoa.toFixed(2);


// ==============================
// GRÁFICO - DESPESAS POR CATEGORIA
// ==============================

const valoresCategorias = {

    "Aluguel": 0,
    "Gás": 0,
    "Energia": 0,
    "Água": 0

};


despesas.forEach(function(despesa) {

    valoresCategorias["Aluguel"] +=
        Number(despesa.aluguel) || 0;

    valoresCategorias["Gás"] +=
        Number(despesa.gas) || 0;

    valoresCategorias["Energia"] +=
        Number(despesa.energia) || 0;

    valoresCategorias["Água"] +=
        Number(despesa.agua) || 0;

});


// ==============================
// CRIAR GRÁFICO
// ==============================

const ctxCategorias =
    document.querySelector("#graficoCategorias");

new Chart(ctxCategorias, {

    type: "doughnut",

    data: {

        labels: Object.keys(valoresCategorias),

        datasets: [{

            data: Object.values(valoresCategorias)

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                position: "bottom"

            }

        }

    }

});


// ==============================
// GRÁFICO - EVOLUÇÃO DAS DESPESAS
// ==============================

const despesasPorData = {};

despesas.forEach(function(despesa) {

    if (!despesasPorData[despesa.data]) {

        despesasPorData[despesa.data] = 0;

    }

    despesasPorData[despesa.data] +=
        Number(despesa.total) || 0;

});


// Organizar as datas

const datas = Object.keys(despesasPorData).sort();

const valores = datas.map(function(data) {

    return despesasPorData[data];

});


// ==============================
// CRIAR GRÁFICO
// ==============================

const ctxMensal =
    document.querySelector("#graficoMensal");

new Chart(ctxMensal, {

    type: "line",

    data: {

        labels: datas,

        datasets: [{

            label: "Total de despesas",

            data: valores,

            tension: 0.3

        }]

    },

    options: {

        responsive: true,

        scales: {

            y: {

                beginAtZero: true

            }

        }

    }

});

document.querySelector("#voltarSistema").addEventListener("click", function() {

    window.location.href = "sistema.html";

});