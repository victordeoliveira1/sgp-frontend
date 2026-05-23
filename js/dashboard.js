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

const numTarefasAtrasadas = arrayTarefas.filter(tarefas => tarefas.dataConclusao != "" && tarefas.dataConclusao < hoje).length

let pTarefasAtrasadas = 0;
if (numTarefas > 0) {
    pTarefasAtrasadas = ((numTarefasAtrasadas / numTarefas) * 100).toFixed(1);
}

const projetosRecentes = arrayProjetos.slice(-4);
setTextHTML("projetosRecentes", "");
projetosRecentes.forEach(projeto => {
    let corpoProjetoRecentes = elem("projetosRecentes").innerHTML;
    montarPreviewItem("projetosRecentes", corpoProjetoRecentes, "work_outline", projeto.titulo, projeto.descricao, projeto.status);
});

const tarefasRecentes = arrayTarefas.slice(-4);
setTextHTML("tarefasRecentes", "");
tarefasRecentes.forEach(tarefa => {
    let corpoTarefasRecentes = elem("tarefasRecentes").innerHTML;
    montarPreviewItem("tarefasRecentes", corpoTarefasRecentes, "checklist", tarefa.titulo, "Projeto: "+tarefa.projeto, tarefa.status);
});

//===============================================================
// ===================== SETANDO INNERHTML ======================
//===============================================================

setTextHTML("numProjetosAtivos", numProjetos);

setTextHTML("numTarefasTotal", numTarefas);

setTextHTML("numTarefasConcluidas", numTarefasConcluidas);

setTextHTML("pTarefasConcluidas", pTotalTarefas + "% do total");

setTextHTML("numTarefasAtrasadas", numTarefasAtrasadas);

setTextHTML("pTarefasAtrasadas", pTarefasAtrasadas + "% do total");


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
            icone="check_circle";
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
                    <h6 class="m-0" style="color:rgb(151, 151, 151); font-size:14px">
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
// ========================= GRÁFICOS ===========================
//===============================================================

const ctx = document.getElementById('graficoTarefaPorStatus');

const valores = [45, 28, 13, 8];

const total = valores.reduce(
    (acc, valor) => acc + valor,
    0
);

const labels = [
    "Concluídas",
    "Em andamento",
    "A fazer",
    "Atrasadas"
];

const labelsComPorcentagem =
    labels.map((label, index) => {

        const valor = valores[index];

        const porcentagem =
            Math.round((valor / total) * 100);

        return `${label.padEnd(15)} ${valor} (${porcentagem}%)`;
    });



new Chart(ctx, {

    type: "doughnut",

    data: {

        labels: labelsComPorcentagem,

        datasets: [{
            data: valores,

            backgroundColor: [
                "#58c792",
                "#4f75ff",
                "#bdbdbd",
                "#cf4b5d"
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

                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 20
                }
            }
        }
    }
});

