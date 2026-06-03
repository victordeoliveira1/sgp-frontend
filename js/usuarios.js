//===============================================================
// ================= CRIA A TABELA USUARIOS =====================
//===============================================================
const objetoUsuario = {
    nomeObjeto: "objetoUsuario",
    arrayTabela: getUsuarios(),
    idTabela: "corpoTabelaUsuarios",
    idPaginacao: "paginacaoUsuarios",
    conteudoHTML: (usuario) => `
        <tr>
            <td class="text-start">
                <b class="siglaNome rounded-circle me-2 align-middle d-inline-flex justify-content-center align-items-center" style="cursor:default;background-color:${gerarCorPorNome(usuario.nome)}">
                ${exibirSiglaNome(usuario.nome)}
                </b>
               <b>${usuario.nome}</b>
            </td>
            <td>${formatarCPF(usuario.cpf)}</td>
            <td>${usuario.email}</td>
            <td class="text-center">${calcularIdade(usuario.dataNascimento)}</td>
            <td>
            <span class="badge rounded-pill bg-${getStatusColor(usuario.status)}">${usuario.status}</span>
            </td>
            <td>
                <button class="btn" onclick="abrirModalEdicaoUsuario('${usuario.id}')">
                    <span class="material-symbols-outlined text-primary">
                        edit
                    </span>
                </button>

                <button onclick="confirmarExclusaoUsuario('${usuario.id}')" class="btn">
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

criarTabela(objetoUsuario);


//===============================================================
// =================== USANDO MÁSCARAS ==========================
//===============================================================

const cpfInput = elem("cpfUsuario");
if (cpfInput) {
    mascaraCPF("cpfUsuario");
}

//===============================================================
// ================ EDIÇÃO DE USUÁRIO ===========================
//===============================================================

function abrirModalEdicaoUsuario(usuarioId) {
    const usuario = getUsuarios().find(u => u.id == usuarioId);
    if (!usuario) return;

    elem("usuarioIdEdicao").value = usuario.id;
    setTextHTML("tituloModalUsuario", "Editar Usuário");
    setTextHTML("btnSalvarUsuario", "Salvar");
    setTextValue("nomeUsuarioForm", usuario.nome);
    setTextValue("cpfUsuario", formatarCPF(usuario.cpf));
    setTextValue("emailUsuario", usuario.email);
    setTextValue("dataNascimento", usuario.dataNascimento);
    setTextValue("statusUsuario", usuario.status);
    elem("senhaUsuario").value = "";

    const modal = new bootstrap.Modal(elem("modalUsuario"));
    modal.show();
}

function resetarModalUsuario() {
    elem("usuarioIdEdicao").value = "";
    setTextHTML("tituloModalUsuario", "Novo Usuário");
    setTextHTML("btnSalvarUsuario", "Adicionar Usuário");
}

//===============================================================
// ================ EXCLUSÃO DE USUÁRIO =========================
//===============================================================

let _idUsuarioParaExcluir = null;

function confirmarExclusaoUsuario(idUsuario) {
    const usuario = getUsuarios().find(u => u.id == idUsuario);
    if (!usuario) return;
    _idUsuarioParaExcluir = idUsuario;
    setTextHTML("nomeUsuario-exclusao", usuario.nome);
    const modal = new bootstrap.Modal(elem("modalConfirmarExclusaoUsuario"));
    modal.show();
}

function executarExclusaoUsuario() {
    if (!_idUsuarioParaExcluir) return;
    const novoArray = getUsuarios().filter(u => u.id != _idUsuarioParaExcluir);
    localStorage.setItem("usuarios", JSON.stringify(novoArray));
    _idUsuarioParaExcluir = null;
    bootstrap.Modal.getInstance(elem("modalConfirmarExclusaoUsuario")).hide();
    objetoUsuario.arrayTabela = getUsuarios();
    criarTabela(objetoUsuario);
}

//===============================================================
// ================ VALIDAÇÃO FORM USUARIO ======================
//===============================================================

function validarFormUsuario() {

    const form = elem("formUsuario");

    const nome = elem("nomeUsuarioForm").value;
    const cpf = elem("cpfUsuario").value;
    const email = elem("emailUsuario").value;
    const dataNascimento = elem("dataNascimento").value;
    const status = elem("statusUsuario").value;
    const senha = elem("senhaUsuario").value;

    limparErro("emailUsuario", ERROS.emailVazio)
    limparErro("cpfUsuario", ERROS.cpfVazio)

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const idEdicao = elem("usuarioIdEdicao").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const cpfLimpo = cpf.replace(/\D/g, "");

    const cpfJaExiste = usuarios.some(u => u.cpf == cpfLimpo && u.id != idEdicao);
    if (cpfJaExiste) {
        setMensagemErro("cpfUsuario", ERROS.cpfCadastrado);
        return;
    }

    const emailJaExiste = usuarios.some(u => u.email.toLowerCase() == email.toLowerCase() && u.id != idEdicao);
    if (emailJaExiste) {
        setMensagemErro("emailUsuario", ERROS.emailCadastrado);
        return;
    }

    const senhaFinal = senha || (idEdicao ? usuarios.find(u => u.id == idEdicao)?.senha : "");

    if (idEdicao) {
        const index = usuarios.findIndex(u => u.id == idEdicao);
        usuarios[index] = { id: idEdicao, nome, cpf: cpfLimpo, email, dataNascimento, status, senha: senhaFinal };
    } else {
        usuarios.push({
            id: Date.now().toString(),
            nome, cpf: cpfLimpo, email, dataNascimento, status, senha: senhaFinal
        });
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    if (idEdicao == usuarioLogado?.id) {
        localStorage.setItem("dadosUser", JSON.stringify({ id: idEdicao, nome, email, dataNascimento, status }));
        setTextHTML("siglaNome", exibirSiglaNome(nome));
        setTextHTML("nomeUsuario", nome.split(" ")[0]);
        elem("siglaNome").style.setProperty("--cor-siglasBG", gerarCorPorNome(nome));
    }

    resetarModalUsuario();
    const modal = bootstrap.Modal.getInstance(elem("modalUsuario"));
    modal.hide();

    alert(CONFIRMACAO.cadastroUsuario);
    form.reset();
    form.classList.remove("was-validated");

    objetoUsuario.arrayTabela = getUsuarios();
    criarTabela(objetoUsuario);
}
