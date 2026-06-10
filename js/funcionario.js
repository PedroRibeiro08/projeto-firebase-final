const ref = db.ref("funcionarios");

let capturado = null;

$("#salvar").click(function () {
    let id = $("#id").val().trim().toUpperCase();
    let nome = $("#nome").val().trim().toUpperCase();
    let salario = parseFloat($("#salario").val());
    let cargo = $("#cargo").val().trim().toUpperCase();

    if (id === "" || nome === "" || isNaN(salario) || cargo === "") {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const dados = { id, nome, salario, cargo };

    if (capturado) {
        ref.child(capturado).update(dados);
        capturado = null;
        $("#salvar").text("Salvar");
    } else {
        ref.push(dados);
    }

    limpar();
});

$("#cancelar").click(function () {
    limpar();
});


ref.on("value", dados_tabela => {
    $("#lista").empty();

    $("#lista").append(`
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Salário</th>
            <th>Cargo</th>
            <th colspan="2">Opções</th>
        </tr>
        `);

    dados_tabela.forEach(registro => {
        let reg = registro.val();
        let key = registro.key;

        $("#lista").append(`
            <tr>
                <td>${reg.id || key}</td>
                <td>${reg.nome}</td>
                <td>R$ ${Number(reg.salario || 0).toFixed(2)}</td>
                <td>${reg.cargo}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" onclick="excluir('${key}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-outline-warning btn-sm" onclick="editar('${key}','${reg.id || ''}','${reg.nome || ''}','${reg.salario || ''}','${reg.cargo || ''}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
            `);
    });
});

function limpar() {
    $("#id").val("");
    $("#nome").val("");
    $("#salario").val("");
    $("#cargo").val("");
    $("#id").focus();
}

function editar(key, id, nome, salario, cargo) {
    $("#id").val(id);
    $("#nome").val(nome);
    $("#salario").val(salario);
    $("#cargo").val(cargo);

    capturado = key;

    $("#salvar")
        .text("Atualizar")
        .removeClass("btn-primary")
        .addClass("btn-success");
}

function excluir(key) {
    if (confirm("Deseja realmente excluir este funcionário?")) {
        ref.child(key).remove();
    }
}
