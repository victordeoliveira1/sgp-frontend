

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
}