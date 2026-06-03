//===============================================================
// =================== TABELA DE PROJETOS =======================
//===============================================================
function calcularProgressoProjeto(projetoId) {
    const todasTarefas = getTarefas().filter(t => t.projeto == projetoId);
    const tarefasConcluidas = todasTarefas.filter(tarefas => tarefas.status.toUpperCase() == "CONCLUIDA");
    console.log(tarefasConcluidas.length)
    if (todasTarefas.length === 0) {
        return 0;
    }
    const porcentagem = Math.round((tarefasConcluidas.length / todasTarefas.length) * 100);
    return porcentagem;
}
//=================== ESTRUTURA DO PROJETO =======================

const objetoProjeto = {
    nomeObjeto: "objetoProjeto",
    arrayTabela: getProjetos(),
    idTabela: "corpoTabelaProjetos",
    idPaginacao: "paginacaoProjetos",
    conteudoHTML: (projeto) => `       
        <tr>
            <td class="text-" style="font-weight:bold">${projeto.titulo}</td>

            <td class="${projeto.descricao ? "text-dark" : "text-secondary"}" title="${projeto.descricao}" style="white-space:wrap">
              ${limitarCaracteres(projeto.descricao, 40) || "Não informado"}
            </td>

            <td>${getNomeUsuarioPorId(projeto.responsavel)}</td>
            
            <td>
                <span class="badge rounded-pill bg-${getStatusColor(projeto.status)}">
                    ${projeto.status}
                </span>
            </td>

            <td class="text-center">
                <div class="d-flex align-items-center justify-content-center gap-2">
                    <div class="progress" style="height: 15px; width: 150px;">
                        <div class="progress-bar bg-success" style="width:${calcularProgressoProjeto(projeto.id)}%;">
                        </div>
                    </div>
                        <span style="font-size: 13px; font-weight: bold; min-width: 35px;">
                        ${calcularProgressoProjeto(projeto.id)}%
                        </span>
                    </div>
            </td>
            
            <td>
                <button class="btn" data-bs-toggle="modal" data-bs-target="#modalInfoProjeto" onclick="preencherModalInfoProjeto('${projeto.id}')">
                    <span class="material-symbols-outlined">
                    info
                    </span>
                </button>
                <button class="btn" onclick="abrirModalEdicao('${projeto.id}')">
                    <span class="material-symbols-outlined text-primary">
                    edit
                    </span>
                </button>
                 <button onclick="confirmarExclusaoProjeto('${projeto.id}')"class="btn"> 
                    <span class="material-symbols-outlined text-danger">
                     delete
                    </span>
                </button> 
            </td>

        </tr>`,
    paginaAtual: 1,
    itensPorPagina: 8,
    onChangeFunction: "trocarPagina"
}

criarTabela(objetoProjeto);
carregarUsuariosAutocomplete("listaResponsaveisProjeto");
//=================== EXCLUIR PROJETO =======================
let _idProjetoParaExcluir = null;

function confirmarExclusaoProjeto(idprojeto) {
    const projeto = getProjetos().find(p => p.id == idprojeto);
    if (!projeto) return;
    _idProjetoParaExcluir = idprojeto;
    setTextHTML("nomeProjeto-exclusao", projeto.titulo);
    const modal = new bootstrap.Modal(elem("modalConfirmarExclusao"));
    modal.show();
}

function executarExclusaoProjeto() {
    if (!_idProjetoParaExcluir) return;
    const novoArray = getProjetos().filter(p => p.id != _idProjetoParaExcluir);
    localStorage.setItem("projetos", JSON.stringify(novoArray));
    _idProjetoParaExcluir = null;
    const modal = bootstrap.Modal.getInstance(elem("modalConfirmarExclusao"));
    modal.hide();
    objetoProjeto.arrayTabela = getProjetos();
    criarTabela(objetoProjeto);
}
//=================== PREENCHER INFORMAÇÕES DO PROJETO =======================

function preencherModalInfoProjeto(projetoId) {
    const projeto = getProjetos().find(p => p.id == projetoId);
    const nomeResponsavel = getNomeUsuarioPorId(projeto.responsavel);
    setTextHTML("modal-info-title", "Projeto: " + projeto.titulo);
    const texto = `
        <p><b>Descrição: </b>${projeto.descricao}</p>
        <p><b>Status: </b>
            <span class="badge rounded-pill bg-${getStatusColor(projeto.status)}">
                ${projeto.status}
            </span>
        </p>
        <p><b>Data de criação: </b>${formatarData(projeto.dataCriacao)}</p>
        <p><b>Data de conclusão: </b>${formatarData(projeto.dataConclusao) || "Não informada"}</p>
        <p><b>Responsável: </b>
        <b class="siglaNome rounded-circle me-1 align-middle d-inline-flex justify-content-center align-items-center" style="cursor:default; background-color:${gerarCorPorNome(nomeResponsavel)}">
                ${exibirSiglaNome(nomeResponsavel)}
                </b>
        ${nomeResponsavel}
        </p>
    `;
    setTextHTML("modal-info-body", texto);
}

//===============================================================
// ====================== SETANDO VALORES =======================
//===============================================================
setTextValue("statusProjeto", "ATIVO");
setTextValue("dataCriacaoProjeto", hoje);


//===============================================================
// ================ VALIDAÇÃO FORM PROJETO ======================
//===============================================================

function abrirModalEdicao(projetoId) {
    const projeto = getProjetos().find(p => p.id == projetoId);
    if (!projeto) return;

    elem("projetoIdEdicao").value = projeto.id;
    setTextHTML("tituloModalProjeto", "Editar Projeto");
    setTextValue("tituloProjeto", projeto.titulo);
    setTextValue("descricaoProjeto", projeto.descricao);
    setTextValue("dataCriacaoProjeto", projeto.dataCriacao);
    setTextValue("dataConclusaoProjeto", projeto.dataConclusao);
    setTextValue("statusProjeto", projeto.status);
    setTextValue("responsavelProjeto", getNomeUsuarioPorId(projeto.responsavel));

    const modal = new bootstrap.Modal(elem("modalProjeto"));
    modal.show();
}

function resetarModalProjeto() {
    elem("projetoIdEdicao").value = "";
    setTextHTML("tituloModalProjeto", "Novo Projeto");
    setTextValue("dataCriacaoProjeto", hoje);
}

function validarFormProjeto() {

    const form = elem("formProjeto");

    const titulo = elem("tituloProjeto").value;
    const descricao = elem("descricaoProjeto").value;
    const dataCriacao = elem("dataCriacaoProjeto").value;
    const dataConclusao = elem("dataConclusaoProjeto").value;
    const status = elem("statusProjeto").value;
    const nomeResponsavel = elem("responsavelProjeto").value;
    const usuarioEncontrado = getUsuarios().find(u => u.nome == nomeResponsavel);
    const responsavel = usuarioEncontrado ? usuarioEncontrado.id : nomeResponsavel;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const inputCriacao = elem("dataCriacaoProjeto");
    const inputConclusao = elem("dataConclusaoProjeto");

    inputCriacao.classList.remove("is-invalid");
    inputConclusao.classList.remove("is-invalid");

    if (dataConclusao && dataCriacao > dataConclusao) {
        inputCriacao.classList.add("is-invalid");
        inputConclusao.classList.add("is-invalid");
        alert(ERROS.dataCriacao);
        return;
    }

    const idEdicao = elem("projetoIdEdicao").value;
    let projetos = getProjetos();

    if (idEdicao) {
        const index = projetos.findIndex(p => p.id == idEdicao);
        projetos[index] = { id: idEdicao, titulo, descricao, dataCriacao, dataConclusao, status, responsavel };
    } else {
        projetos.push({ id: Date.now().toString(), titulo, descricao, dataCriacao, dataConclusao, status, responsavel });
    }

    localStorage.setItem("projetos", JSON.stringify(projetos));

    resetarModalProjeto();
    const modal = bootstrap.Modal.getInstance(elem("modalProjeto"));
    modal.hide();

    alert(CONFIRMACAO.cadastroProjeto);
    form.reset();
    form.classList.remove("was-validated");
    carregarUsuariosAutocomplete("listaResponsaveisProjeto");

    objetoProjeto.arrayTabela = getProjetos();
    criarTabela(objetoProjeto);
}




