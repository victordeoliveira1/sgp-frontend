
//===============================================================
// ================== TABELA DE TAREFAS =========================
//===============================================================
const objetoTarefa = {
    nomeObjeto: "objetoTarefa",
    arrayTabela: getTarefas(),
    idTabela: "corpoTabelaTarefas",
    idPaginacao: "paginacaoTarefas",
    conteudoHTML: (tarefa) => {
        const vencida = tarefa.dataConclusao && tarefa.dataConclusao < hoje;
        const dataConclusaoHTML = tarefa.dataConclusao
            ? vencida
                ? `<span class="badge rounded-pill bg-danger fw-bold">${formatarData(tarefa.dataConclusao)}</span>`
                : `<b>${formatarData(tarefa.dataConclusao)}</b>`
            : "Não informada";
        return `
        <tr>
            <td class="text-start" style="font-weight:bold; white-space:wrap">${tarefa.titulo}</td>
            <td class="text-start">
                <b class="siglaNome rounded-circle me-2 align-middle d-inline-flex justify-content-center align-items-center" style="cursor:default;background-color:${gerarCorPorNome(tarefa.responsavel)}">
                    ${exibirSiglaNome(tarefa.responsavel)}
                </b>
                <b>${tarefa.responsavel}</b>
            </td>
            <td>
                <span class="badge rounded-pill bg-${getStatusColor(tarefa.status)}">
                    ${tarefa.status}
                </span>
            </td>
            <td>${tarefa.projeto}</td>
            <td>${dataConclusaoHTML}</td>
            <td>
                <button class="btn" data-bs-toggle="modal" data-bs-target="#modalInfoTarefa" onclick="preencherModalInfoTarefa('${tarefa.id}')">
                    <span class="material-symbols-outlined">info</span>
                </button>
                <button class="btn" onclick="abrirModalEdicaoTarefa('${tarefa.id}')">
                    <span class="material-symbols-outlined text-primary">edit</span>
                </button>
                <button class="btn" onclick="confirmarExclusaoTarefa('${tarefa.id}')">
                    <span class="material-symbols-outlined text-danger">delete</span>
                </button>
            </td>
        </tr>`;
    },
    paginaAtual: 1,
    itensPorPagina: 8,
    onChangeFunction: "trocarPagina"
}

criarTabela(objetoTarefa);

//=================== EXCLUIR TAREFA =======================
let _idTarefaParaExcluir = null;

function confirmarExclusaoTarefa(idTarefa) {
    const tarefa = getTarefas().find(t => t.id == idTarefa);
    if (!tarefa) return;
    _idTarefaParaExcluir = idTarefa;
    setTextHTML("nomeTarefa-exclusao", tarefa.titulo);
    const modal = new bootstrap.Modal(elem("modalConfirmarExclusaoTarefa"));
    modal.show();
}

function executarExclusaoTarefa() {
    if (!_idTarefaParaExcluir) return;
    const novoArray = getTarefas().filter(t => t.id != _idTarefaParaExcluir);
    localStorage.setItem("tarefas", JSON.stringify(novoArray));
    _idTarefaParaExcluir = null;
    bootstrap.Modal.getInstance(elem("modalConfirmarExclusaoTarefa")).hide();
    objetoTarefa.arrayTabela = getTarefas();
    criarTabela(objetoTarefa);
}

//=================== INFO TAREFA =======================
function preencherModalInfoTarefa(tarefaId) {
    const tarefa = getTarefas().find(t => t.id == tarefaId);
    if (!tarefa) return;
    setTextHTML("modal-info-tarefa-title", "Tarefa: " + tarefa.titulo);
    const vencida = tarefa.dataConclusao && tarefa.dataConclusao < hoje;
    const dataConclusaoInfo = tarefa.dataConclusao
        ? vencida
            ? `<span class="badge rounded-pill bg-danger">${formatarData(tarefa.dataConclusao)}</span>`
            : formatarData(tarefa.dataConclusao)
        : "Não informada";
    const texto = `
        <p><b>Descrição: </b>${tarefa.descricao || "Não informada"}</p>
        <p><b>Status: </b>
            <span class="badge rounded-pill bg-${getStatusColor(tarefa.status)}">
                ${tarefa.status}
            </span>
        </p>
        <p><b>Prioridade: </b>${tarefa.prioridade}</p>
        <p><b>Projeto: </b>${tarefa.projeto}</p>
        <p><b>Data de criação: </b>${formatarData(tarefa.dataCriacao)}</p>
        <p><b>Data de conclusão: </b>${dataConclusaoInfo}</p>
        <p><b>Responsável: </b>
            <b class="siglaNome rounded-circle me-1 align-middle d-inline-flex justify-content-center align-items-center" style="cursor:default; background-color:${gerarCorPorNome(tarefa.responsavel)}">
                ${exibirSiglaNome(tarefa.responsavel)}
            </b>
            ${tarefa.responsavel}
        </p>
    `;
    setTextHTML("modal-info-tarefa-body", texto);
}

//=================== EDITAR TAREFA =======================
function abrirModalEdicaoTarefa(tarefaId) {
    const tarefa = getTarefas().find(t => t.id == tarefaId);
    if (!tarefa) return;

    elem("tarefaIdEdicao").value = tarefa.id;
    setTextHTML("tituloModalTarefa", "Editar Tarefa");
    setTextHTML("btnSalvarTarefa", "Salvar");
    setTextValue("tituloTarefa", tarefa.titulo);
    setTextValue("prioridadeTarefa", tarefa.prioridade);
    setTextValue("responsavelTarefa", tarefa.responsavel);
    setTextValue("descricaoTarefa", tarefa.descricao);
    setTextValue("dataCriacaoTarefa", tarefa.dataCriacao);
    setTextValue("dataConclusaoTarefa", tarefa.dataConclusao);
    setTextValue("statusTarefa", tarefa.status);
    setTextValue("projetoTarefa", tarefa.projeto);

    const modal = new bootstrap.Modal(elem("modalTarefa"));
    modal.show();
}

function resetarModalTarefa() {
    elem("tarefaIdEdicao").value = "";
    setTextHTML("tituloModalTarefa", "Nova Tarefa");
    setTextHTML("btnSalvarTarefa", "Salvar");
    setTextValue("dataCriacaoTarefa", hoje);
}

const selectProjetoTarefa = elem("projetoTarefa");

//===============================================================
// ====================== SETANDO VALORES =======================
//===============================================================

setTextValue("dataCriacaoTarefa", hoje);
//===============================================================
// ====================== SELECT PROJETOS =======================
//===============================================================

if (selectProjetoTarefa) {
    let listaDeProjetos ='<option value="" disabled selected>Selecione</option>';
    const projetosAtivos = arrayProjetos.filter(projeto => projeto.status.toUpperCase() == "ATIVO");// caso queira colocar só projetos ativos
    arrayProjetos.forEach(projeto => {
        listaDeProjetos +=
            "<option value='" + projeto.titulo + "'>" +
            projeto.titulo +
            "</option>";
    });
    selectProjetoTarefa.innerHTML = listaDeProjetos;
}


//===============================================================
// ================ VALIDAÇÃO FORM TAREFA =======================
//===============================================================

function validarFormTarefa() {
    const form = elem("formTarefa");

    const titulo = elem("tituloTarefa").value;
    const prioridade = elem("prioridadeTarefa").value;
    const responsavel = elem("responsavelTarefa").value;
    const descricao = elem("descricaoTarefa").value;
    const dataCriacao = elem("dataCriacaoTarefa").value;
    const dataConclusao = elem("dataConclusaoTarefa").value;
    const status = elem("statusTarefa").value;
    const projeto = elem("projetoTarefa").value;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }
    const inputCriacao = elem("dataCriacaoTarefa");
    const inputConclusao = elem("dataConclusaoTarefa");

    inputCriacao.classList.remove("is-invalid");
    inputConclusao.classList.remove("is-invalid");

    if (dataConclusao && dataCriacao > dataConclusao) {

        inputCriacao.classList.add("is-invalid");
        inputConclusao.classList.add("is-invalid");

        alert(ERROS.dataCriacao);

        return;
    }
    const idEdicao = elem("tarefaIdEdicao").value;
    let tarefas = getTarefas();

    if (idEdicao) {
        const index = tarefas.findIndex(t => t.id == idEdicao);
        tarefas[index] = { id: idEdicao, titulo, prioridade, responsavel, descricao, dataCriacao, dataConclusao, status, projeto };
    } else {
        tarefas.push({ id: Date.now().toString(), titulo, prioridade, responsavel, descricao, dataCriacao, dataConclusao, status, projeto });
    }

    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    resetarModalTarefa();
    const modal = bootstrap.Modal.getInstance(elem("modalTarefa"));
    modal.hide();

    alert(CONFIRMACAO.cadastroTarefas);
    form.reset();
    form.classList.remove("was-validated");

    objetoTarefa.arrayTabela = getTarefas();
    criarTabela(objetoTarefa);
}
