// const number = [1, 2, 3, 4, 5];
// const teste02 = number.filter(num => num >= 3);

// const arrayMap = number.map(k => k * 2);

// console.log(number.shift());


// const tarefaTeste = JSON.parse(localStorage.getItem("tarefa"));

// console.log(tarefaTeste);

// let numProjetos = JSON.parse(localStorage.getItem("projetos")).length;
// const hoje = Date.now().toString();

alimentarLocalStorage();
const listaUsuarios = elem("listaUsuarios");
if (listaUsuarios) {
    carregarUsuariosAutocomplete();
}

function elem(idElemento) {
    return document.getElementById(idElemento)
}
function setarData(idElemento, data) {
    elem(idElemento).value = data;
}

const hoje = new Date().toISOString().split('T')[0];

const dataCriacaoTarefa = elem("dataCriacaoTarefa");
if (dataCriacaoTarefa) {
    dataCriacaoTarefa.value = hoje;
}

const statusProjeto = elem("statusProjeto");
if (statusProjeto) {
    statusProjeto.value = "ATIVO";
}

const dataCriacaoProjeto = elem("dataCriacaoProjeto");
if (dataCriacaoProjeto) {
    dataCriacaoProjeto.value = hoje;
}

const arrayProjetos = JSON.parse(localStorage.getItem("projetos") || "[]");
const arrayTarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
const arrayUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

//===============================================================
// ====================== DASHBOARD =============================
//===============================================================
const numProjetos = arrayProjetos.filter(projeto => projeto.status == "Ativo" || projeto.status == "ATIVO").length;
const numTarefas = arrayTarefas.length;
const numTarefasConcluidas = arrayTarefas.filter(tarefa => tarefa.status == "concluida" || tarefa.status == "CONCLUIDA").length;
let pTotalTarefas = 0;
if (numTarefas > 0) {
    pTotalTarefas = ((numTarefasConcluidas / numTarefas) * 100).toFixed(1);
}
const numTarefasAtrasadas = arrayTarefas.filter(tarefas => tarefas.dataConclusao != "" && tarefas.dataConclusao < hoje).length
let pTarefasAtrasadas = 0;
if (numTarefas > 0) {
    pTarefasAtrasadas = ((numTarefasAtrasadas / numTarefas) * 100).toFixed(1);
}

const projetosAtivos = elem("numProjetosAtivos");
const tarefasTotal = elem("numTarefasTotal");
const tarefasConcluidas = elem("numTarefasConcluidas");
const porcentagemTarefasConcluidas = elem("pTarefasConcluidas");
const tarefasAtrasadas = elem("numTarefasAtrasadas");
const porcentagemTarefasAtrasadas = elem("pTarefasAtrasadas");
const selectProjetoTarefa = elem("projetoTarefa");

if (projetosAtivos) {
    projetosAtivos.innerHTML = numProjetos;
}

if (tarefasTotal) {
    tarefasTotal.innerHTML = numTarefas;
}

if (tarefasConcluidas) {
    tarefasConcluidas.innerHTML = numTarefasConcluidas;
}

if (porcentagemTarefasConcluidas) {
    porcentagemTarefasConcluidas.innerHTML = pTotalTarefas + "% do total";
}
if (tarefasAtrasadas) {
    tarefasAtrasadas.innerHTML = numTarefasAtrasadas;
}
if (porcentagemTarefasAtrasadas) {
    porcentagemTarefasAtrasadas.innerHTML = pTarefasAtrasadas + "% do total";
}

if (selectProjetoTarefa) {
    let listaDeProjetos = '<option value="" disabled selected>Selecione</option>';
    arrayProjetos.forEach(projeto => {
        listaDeProjetos = listaDeProjetos + "<option value=" + projeto.titulo + ">" + projeto.titulo + "</option>";
    })
    selectProjetoTarefa.innerHTML = listaDeProjetos;

}

//===============================================================
// ======================  ================================
//===============================================================



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

//===============================================================
// ====================== TAREFA ================================
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

    if (dataCriacao > dataConclusao) {

        inputCriacao.classList.add("is-invalid");
        inputConclusao.classList.add("is-invalid");

        alert("A data de criação deve ser anterior à data de conclusão.");

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

    alert("✅ Tarefa salva com sucesso!");
    form.reset();
    form.classList.remove("was-validated");
    elem("dataCriacaoTarefa").value = hoje;

}

//===============================================================
// ====================== PROJETO ===============================
//===============================================================

function validarFormProjeto() {

    const form = elem("formProjeto");

    const titulo = elem("tituloProjeto").value;
    const descricao = elem("descricaoProjeto").value;
    const dataCriacao = elem("dataCriacaoProjeto").value;
    const dataConclusao = elem("dataConclusaoProjeto").value;
    const status = elem("statusProjeto").value;
    const responsavel = elem("responsavelProjeto").value;

    // Validação HTML5
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    // Inputs de data
    const inputCriacao = elem("dataCriacaoProjeto");
    const inputConclusao = elem("dataConclusaoProjeto");

    // Remove erro anterior
    inputCriacao.classList.remove("is-invalid");
    inputConclusao.classList.remove("is-invalid");

    // Validação de datas
    if (dataCriacao > dataConclusao) {
        inputCriacao.classList.add("is-invalid");
        inputConclusao.classList.add("is-invalid");
        alert("A data de criação deve ser anterior à data de conclusão.");
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


    alert("✅ Projeto salvo com sucesso!");
    form.reset();
    form.classList.remove("was-validated");

    elem("dataCriacaoProjeto").value = hoje;
}

//===============================================================
// ====================== USUARIO ===============================
//===============================================================

function validarFormUsuario() {

    const form = elem("formUsuario");

    const nome = elem("nomeUsuario").value;
    const cpf = elem("cpfUsuario").value;
    const email = elem("emailUsuario").value;
    const dataNascimento = elem("dataNascimento").value;
    const status = elem("statusUsuario").value;
    const senha = elem("senhaUsuario").value;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
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

    const modal = bootstrap.Modal.getInstance(elem("modalUsuario"));
    modal.hide();


    alert("✅ Usuário salvo com sucesso!");
    form.reset();
    form.classList.remove("was-validated");
}

//===============================================================
// ====================== OUTROS ================================
//===============================================================

function cancelarFormulario(idFormulario) {

    const form = elem(idFormulario);

    form.reset();

    form.classList.remove("was-validated");

    form.querySelectorAll(".is-invalid")
        .forEach(campo => {
            campo.classList.remove("is-invalid");
        });

}

function carregarUsuariosAutocomplete() {
    const listaUsuarios = elem("listaUsuarios");
    listaUsuarios.innerHTML = "";
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.nome;
        listaUsuarios.appendChild(option);
    });

}



function alimentarLocalStorage() {
    const projetos = [

        {
            id: "1",
            titulo: "Sistema de Gestão Escolar",
            descricao: "Projeto para gerenciamento de alunos e professores.",
            dataCriacao: "2026-05-01",
            dataConclusao: "2026-08-30",
            status: "ATIVO",
            responsavel: "Victor Alves"
        },

        {
            id: "2",
            titulo: "App de Academia",
            descricao: "Aplicativo para acompanhamento de treinos.",
            dataCriacao: "2026-04-10",
            dataConclusao: "2026-07-15",
            status: "PENDENTE",
            responsavel: "Maria Souza"
        },

        {
            id: "3",
            titulo: "Sistema Financeiro",
            descricao: "Controle de receitas e despesas empresariais.",
            dataCriacao: "2026-03-05",
            dataConclusao: "2026-06-20",
            status: "CONCLUIDO",
            responsavel: "João Pedro"
        },

        {
            id: "4",
            titulo: "Website Portfólio",
            descricao: "Criação de site pessoal responsivo.",
            dataCriacao: "2026-05-12",
            dataConclusao: "2026-05-28",
            status: "FAZENDO",
            responsavel: "Ana Clara"
        },

        {
            id: "5",
            titulo: "Sistema de Estoque",
            descricao: "Controle de entrada e saída de produtos.",
            dataCriacao: "2026-02-18",
            dataConclusao: "2026-06-01",
            status: "ATIVO",
            responsavel: "Carlos Henrique"
        }

    ];
    let projetosLista = JSON.parse(
        localStorage.getItem("projetos") || "[]"
    );

    projetos.forEach(projetoNovo => {

        const jaExiste = projetosLista.some(
            projeto => projeto.titulo === projetoNovo.titulo
        );

        if (!jaExiste) {
            projetosLista.push(projetoNovo);
        }

    });

    localStorage.setItem(
        "projetos",
        JSON.stringify(projetosLista)
    );


    const usuarios = [

        {
            id: "1",
            nome: "Victor Alves",
            cpf: "123.456.789-00",
            email: "victor@email.com",
            dataNascimento: "2002-05-14",
            status: "ATIVO",
            senha: "123456"
        },

        {
            id: "2",
            nome: "Maria Souza",
            cpf: "987.654.321-00",
            email: "maria@email.com",
            dataNascimento: "1998-11-20",
            status: "ATIVO",
            senha: "maria123"
        },

        {
            id: "3",
            nome: "João Pedro",
            cpf: "456.123.789-00",
            email: "joao@email.com",
            dataNascimento: "1995-03-08",
            status: "INATIVO",
            senha: "joao456"
        },

        {
            id: "4",
            nome: "Ana Clara",
            cpf: "741.852.963-00",
            email: "ana@email.com",
            dataNascimento: "2000-07-25",
            status: "ATIVO",
            senha: "ana789"
        },

        {
            id: "5",
            nome: "Carlos Henrique",
            cpf: "159.357.258-00",
            email: "carlos@email.com",
            dataNascimento: "1992-01-17",
            status: "ATIVO",
            senha: "carlos321"
        }

    ];
    let usuariosLista = JSON.parse(
        localStorage.getItem("usuarios") || "[]"
    );

    usuarios.forEach(usuarioNovo => {

        const cpfExiste = usuariosLista.some(
            usuario => usuario.cpf === usuarioNovo.cpf
        );

        if (!cpfExiste) {
            usuariosLista.push(usuarioNovo);
        }

    });

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosLista)
    );

    const tarefas = [

        {
            id: "1",
            titulo: "Criar tela de login",
            prioridade: "ALTA",
            responsavel: "Victor Alves",
            descricao: "Desenvolver a interface de login do sistema.",
            dataCriacao: "2026-05-01",
            dataConclusao: "2026-05-10",
            status: "CONCLUIDA",
            projeto: "Sistema de Gestão Escolar"
        },

        {
            id: "2",
            titulo: "Implementar cadastro de usuários",
            prioridade: "MEDIA",
            responsavel: "Maria Souza",
            descricao: "Criar funcionalidade de cadastro de usuários.",
            dataCriacao: "2026-05-03",
            dataConclusao: "2026-05-20",
            status: "FAZENDO",
            projeto: "Sistema Financeiro"
        },

        {
            id: "3",
            titulo: "Criar dashboard",
            prioridade: "ALTA",
            responsavel: "João Pedro",
            descricao: "Desenvolver dashboard principal do sistema.",
            dataCriacao: "2026-04-15",
            dataConclusao: "2026-05-05",
            status: "PENDENTE",
            projeto: "Sistema de Estoque"
        },

        {
            id: "4",
            titulo: "Configurar banco de dados",
            prioridade: "BAIXA",
            responsavel: "Ana Clara",
            descricao: "Criar tabelas e relacionamentos no banco.",
            dataCriacao: "2026-05-08",
            dataConclusao: "2026-05-18",
            status: "FAZENDO",
            projeto: "App de Academia"
        },

        {
            id: "5",
            titulo: "Criar página inicial",
            prioridade: "MEDIA",
            responsavel: "Carlos Henrique",
            descricao: "Desenvolver homepage responsiva.",
            dataCriacao: "2026-05-12",
            dataConclusao: "2026-05-25",
            status: "PENDENTE",
            projeto: "Website Portfólio"
        },

        {
            id: "6",
            titulo: "Corrigir bugs do sistema",
            prioridade: "ALTA",
            responsavel: "Victor Alves",
            descricao: "Resolver erros identificados pelos usuários.",
            dataCriacao: "2026-05-02",
            dataConclusao: "2026-05-06",
            status: "CONCLUIDA",
            projeto: "Sistema Financeiro"
        },

        {
            id: "7",
            titulo: "Implementar responsividade",
            prioridade: "MEDIA",
            responsavel: "Maria Souza",
            descricao: "Adaptar telas para dispositivos móveis.",
            dataCriacao: "2026-05-09",
            dataConclusao: "2026-05-22",
            status: "FAZENDO",
            projeto: "Sistema de Gestão Escolar"
        }

    ];
    let tarefasLista = JSON.parse(
        localStorage.getItem("tarefas") || "[]"
    );

    tarefas.forEach(tarefaNova => {

        const tarefaExiste = tarefasLista.some(tarefa =>

            tarefa.titulo.toLowerCase() ===
            tarefaNova.titulo.toLowerCase()

            &&

            tarefa.projeto.toLowerCase() ===
            tarefaNova.projeto.toLowerCase()

        );

        if (!tarefaExiste) {
            tarefasLista.push(tarefaNova);
        }

    });

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefasLista)
    );
}