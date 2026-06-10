const ref = db.ref("fornecedores");

let idcapturado = null;

$("#salvar").click(function () {

    let nome = $("#nome").val();
    let email = $("#email").val();
    let cnpj = $("#cnpj").val();
    let estado = $("input[name='estado']:checked").val();

    if (nome === "" || email === "" || cnpj === "" || !estado) {
        alert("Preencha todos os campos");
        return;
    }

    if (idcapturado) {

        ref.child(idcapturado).update({
            nome,
            email,
            cnpj,
            estado
        });

        idcapturado = null;

        $("#salvar")
            .text("Salvar")
            .removeClass("btn-success")
            .addClass("btn-primary");

    } else {

        ref.push({
            nome,
            email,
            cnpj,
            estado
        });
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
            <th>CNPJ</th>
            <th>Estado</th>
            <th colspan="2">Opções</th>
        </tr>
    `);

    dados_tabela.forEach(registro => {

        let reg = registro.val();
        let id = registro.key;

        $("#lista").append(`
            <tr>
                <td>${id}</td>
                <td>${reg.nome}</td>
                <td>${reg.email}</td>
                <td>${reg.cnpj}</td>
                <td>${reg.estado}</td>

                <td>
                    <button class="btn btn-outline-danger btn-sm"
                        onclick="excluir('${id}')">
                        Excluir
                    </button>
                </td>

                <td>
                    <button class="btn btn-outline-warning btn-sm"
                        onclick="editar('${id}', '${reg.nome}', '${reg.email}', '${reg.cnpj}', '${reg.estado}')">
                        Editar
                    </button>
                </td>
            </tr>
        `);
    });
});



function editar(id, nome, email, cnpj, estado) {

    $("#nome").val(nome);
    $("#email").val(email);
    $("#cnpj").val(cnpj);

   
    $(`input[name='estado'][value='${estado}']`).prop("checked", true);

    idcapturado = id;

    $("#salvar")
        .text("Atualizar")
        .removeClass("btn-primary")
        .addClass("btn-success");
}



function excluir(id) {
    ref.child(id).remove();
}


function limpar() {

    $("#nome").val("");
    $("#email").val("");
    $("#cnpj").val("");

    $("input[name='estado']").prop("checked", false);

    $("#nome").focus();
}


$("#cancelar").click(function () {

    limpar();
    idcapturado = null;

    $("#salvar")
        .text("Salvar")
        .removeClass("btn-success")
        .addClass("btn-primary");
});