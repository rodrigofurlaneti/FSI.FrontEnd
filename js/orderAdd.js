async function loadCommands() {
    try {
        const response = await fetch(urlBaseApiCommand);

        if (!response.ok) {
            throw new Error(`Erro ao carregar comandas: ${response.status} ${response.statusText}`);
        }

        const commands = await response.json();
        const selectCommand = document.getElementById("idCommand");

        // Limpar opções anteriores
        selectCommand.innerHTML = '<option value="">Selecione uma comanda</option>';

        // Preencher o select com as comandas retornadas
        commands.forEach(command => {
            const option = document.createElement("option");
            option.value = command.id; // Usa o ID da comanda como valor
            option.textContent = command.id; // Usa o nome da comanda como texto
            selectCommand.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao buscar as comandas:", error);
        document.getElementById("idCommand").innerHTML = '<option value="">Erro ao carregar as comandas</option>';
    }
}

async function loadProducts() {
    try {
        const response = await fetch(urlBaseApiProduct);

        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status} ${response.statusText}`);
        }

        const products = await response.json();
        const selectProduct = document.getElementById("idProduct");

        // Limpar opções anteriores
        selectProduct.innerHTML = '<option value="">Selecione uma produto</option>';

        // Preencher o select com as produtos retornadas
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id; // Usa o ID da produto como valor
            option.textContent = product.name; // Usa o nome da produto como texto
            selectProduct.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao buscar as produtos:", error);
        document.getElementById("idProduct").innerHTML = '<option value="">Erro ao carregar as produtos</option>';
    }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadCommands);
document.addEventListener("DOMContentLoaded", loadProducts);

document.getElementById("orderForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const orderData = {
        idCommand: parseInt(document.getElementById("idCommand").value),
        idProduct: parseInt(document.getElementById("idProduct").value),
        quantity: document.getElementById("quantity").value,
        valueOf: document.getElementById("valueOf").value,
        valueFor: document.getElementById("valueFor").value,
        discount: document.getElementById("discount").value,
        dateInsert: new Date().toISOString(),
        dateUpdate: new Date().toISOString(),
        status: true
    };

    try {
        const response = await fetch(urlBaseApiOrder, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        document.getElementById("message").innerHTML = "<p class='text-success'>Pedido cadastrado com sucesso!</p>";

        setTimeout(() => { window.location.href = "order.html"; }, 2000);

    } catch (error) {
        document.getElementById("message").innerHTML = `<p class='text-danger'>Erro: ${error.message}</p>`;
    }
});