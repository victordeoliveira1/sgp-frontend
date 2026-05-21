// const number = [1, 2, 3, 4, 5];
// const teste02 = number.filter(num => num >= 3);

// const arrayMap = number.map(k => k * 2);

// console.log(number.shift());


// const tarefaTeste = JSON.parse(localStorage.getItem("tarefa"));

// console.log(tarefaTeste);

// let numProjetos = JSON.parse(localStorage.getItem("projetos")).length;
let numProjetos = JSON.parse(localStorage.getItem("projetos")).filter(projeto => projeto.status == "Ativo").length;
let numTarefas = JSON.parse(localStorage.getItem("tarefas")).length;
let numTarefasConcluidas = JSON.parse(localStorage.getItem("tarefas")).filter(tarefa => tarefa.status == "concluido").length;
let pTotalTarefas = ((numTarefasConcluidas/numTarefas)*100).toFixed(1);



document.getElementById("numProjetosAtivos").innerHTML = numProjetos;
document.getElementById("numTarefasTotal").innerHTML = numTarefas;
document.getElementById("numTarefasConcluidas").innerHTML = numTarefasConcluidas;
document.getElementById("pTarefasConcluidas").innerHTML = pTotalTarefas+"% do total";






const nomeUsuario = "Victor de Oliveira";
function exibirSiglaNome(nomeUsuario) {
    const ignorar = ["de", "da", "do", "dos", "das"];

    const partesNome = nomeUsuario
        .trim()
        .toLowerCase()
        .split(" ")
        .filter(nome => !ignorar.includes(nome));

    let sigla = "";

    if (partesNome.length > 1) {

        // Primeira letra do primeiro nome
        // + primeira letra do segundo nome válido
        sigla =
            partesNome[0][0] +
            partesNome[1][0];

    } else {

        // Apenas um nome
        sigla = partesNome[0].substring(0, 2);

    }
    return sigla.toUpperCase();
}
document.getElementById("siglaNome").innerHTML =
    exibirSiglaNome(nomeUsuario);

// ---------------------------------------------------------
function validarFormTarefa() {

    let titulo = document.getElementById("tituloTarefa").value;
    let prioridade = document.getElementById("prioridadeTarefa").value;
    let responsavel = document.getElementById("responsavelTarefa").value;
    let descricao = document.getElementById("descricaoTarefa").value;
    let dataCriacao = document.getElementById("dataCriacaoTarefa").value;
    let dataConclusao = document.getElementById("dataConclusaoTarefa").value;
    let status = document.getElementById("statusTarefa").value;
    let projeto = document.getElementById("projetoTarefa").value;

    if (titulo == "") {
        alert("O campo título é obrigatório!");
    }
    if (prioridade == "") {
        alert("O campo prioridade é obrigatório!");
    }
    if (responsavel == "") {
        alert("O campo responsável é obrigatório!");
    }
    if (dataCriacao == "") {
        alert("O campo data de criação é obrigatório!");
    }
    if (dataConclusao == "") {
        alert("O campo data de conclusão é obrigatório!");
    }
    if (status == "") {
        alert("O campo status é obrigatório!");
    }
    if (projeto == "") {
        alert("O campo projeto é obrigatório!");
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
}

function validarFormProjeto() {

    let titulo = document.getElementById("tituloProjeto").value;
    let descricao = document.getElementById("descricaoProjeto").value;
    let dataCriacao = document.getElementById("dataCriacaoProjeto").value;
    let dataConclusao = document.getElementById("dataConclusaoProjeto").value;
    let status = document.getElementById("statusProjeto").value;
    let responsavel = document.getElementById("responsavelProjeto").value;

    if (titulo == "") {
        alert("O campo título é obrigatório!");
    }
    if (descricao == "") {
        alert("O campo descrição é obrigatório!");
    }
    if (dataCriacao == "") {
        alert("O campo data de criação é obrigatório!");
    }
    if (dataConclusao == "") {
        alert("O campo data de conclusão é obrigatório!");
    }
    if (status == "") {
        alert("O campo status é obrigatório!");
    }
    if (responsavel == "") {
        alert("O campo responsável é obrigatório!");
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
}

function validarFormUsuario() {

    let nome = document.getElementById("nomeUsuario").value;
    let cpf = document.getElementById("cpfUsuario").value;
    let email = document.getElementById("emailUsuario").value;
    let dataNascimento = document.getElementById("dataNascimento").value;
    let status = document.getElementById("statusUsuario").value;
    let senha = document.getElementById("senhaUsuario").value;

    if (nome == "") {
        alert("O campo nome é obrigatório!");
    }
    if (cpf == "") {
        alert("O campo CPF é obrigatório!");
    }
    if (email == "") {
        alert("O campo e-mail é obrigatório!");
    }
    if (dataNascimento == "") {
        alert("O campo data de nascimento é obrigatório!");
    }
    if (status == "") {
        alert("O campo status é obrigatório!");
    }
    if (senha == "") {
        alert("O campo senha é obrigatório!");
    }

    const usuario = {
        id: Date.now().toString(),
        nome: nome,
        cpf: cpf,
        email: email,
        dataNascimento: dataNascimento,
        status: status,
        senha: senha
    };

    console.log(usuario);
    let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}