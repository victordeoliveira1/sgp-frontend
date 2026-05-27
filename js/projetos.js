//===============================================================
// =================== TABELA DE PROJETOS =======================
//===============================================================
function calcularProgressoProjeto(projetoTitulo) {
    const todasTarefas = getTarefas().filter(tarefas => tarefas.projeto == projetoTitulo);
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

            <td class="${projeto.descricao ? "text-dark" : "text-secondary"}" title="${projeto.descricao}">
              ${limitarCaracteres(projeto.descricao, 40) || "Não informado"}
            </td>

            <td>${projeto.responsavel}</td>
            
            <td>
                <span class="badge rounded-pill bg-${getStatusColor(projeto.status)}">
                    ${projeto.status}
                </span>
            </td>

            <td class="text-center">
                <div class="d-flex align-items-center justify-content-center gap-2">
                    <div class="progress" style="height: 15px; width: 150px;">
                        <div class="progress-bar bg-success" style="width:${calcularProgressoProjeto(projeto.titulo)}%;">
                        </div>
                    </div>
                        <span style="font-size: 13px; font-weight: bold; min-width: 35px;">
                        ${calcularProgressoProjeto(projeto.titulo)}%
                        </span>
                    </div>
            </td>
            
            <td>
                <button class="btn" data-bs-toggle="modal" data-bs-target="#modalInfoProjeto" onclick="preencherModalInfoProjeto('${projeto.id}')">
                    <span class="material-symbols-outlined">
                    info
                    </span>
                </button>
                <a href="projetos.html?id=${projeto.id}&action=edit" class="btn">
                   <span class="material-symbols-outlined text-primary">
                    edit
                    </span>              
                </a> 
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
//=================== EXCLUIR PROJETO =======================
function confirmarExclusaoProjeto(idprojeto) {
    const novoArray = getProjetos().filter(projeto => projeto.id != idprojeto);
    localStorage.setItem("projetos", JSON.stringify(novoArray));
    objetoProjeto.arrayTabela = getProjetos();
    criarTabela(objetoProjeto);
}
//=================== PREENCHER INFORMAÇÕES DO PROJETO =======================

function preencherModalInfoProjeto(projetoId) {
    const projeto = getProjetos().find(projeto => projeto.id == projetoId);
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
        <b class="siglaNome rounded-circle me-1 align-middle d-inline-flex justify-content-center align-items-center" style="cursor:default; background-color:${gerarCorPorNome(projeto.responsavel)}">
                ${exibirSiglaNome(projeto.responsavel)}
                </b>  
        ${projeto.responsavel}
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

function validarFormProjeto() {

    const form = elem("formProjeto");

    const titulo = elem("tituloProjeto").value;
    const descricao = elem("descricaoProjeto").value;
    const dataCriacao = elem("dataCriacaoProjeto").value;
    const dataConclusao = elem("dataConclusaoProjeto").value;
    const status = elem("statusProjeto").value;
    const responsavel = elem("responsavelProjeto").value;

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

    const projeto = {
        id: Date.now().toString(),
        titulo: titulo,
        descricao: descricao,
        dataCriacao: dataCriacao,
        dataConclusao: dataConclusao,
        status: status,
        responsavel: responsavel

    };

    console.log(projeto);

    let projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
    projetos.push(projeto);
    localStorage.setItem("projetos", JSON.stringify(projetos));

    const modal = bootstrap.Modal.getInstance(elem("modalProjeto"));
    modal.hide();


    alert(CONFIRMACAO.cadastroProjeto);
    form.reset();
    form.classList.remove("was-validated");

    elem("dataCriacaoProjeto").value = hoje;
    objetoProjeto.arrayTabela=getProjetos();
    criarTabela(objetoProjeto);
}




