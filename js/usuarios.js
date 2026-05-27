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
                <a href="usuarios.html?id=${usuario.id}&action=edit" class="btn">
                    <span class="material-symbols-outlined text-primary">
                        edit
                    </span>              
                </a> 

                <button onclick="excluirUsuario('${usuario.id}')"class="btn"> 
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

if (cpfInput) {
    mascaraCPF("cpfUsuario");
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
    let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const cpfLimpo = cpf.replace(/\D/g, "");

    const cpfJaExiste = usuarios.some(usuario => usuario.cpf == cpfLimpo);
    if (cpfJaExiste) {
        setMensagemErro("cpfUsuario", ERROS.cpfCadastrado);
        return;
    }

    const emailJaExiste = usuarios.some(usuario => usuario.email.toLowerCase() == email.toLowerCase());
    if (emailJaExiste) {
        setMensagemErro("emailUsuario", ERROS.emailCadastrado);
        return;
    }

    const usuario = {
        id: Date.now().toString(),
        nome: nome,
        cpf: cpfLimpo,
        email: email,
        dataNascimento: dataNascimento,
        status: status,
        senha: senha
    };

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    const modal = bootstrap.Modal.getInstance(elem("modalUsuario"));
    modal.hide();


    alert(CONFIRMACAO.cadastroUsuario);
    form.reset();
    form.classList.remove("was-validated");
    
    objetoUsuario.arrayTabela=getUsuarios();
    criarTabela(objetoUsuario);
}
