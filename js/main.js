//===============================================================
// ====================== INICIALIZAÇÃO =========================
//===============================================================
alimentarLocalStorage();

const hoje = new Date().toISOString().split('T')[0];


const arrayProjetos = JSON.parse(localStorage.getItem("projetos") || "[]");
const arrayTarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
const arrayUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

const nomeUsuario = "Victor de Oliveira";

setTextValue("emailLogin", "victor@email.com");
setTextValue("senhaLogin", "123456");

const dadosUsuarioLogado = JSON.parse(localStorage.getItem("dadosUser") || null);

const usuarioLogado = JSON.parse(localStorage.getItem("user") || null);
if (!usuarioLogado) {
    if (!window.location.href.includes("login.html")) {
        localStorage.removeItem("dadosUser");
        window.location.href = "login.html";
    }
}

//===============================================================
// ====================== ELEMENTOS =============================
//===============================================================

const listaUsuarios = elem("listaUsuarios");
const siglaNomeUsuario = elem("siglaNome");
const cpfInput = elem("cpfUsuario");

const ERROS = {
    emailVazio: "Informe o E-mail",
    emailCadastrado: "Este e-mail já está cadastrado!",
    cpfVazio: "Informe o CPF.",
    cpfCadastrado: "Este cpf já está cadastrado!",
    dataCriacao: "A data de criação deve ser anterior à data de conclusão.",
    emailOuSenhaNaoEncontrado: "Não foi encontrado uma conta com este e-mail e senha.",
    erroInesperado: "Ocorreu um erro inesperado"
};

const CONFIRMACAO = {
    cadastroUsuario: "✅ Usuário salvo com sucesso!",
    cadastroProjeto: "✅ Projeto salvo com sucesso!",
    cadastroTarefas: "✅ Tarefa salva com sucesso!"
}

//===============================================================
// ====================== HELPERS ===============================
//===============================================================

function elem(idElemento) {
    return document.getElementById(idElemento)
}

function setarData(idElemento, data) {
    elem(idElemento).value = data;
}

function setMensagemErro(idElemento, mensagem) {
    const input = elem(idElemento);
    const feedback = input.parentElement.querySelector(".invalid-feedback")
    feedback.textContent = mensagem;
    input.classList.add("is-invalid");
}

function limparErro(idElemento, mensagemPadrao) {
    const input = elem(idElemento);
    const feedback = input.parentElement.querySelector(".invalid-feedback")
    feedback.textContent = mensagemPadrao;
    input.classList.remove("is-invalid");
}

function setTextValue(id, texto) {
    const elemento = elem(id)
    if (elemento) {
        elemento.value = texto;
    }
}

function setTextHTML(id, texto) {
    const elemento = elem(id)
    if (elemento) {
        elemento.innerHTML = texto;
    }
}

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

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.slice(0, 11);
    cpf = cpf.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    cpf = cpf.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    cpf = cpf.replace(
        /(\d{3})(\d{1,2})$/,
        "$1-$2"
    );

    return cpf;
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("dadosUser");
    window.location.href = "login.html"

}
//===============================================================
// ====================== AUTOCOMPLETE ==========================
//===============================================================

if (listaUsuarios) {
    carregarUsuariosAutocomplete();
}

//===============================================================
// ===================== SETANDO INNERHTML ======================
//===============================================================

if (dadosUsuarioLogado) {
    setTextHTML("siglaNome", exibirSiglaNome(dadosUsuarioLogado.nome));
    const nomePreview = dadosUsuarioLogado.nome.split(' ')[0];
    setTextHTML("nomeUsuario", nomePreview);
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

function mostrarSenha(idElemento) {
    const inputSenha = elem(idElemento);
    if (inputSenha.type === "password") {
        inputSenha.type = "text";
    } else {
        inputSenha.type = "password";
    }
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

//===============================================================
// ======================= MASCARAS =============================
//===============================================================
function mascaraCPF(idCampo) {

    const input = elem(idCampo);

    input.addEventListener("input", () => {

        let valor = input.value;
        valor = valor.replace(/\D/g, "");
        valor = valor.slice(0, 11);
        valor = valor.replace(
            /(\d{3})(\d)/,
            "$1.$2"
        );

        valor = valor.replace(
            /(\d{3})(\d)/,
            "$1.$2"
        );

        valor = valor.replace(
            /(\d{3})(\d{1,2})$/,
            "$1-$2"
        );

        input.value = valor;

    });

}


//===============================================================
// ==============================================================
//===============================================================

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
            status: "CANCELADO",
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
            status: "ATIVO",
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
            cpf: "12345678900",
            email: "victor@email.com",
            dataNascimento: "2002-05-14",
            status: "ATIVO",
            senha: "123456"
        },

        {
            id: "2",
            nome: "Maria Souza",
            cpf: "98765432100",
            email: "maria@email.com",
            dataNascimento: "1998-11-20",
            status: "ATIVO",
            senha: "maria123"
        },

        {
            id: "3",
            nome: "João Pedro",
            cpf: "45612378900",
            email: "joao@email.com",
            dataNascimento: "1995-03-08",
            status: "INATIVO",
            senha: "joao456"
        },

        {
            id: "4",
            nome: "Ana Clara",
            cpf: "74185296300",
            email: "ana@email.com",
            dataNascimento: "2000-07-25",
            status: "ATIVO",
            senha: "ana789"
        },

        {
            id: "5",
            nome: "Carlos Henrique",
            cpf: "15935725800",
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
            status: "EM_ANDAMENTO",
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
            status: "EM_ANDAMENTO",
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
            status: "EM_ANDAMENTO",
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