

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

    const nome = elem("nomeUsuario").value;
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
}
