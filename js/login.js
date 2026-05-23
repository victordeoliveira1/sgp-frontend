if (usuarioLogado) {
    if (window.location.href.includes("login.html")) {
        logar(usuarioLogado);
        window.location.href = "index.html";
    }
}

//===============================================================
// ================== LOGAR E LOGOUT ========================
//===============================================================
function logar(usuarioLogado) {
    const usuarioCompletoEncontrado = arrayUsuarios.find(usuario => usuario.id == usuarioLogado.id);
    const existeUserSalvo = JSON.parse(localStorage.getItem("user") || null);
    if (existeUserSalvo) {
        localStorage.removeItem("user");
    }
    if (usuarioLogado.ml || !usuarioLogado.ml) {
        localStorage.setItem("user", JSON.stringify(usuarioLogado));
    }

    if (usuarioCompletoEncontrado) {
        const dadosUser = {
            nome: usuarioCompletoEncontrado.nome,
            email: usuarioCompletoEncontrado.email,
            dataNascimento: usuarioCompletoEncontrado.dataNascimento,
            status: usuarioCompletoEncontrado.status
        }
        localStorage.setItem("dadosUser", JSON.stringify(dadosUser));
        window.location.href = "index.html";
    } else {
        localStorage.removeItem("user");
        localStorage.removeItem("dadosUser");
        alert(ERROS.erroInesperado)
        window.location.href = "login.html"
    }
}



//===============================================================
// ================== AUTENTICAÇÃO LOGIN ========================
//===============================================================

function autenticacaoLogin() {
    elem("MensagemErroLogin").style.opacity = 0;
    setTextHTML("MensagemErroLogin", ERROS.emailOuSenhaNaoEncontrado);
    limparErro("emailLogin");
    limparErro("senhaLogin");

    const login = elem("emailLogin").value;
    const senha = elem("senhaLogin").value;

    if (login == "") {
        setMensagemErro("emailLogin", "");
        setTextHTML("MensagemErroLogin", "Preencha o campo.");
    }
    if (senha == "") {
        setMensagemErro("senhaLogin", "");
        setTextHTML("MensagemErroLogin", "Preencha o campo.");
    }

    const arrayUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const autLogin = arrayUsuarios.some(usuario => usuario.email.toLowerCase() == login.toLowerCase());
    if (!autLogin) {
        setMensagemErro("emailLogin", "");
        setMensagemErro("senhaLogin", "");
        elem("MensagemErroLogin").style.opacity = 1;
        return;
    }

    const autSenha = arrayUsuarios.some(usuario => usuario.senha == senha);
    if (!autSenha) {
        setMensagemErro("emailLogin", "");
        setMensagemErro("senhaLogin", "");
        elem("MensagemErroLogin").style.opacity = 1;
        return;
    }

    const user = arrayUsuarios.find(usuario => usuario.email.toLowerCase() == login.toLowerCase() && usuario.senha == senha);
    if (!user) {
        setTextHTML("MensagemErroLogin", ERROS.erroInesperado);
        elem("MensagemErroLogin").style.opacity = 1;
    } else {
        const manterLogado = elem("manterLogado").checked;
        const userLogado = {
            ml: manterLogado,
            id: user.id,
            timestampLogin: Date.now()
        }
        logar(userLogado);
    }


}

//===============================================================
// ===================== SETANDO INNERHTML ======================
//===============================================================

elem("MensagemErroLogin").style.opacity = 0;
setTextHTML("MensagemErroLogin", ERROS.emailOuSenhaNaoEncontrado);
