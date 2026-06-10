const ref = db.ref("clientes");

let capturado = null;

$("#salvar").click(function () {
    let id = $("#id").val().trim().toUpperCase();
    let nome = $("#nome").val().trim().toUpperCase();
    let email = $("#email").val().trim().toLowerCase();
    let telefone = $("#telefone").val().trim();

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const telefoneValido = /^\d+$/.test(telefone);

    if (id === "" || nome === "" || !emailValido || !telefoneValido) {
        alert("Preencha todos os campos corretamente. O e-mail deve ser válido e o telefone deve conter apenas números.");
        return;
    }

    const dados = { id, nome, email, telefone };

    if (capturado) {
        ref.child(capturado).update(dados);
        capturado = null;

        $("#salvar")
            .text("Salvar")
            .removeClass("btn-success")
            .addClass("btn-primary");

    } else {
        ref.push(dados);
    }

    limpar();
});

ref.on("value", dados_tabela => {
    $("#lista").empty();

    $("#lista").append(`
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th colspan="2">Opções</th>
        </tr>
    `);

    dados_tabela.forEach(registro => {
        let reg = registro.val();
        let id = registro.key;

        $("#lista").append(`
            <tr>
                <td>${reg.id || id}</td>
                <td>${reg.nome}</td>
                <td>${reg.email}</td>
                <td>${reg.telefone}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm"
                        onclick="excluir('${id}')">
                        Excluir
                    </button>
                </td>
                <td>
                    <button class="btn btn-outline-warning btn-sm"
                        onclick="editar('${id}', '${reg.id || ''}', '${reg.nome}', '${reg.email}', '${reg.telefone}')">
                        Editar
                    </button>
                </td>
            </tr>
        `);
    });
});

function editar(key, id, nome, email, telefone) {
    $("#id").val(id);
    $("#nome").val(nome);
    $("#email").val(email);
    $("#telefone").val(telefone);

    capturado = key;

    $("#salvar")
        .text("Atualizar")
        .removeClass("btn-primary")
        .addClass("btn-success");
}

function limpar() {
    $("#id").val("");
    $("#nome").val("");
    $("#email").val("");
    $("#telefone").val("");
    $("#id").focus();
}

function excluir(id) {
    ref.child(id).remove();
}