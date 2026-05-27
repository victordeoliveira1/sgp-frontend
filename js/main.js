//===============================================================
// ====================== INICIALIZAÇÃO =========================
//===============================================================
alimentarLocalStorage();

const hoje = new Date().toISOString().split('T')[0];


let arrayProjetos = getProjetos();
const arrayTarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
const arrayUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

let nomeUsuario = "Usuario Padrão";


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

function getProjetos() {
    return JSON.parse(localStorage.getItem("projetos") || "[]");
}
function getTarefas() {
    return JSON.parse(localStorage.getItem("tarefas") || "[]");
}
function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios") || "[]");
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


function gerarCorPorNome(nome) {

    nome = nome.trim().toLowerCase();

    let hash = 0;

    for (let i = 0; i < nome.length; i++) {
        hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash >> 0) & 255;
    const g = (hash >> 8) & 255;
    const b = (hash >> 16) & 255;

    return `rgb(${Math.abs(r)}, ${Math.abs(g)}, ${Math.abs(b)})`;
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

function getStatusColor(status) {

    switch (status) {
        case "ATIVO":
            return "info";

        case "CONCLUIDA":
        case "CONCLUIDO":
            return "success";

        case "EM_ANDAMENTO":
            return "primary";

        case "PENDENTE":
            return "secondary";

        case "CANCELADO":
            return "danger";

        default:
            return "dark";
    }
}
function formatarData(data) {
    if (!data) {
        return "";
    }
    const novaData = new Date(data);
    return novaData.toLocaleDateString(
        "pt-BR"
    );
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();

    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();

    // Verifica se ainda não fez aniversário esse ano
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idade--;
    }
    return idade;
}

function limitarCaracteres(texto, limite) {

    if (texto.length > limite) {
        return texto.slice(0, limite) + "...";
    }

    return texto;
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
    nomeUsuario = dadosUsuarioLogado.nome;
    setTextHTML("siglaNome", exibirSiglaNome(dadosUsuarioLogado.nome));
    const nomePreview = dadosUsuarioLogado.nome.split(' ')[0];
    setTextHTML("nomeUsuario", nomePreview);
    elem("siglaNome").style.setProperty("--cor-siglasBG", gerarCorPorNome(nomeUsuario));

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
// ======================= CRIAR MODAL =============================
//===============================================================



function criarModalEAbrir({
    tamanho,
    titulo,
    corpo,
    rodape
}) {
    if (elem("modal-base-area")) {
        elem("modal-base-area").innerHTML = "";

        elem("modal-base-area").innerHTML = `
    <div class="modal fade" id="modal-base" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="modal-info-title">
                        Modal
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                    </button>
                </div>

                <div class="modal-body" id="modal-info-body">
                    <p>${corpo}</p>
                    <!-- Div vazia -->
                <div id="conteudoModal" style="min-height: 150px;">

                    </div>
                </div>
                <div class="modal-footer">                    
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                        Fechar
                    </button>
                </div>
            </div>
        </div>`;

        const modal = new bootstrap.Modal(document.getElementById("modal-base"));
        modal.show();
    }
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
// ================== TABELAS E PAGINAÇÃO =======================
//===============================================================

function criarTabela(
    {
        nomeObjeto,
        arrayTabela,
        idTabela,
        idPaginacao,
        conteudoHTML,
        paginaAtual,
        itensPorPagina,
        onChangeFunction
    }) {

    elem(idTabela).innerHTML = "";
    elem(idPaginacao).innerHTML = "";

    const primeiroItem = (paginaAtual - 1) * itensPorPagina;
    const ultimoItem = primeiroItem + itensPorPagina;
    const listaParaExibir = arrayTabela.slice(primeiroItem, ultimoItem);

    listaParaExibir.forEach(element => {
        elem(idTabela).innerHTML += conteudoHTML(element);
    });



    //==== CALCULA A QUANTIDADE DE PÁGINAS E CRIA OS BOTÕES DEIXANDO COLORIDO ======
    const totalPaginas = Math.ceil(arrayTabela.length / itensPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        elem(idPaginacao).innerHTML += `
            <button class="btn ${i === paginaAtual ? "btn-primary" : "btn-outline-primary"}"
                onclick="${onChangeFunction}(${i},${nomeObjeto})">
                ${i}
            </button>
        `;
    }
    //==============================================================================
}

function trocarPagina(numeroPagina, objeto) {

    objeto.paginaAtual = numeroPagina;

    criarTabela(objeto);
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
            status: "ATIVO",
            responsavel: "João Pedro"
        },

        {
            id: "4",
            titulo: "Website Portfólio",
            descricao: "Criação de site pessoal responsivo.",
            dataCriacao: "2026-05-12",
            dataConclusao: "2026-05-28",
            status: "CONCLUIDO",
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
        },

        {
            id: "6",
            nome: "Lucas Ferreira",
            cpf: "25874136900",
            email: "lucas@email.com",
            dataNascimento: "1999-09-12",
            status: "ATIVO",
            senha: "lucas123"
        },

        {
            id: "7",
            nome: "Fernanda Lima",
            cpf: "36925814700",
            email: "fernanda@email.com",
            dataNascimento: "1997-04-03",
            status: "ATIVO",
            senha: "fernanda456"
        },

        {
            id: "8",
            nome: "Ricardo Mendes",
            cpf: "95175385200",
            email: "ricardo@email.com",
            dataNascimento: "1990-12-21",
            status: "INATIVO",
            senha: "ricardo789"
        },

        {
            id: "9",
            nome: "Juliana Rocha",
            cpf: "75315945600",
            email: "juliana@email.com",
            dataNascimento: "2001-06-14",
            status: "ATIVO",
            senha: "juliana321"
        },

        {
            id: "10",
            nome: "Gabriel Costa",
            cpf: "85245612300",
            email: "gabriel@email.com",
            dataNascimento: "1996-08-30",
            status: "ATIVO",
            senha: "gabriel654"
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
            dataConclusao: "2026-08-20",
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
            dataConclusao: "2026-08-05",
            status: "EM_ANDAMENTO",
            projeto: "Sistema de Estoque"
        },

        {
            id: "4",
            titulo: "Configurar banco de dados",
            prioridade: "BAIXA",
            responsavel: "Ana Clara",
            descricao: "Criar tabelas e relacionamentos no banco.",
            dataCriacao: "2026-05-08",
            dataConclusao: "2026-09-18",
            status: "CANCELADA",
            projeto: "App de Academia"
        },

        {
            id: "5",
            titulo: "Criar página inicial",
            prioridade: "MEDIA",
            responsavel: "Victor Alves",
            descricao: "Desenvolver homepage responsiva.",
            dataCriacao: "2026-05-12",
            dataConclusao: "2026-07-25",
            status: "CONCLUIDA",
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
            status: "EM_ANDAMENTO",
            projeto: "Sistema de Gestão Escolar"
        },

        {
            id: "7",
            titulo: "Implementar responsividade",
            prioridade: "MEDIA",
            responsavel: "Victor Alves",
            descricao: "Adaptar telas para dispositivos móveis.",
            dataCriacao: "2026-05-09",
            dataConclusao: "2026-08-22",
            status: "EM_ANDAMENTO",
            projeto: "Sistema de Gestão Escolar"
        },

        {
            id: "8",
            titulo: "Integrar API de pagamentos",
            prioridade: "ALTA",
            responsavel: "Victor Alves",
            descricao: "Realizar integração com gateway de pagamentos.",
            dataCriacao: "2026-05-14",
            dataConclusao: "2026-05-28",
            status: "PENDENTE",
            projeto: "Sistema Financeiro"
        },

        {
            id: "9",
            titulo: "Desenvolver tela de relatórios",
            prioridade: "MEDIA",
            responsavel: "Maria Souza",
            descricao: "Criar interface para visualização de relatórios.",
            dataCriacao: "2026-05-16",
            dataConclusao: "2026-05-30",
            status: "CONCLUIDA",
            projeto: "Sistema de Gestão Escolar"
        },

        {
            id: "10",
            titulo: "Implementar filtro de produtos",
            prioridade: "BAIXA",
            responsavel: "Ana Clara",
            descricao: "Adicionar filtros de busca na listagem de produtos.",
            dataCriacao: "2026-05-18",
            dataConclusao: "2026-06-02",
            status: "EM_ANDAMENTO",
            projeto: "Sistema de Estoque"
        },
        // Novas tarefas
        {
            id: "11",
            titulo: "Criar sistema de notificações",
            prioridade: "MEDIA",
            responsavel: "Lucas Ferreira",
            descricao: "Implementar notificações em tempo real no sistema.",
            dataCriacao: "2026-05-20",
            dataConclusao: "2026-06-10",
            status: "EM_ANDAMENTO",
            projeto: "Sistema Financeiro"
        },

        {
            id: "12",
            titulo: "Refatorar código do backend",
            prioridade: "ALTA",
            responsavel: "Fernanda Lima",
            descricao: "Melhorar organização e performance do backend.",
            dataCriacao: "2026-05-18",
            dataConclusao: "2026-06-25",
            status: "EM_ANDAMENTO",
            projeto: "Sistema de Estoque"
        },

        {
            id: "13",
            titulo: "Criar página de contato",
            prioridade: "BAIXA",
            responsavel: "Juliana Rocha",
            descricao: "Desenvolver página de contato responsiva.",
            dataCriacao: "2026-05-05",
            dataConclusao: "2026-05-15",
            status: "CONCLUIDA",
            projeto: "Website Portfólio"
        },

        {
            id: "14",
            titulo: "Implementar autenticação JWT",
            prioridade: "ALTA",
            responsavel: "Gabriel Costa",
            descricao: "Adicionar autenticação segura utilizando JWT.",
            dataCriacao: "2026-05-22",
            dataConclusao: "2026-06-12",
            status: "PENDENTE",
            projeto: "Sistema de Gestão Escolar"
        },

        {
            id: "15",
            titulo: "Documentar endpoints da API",
            prioridade: "MEDIA",
            responsavel: "Ricardo Mendes",
            descricao: "Criar documentação completa da API do sistema.",
            dataCriacao: "2026-05-10",
            dataConclusao: "2026-05-28",
            status: "CANCELADA",
            projeto: "App de Academia"
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