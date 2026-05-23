
const selectProjetoTarefa = elem("projetoTarefa");

//===============================================================
// ====================== SETANDO VALORES =======================
//===============================================================

setTextValue("dataCriacaoTarefa", hoje);
//===============================================================
// ====================== SELECT PROJETOS =======================
//===============================================================

if (selectProjetoTarefa) {
    let listaDeProjetos = '<option value="" disabled selected>Selecione</option>';
    arrayProjetos.forEach(projeto => {
        listaDeProjetos = listaDeProjetos + "<option value=" + projeto.titulo + ">" + projeto.titulo + "</option>";
    })
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
    const tarefa = {
        id: Date.now().toString(),
        titulo: titulo,
        prioridade: prioridade,
        responsavel: responsavel,
        descricao: descricao,
        dataCriacao: dataCriacao,
        dataConclusao: dataConclusao,
        status: status,
        projeto: projeto
    };

    console.log(tarefa);
    let tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas.push(tarefa);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    const modal = bootstrap.Modal.getInstance(elem("modalTarefa"));

    modal.hide();

    alert(CONFIRMACAO.cadastroTarefas);
    form.reset();
    form.classList.remove("was-validated");
    elem("dataCriacaoTarefa").value = hoje;

}
