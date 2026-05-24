//===============================================================
// ====================== DASHBOARD =============================
//===============================================================
const numProjetos = arrayProjetos.filter(projeto => projeto.status.toUpperCase() == "ATIVO").length;
const numTarefas = arrayTarefas.length;
const numTarefasConcluidas = arrayTarefas.filter(tarefa => tarefa.status.toUpperCase() == "CONCLUIDA").length;

let pTotalTarefas = 0;
if (numTarefas > 0) {
    pTotalTarefas = ((numTarefasConcluidas / numTarefas) * 100).toFixed(1);
}

const numTarefasAtrasadas = arrayTarefas.filter(tarefas => tarefas.dataConclusao != "" && tarefas.dataConclusao < hoje && tarefas.status.toUpperCase() == "EM_ANDAMENTO").length

const numTarefasEmAndamento = arrayTarefas.filter(tarefa => tarefa.status.toUpperCase() == "EM_ANDAMENTO").length;

const numTarefasPendentes = arrayTarefas.filter(tarefa => tarefa.status.toUpperCase() == "PENDENTE").length;

let pTarefasAtrasadas = 0;
if (numTarefas > 0) {
    const numTemp = numTarefas - numTarefasConcluidas - numTarefasPendentes;
    pTarefasAtrasadas = ((numTarefasAtrasadas / numTemp) * 100).toFixed(1);
}

const projetosRecentes = arrayProjetos.slice(-4).reverse();
setTextHTML("projetosRecentes", "");
projetosRecentes.forEach(projeto => {
    let corpoProjetoRecentes = elem("projetosRecentes").innerHTML;
    montarPreviewItem("projetosRecentes", corpoProjetoRecentes, "work_outline", projeto.titulo, projeto.descricao, projeto.status);
});

const tarefasRecentes = arrayTarefas.slice(-4).reverse();
setTextHTML("tarefasRecentes", "");
tarefasRecentes.forEach(tarefa => {
    let corpoTarefasRecentes = elem("tarefasRecentes").innerHTML;
    montarPreviewItem("tarefasRecentes", corpoTarefasRecentes, "checklist", tarefa.titulo, "Projeto: " + tarefa.projeto, tarefa.status);
});


//===============================================================
// ===================== SETANDO INNERHTML ======================
//===============================================================

setTextHTML("numProjetosAtivos", numProjetos);

setTextHTML("numTarefasTotal", numTarefas);

setTextHTML("numTarefasConcluidas", numTarefasConcluidas);

setTextHTML("pTarefasConcluidas", pTotalTarefas + "% do total");

setTextHTML("numTarefasAtrasadas", numTarefasAtrasadas);

setTextHTML("pTarefasAtrasadas", pTarefasAtrasadas + "% das Em Andamento");

//===============================================================
// ========================== FUNÇÕES ===========================
//===============================================================

function montarPreviewItem(
    idElemento,
    conteudoAnterior,
    icone,
    titulo,
    subtitulo,
    status
) {
    let corIcone = "warning";
    let corStatus = "primary";
    switch (status) {
        case "ATIVO":
            corIcone = "primary";
            corStatus = "info"
            break;
        case "CONCLUIDO":
        case "CONCLUIDA":
            corIcone = "success";
            corStatus = "success"
            icone = "check_circle";
            break;
        case "CANCELADO":
            corIcone = "danger";
            corStatus = "danger"
            break;
        case "PENDENTE":
            corIcone = "warning";
            corStatus = "warning"
            break;
        case "EM_ANDAMENTO":
            corIcone = "primary";
            corStatus = "primary"
            break;

        default:
            corIcone = "secondary";
            corStatus = "secondary"
    }


    let corpo = conteudoAnterior + `
    <div class="row border-bottom w-100"
        style="height: 70px;">
        <div class="col-3 col-md-1 d-flex align-items-center justify-content-center">
            <span class="material-icons text-${corIcone}" style="font-size: clamp(35px, 4vw ,40px);">
                ${icone}
            </span>
        </div>

        <div class="col-7 col-md-9">
            <div class="row py-2 d-flex h-100">
                <div class="col-12 d-flex ">
                    <h5 class="m-0" style="font-size: clamp(12px, 2vw,18px);">
                        <b>${titulo}</b>
                    </h5>
                </div>

                <div class="col-12 d-flex">
                    <h6 class="m-0" style="color:rgb(151, 151, 151); font-size: clamp(8px, 2vw,14px)">
                        ${subtitulo}
                    </h6>
                </div>
            </div>
        </div>

        <div class="col-2 col-md-2 m-0 p-0 d-flex align-items-center justify-content-center h-100">
            <p class="m-0 p-1 btn btn-${corStatus} " style="font-size: 10px;cursor: default;">
                ${status}
            </p>
        </div>
    </div>
    `;

    setTextHTML(idElemento, corpo);
}

//===============================================================
// ======================= GRÁFICO 01 ===========================
//===============================================================

setTextHTML("numTotalTarefasConcluidas", "<b>Total de tarefas concluídas:(" + numTarefasConcluidas + ")</b>");


const ctx = document.getElementById('graficoTarefaPorStatus');

const valores = [numTarefasPendentes, numTarefasEmAndamento];

const total = valores.reduce(
    (acc, valor) => acc + valor,
    0
);

const labels = [
    "Pendentes",
    "Em andamento",
];

const labelsComPorcentagem =
    labels.map((label, index) => {

        const valor = valores[index];

        return `${label.padEnd(15)} ${valor}`;
    });



new Chart(ctx, {

    type: "doughnut",

    data: {

        labels: labelsComPorcentagem,

        datasets: [{
            data: valores,

            backgroundColor: [
                "rgb(255, 193, 7)",
                "#4f75ff",
            ],

            borderWidth: 0
        }]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        cutout: "60%",

        plugins: {

            legend: {

                position: "right",

                title: {

                    display: true,

                    text: `Tarefas totais: ${numTarefas}`,

                    font: {
                        size: 12,
                        weight: "bold"
                    },

                    padding: {
                        bottom: 20
                    }
                },

                labels: {

                    usePointStyle: true,

                    pointStyle: "circle",

                    padding: 20
                }
            }
        }
    }
});



//===============================================================
// ======================= GRÁFICO 02 ===========================
//===============================================================

const totalTarefasConcluidasDoUsuario = arrayTarefas.filter(tarefa => tarefa.status === "CONCLUIDA" && tarefa.responsavel.toLowerCase() == nomeUsuario.toLowerCase()).length;

setTextHTML("numSuasTarefasConcluidas", "<b>Suas tarefas concluídas:(" + totalTarefasConcluidasDoUsuario + ")</b>");


const numPendentes = arrayTarefas.filter(tarefa => tarefa.status === "PENDENTE" && tarefa.responsavel.toLowerCase() == nomeUsuario.toLowerCase()).length;

const numEmAndamento = arrayTarefas.filter(tarefa => tarefa.status === "EM_ANDAMENTO" && tarefa.responsavel.toLowerCase() == nomeUsuario.toLowerCase()).length;


const numAtrasadas = arrayTarefas.filter(tarefas => tarefas.dataConclusao != "" && tarefas.dataConclusao < hoje && tarefas.status.toUpperCase() == "EM_ANDAMENTO" && tarefas.responsavel.toLowerCase() == nomeUsuario.toLowerCase()).length



const ctx2 =
    document.getElementById(
        "graficoStatus"
    );
new Chart(ctx2, {

    type: "bar",
    data: {
        labels: [
            "Pendentes",
            "Em andamento"
        ],
        datasets: [
            // CINZA
            {
                label: "Pendentes",

                data: [
                    numPendentes,
                    0
                ],

                backgroundColor: "rgb(255, 193, 7)",

                borderRadius: 10,

                barThickness: 70
            },

            // AZUL
            {
                label: "Em andamento",

                data: [
                    0,
                    numEmAndamento
                ],

                backgroundColor: "#4f75ff",

                borderRadius: 10,

                barThickness: 70,

                grouped: false,

                order: 1
            },

            // VERMELHA
            {
                label: "Atrasadas",

                data: [
                    0,
                    numAtrasadas
                ],

                backgroundColor:
                    "rgba(207, 75, 93, 0.95)",

                borderRadius: 10,

                barThickness: 40,

                grouped: false,

                order: 0
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {

            legend: {

                position: "top",

                labels: {

                    usePointStyle: true,

                    pointStyle: "circle",

                    padding: 20,

                    generateLabels(chart) {

                        const datasets =
                            chart.data.datasets;

                        return datasets.map(dataset => ({

                            text:
                                `${dataset.label} (${dataset.data.reduce((a, b) => a + b, 0)})`,

                            fillStyle:
                                dataset.backgroundColor,

                            strokeStyle:
                                dataset.backgroundColor,

                            lineWidth: 0,

                            hidden: false,

                            datasetIndex:
                                datasets.indexOf(dataset)
                        }));
                    }
                }
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    }
});