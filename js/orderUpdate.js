async function loadCommands() {
  try {
    const response = await fetch(urlBaseApiCommand);

    if (!response.ok) {
      throw new Error(
        `Erro ao carregar comandas: ${response.status} ${response.statusText}`
      );
    }

    const commands = await response.json();
    const selectCommand = document.getElementById("idCommand");

    // Limpar opções anteriores
    selectCommand.innerHTML = '<option value="">Selecione uma comanda</option>';

    // Preencher o select com as comandas retornadas
    commands.forEach((command) => {
      const option = document.createElement("option");
      option.value = command.id; // Usa o ID da comanda como valor
      option.textContent = command.name; // Usa o nome da comanda como texto
      selectCommand.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao buscar as comandas:", error);
    document.getElementById("idCommand").innerHTML =
      '<option value="">Erro ao carregar as comandas</option>';
  }
}

async function loadProducts() {
  try {
    const response = await fetch(urlBaseApiProduct);

    if (!response.ok) {
      throw new Error(
        `Erro ao carregar produtos: ${response.status} ${response.statusText}`
      );
    }

    const products = await response.json();
    const selectProduct = document.getElementById("idProduct");

    // Limpar opções anteriores
    selectProduct.innerHTML = '<option value="">Selecione uma produto</option>';

    // Preencher o select com as produtos retornadas
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id; // Usa o ID da produto como valor
      option.textContent = product.name; // Usa o nome da produto como texto
      selectProduct.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao buscar as produtos:", error);
    document.getElementById("idProduct").innerHTML =
      '<option value="">Erro ao carregar as produtos</option>';
  }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadCommands);
document.addEventListener("DOMContentLoaded", loadProducts);

const apiUrl = urlBaseApiOrder;
const commandsApiUrl = urlBaseApiCommand; // API de Commands
const productsApiUrl = urlBaseApiProduct; // API de Products
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("id");

// Função para carregar as comandas dinamicamente
async function loadCommands() {
  const commandSelect = document.getElementById("idCommand");

  try {
    const response = await fetch(commandsApiUrl);
    if (!response.ok) throw new Error("Erro ao carregar as comandas.");

    const commands = await response.json();

    commandSelect.innerHTML = `<option value="">Selecione uma comanda</option>`;

    commands.forEach((command) => {
      commandSelect.innerHTML += `<option value="${command.id}">${command.id}</option>`;
    });
  } catch (error) {
    commandSelect.innerHTML = `<option value="">Erro ao carregar comanda</option>`;
    console.error(error);
  }
}

// Função para carregar os produtos dinamicamente
async function loadProducts() {
  const productSelect = document.getElementById("idProduct");

  try {
    const response = await fetch(productsApiUrl);
    if (!response.ok) throw new Error("Erro ao carregar as produtos.");

    const products = await response.json();

    productSelect.innerHTML = `<option value="">Selecione uma produto</option>`;

    products.forEach((product) => {
      productSelect.innerHTML += `<option value="${product.id}">${product.name}</option>`;
    });
  } catch (error) {
    productSelect.innerHTML = `<option value="">Erro ao carregar produto</option>`;
    console.error(error);
  }
}

// Função para carregar os dados do pedido
async function loadOrderData() {
  if (!orderId) {
    alert("ID do pedido não encontrado!");
    window.location.href = "order.html";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${orderId}`);

    if (!response.ok) throw new Error("Erro ao carregar pedido.");

    const order = await response.json();

    console.log(order);

    document.getElementById("orderId").value = order.id;
    document.getElementById("quantity").value = order.quantity;
    document.getElementById("valueOf").value = order.valueOf;
    document.getElementById("valueFor").value = order.valueFor;
    document.getElementById("discount").value = order.discount;
    document.getElementById("status").value = product.status;

    await loadCommands(); // Aguarde o carregamento das comandas antes de definir o valor

    await loadProducts(); // Aguarde o carregamento dos produtos antes de definir o valor

    if (order.idCommand) {
      document.getElementById("idCommand").value = order.idCommand;
    }

    if (order.idProduct) {
      document.getElementById("idProduct").value = order.idProduct;
    }
  } catch (error) {
    alert("Erro ao carregar os dados: " + error.message);
  }
}

// Função para atualizar o pedido
document
  .getElementById("updateOrderForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedOrder = {
      id: document.getElementById("orderId").value,
      idCommand: parseInt(document.getElementById("idCommand").value),
      idProduct: parseInt(document.getElementById("idProduct").value),
      quantity: document.getElementById("quantity").value,
      valueOf: document.getElementById("valueOf").value,
      valueFor: document.getElementById("valueFor").value,
      discount: document.getElementById("discount").value,
      status: document.getElementById("status").value === "true",
    };

    try {
      const response = await fetch(`${apiUrl}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) throw new Error("Erro ao atualizar pedido.");

      alert("Pedido atualizado com sucesso!");
      window.location.href = "order.html";
    } catch (error) {
      alert("Erro ao salvar alterações: " + error.message);
    }
  });

loadOrderData();
