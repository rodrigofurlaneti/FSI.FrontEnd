document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

let orderIdToDelete = null;

async function fetchOrders() {
  const url = urlBaseApiOrder;
  const loadingMessage = document.getElementById("loadingMessage");
  const ordersTable = document.getElementById("ordersTable");
  const ordersBody = document.getElementById("ordersBody");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const orders = await response.json();

    if (orders.length === 0) {
      loadingMessage.innerHTML =
        "<p class='text-warning'>Nenhuma pedido foi encontrada.</p>";
      return;
    }

    // Criar um array de promessas para buscar os dados adicionais
    const orderPromises = orders.map(async (order) => {
      try {
        const commandResponse = await fetch(
          `${urlBaseApiCommand}/${order.idCommand}`
        );
        const commandData = await commandResponse.json();
        const userResponse = await fetch(
          `${urlBaseApiUser}/${commandData.idUser}`
        );
        const userData = await userResponse.json();
        const productResponse = await fetch(
          `${urlBaseApiProduct}/${order.idProduct}`
        );
        const productData = await productResponse.json();

        return {
          ...order,
          username: userData.username,
          nameProduct: productData.name,
        };
      } catch (error) {
        console.error(error);
        return {
          ...order,
          username: "Desconhecido",
          nameProduct: "Desconhecido",
        };
      }
    });

    // Aguardar todas as requisições de usuários
    const ordersWithDetails = await Promise.all(orderPromises);

    // Gerar as linhas da tabela
    ordersBody.innerHTML = ordersWithDetails
      .map(
        (order) => `
            <tr>
                <td>${order.id}</td>
                <td>${order.idCommand}</td>
                <td>${order.username}</td>
                <td>${order.idProduct}</td>
                <td>${order.nameProduct}</td>
                <td>${order.quantity}</td>
                <td>${order.valueOf}</td>
                <td>${order.valueFor}</td>
                <td>${order.discount}</td>
                <td>${new Date(order.dateInsert).toLocaleDateString(
                  "pt-BR"
                )}</td>
                <td>${new Date(order.dateUpdate).toLocaleDateString(
                  "pt-BR"
                )}</td>
                <td>${order.status ? "Ativo" : "Inativo"}</td>
                <td>
                    <div class="row justify-content-md-center">
                        <div class="col-sm-6">
                            <a id="btnUpdate" name="btnUpdate" href="orderUpdate.html?id=${
                              order.id
                            }" 
                            class="btn btn-warning btn-sm" data-bs-toggle="tooltip" title="Atualizar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise iconText" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                </svg>
                            </a>
                        </a>
                    </div>
                    <div class="col-sm-5">
                        <a id="btnDelete" name="btnDelete" href="#" onclick="deleteOrder(${
                          order.id
                        })" 
                        class="btn btn-danger btn-sm" data-bs-toggle="tooltip" title="Excluir">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x iconText" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </a>
                        </div>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");

    // Esconder a mensagem de carregamento e exibir a tabela
    loadingMessage.classList.add("d-none");
    ordersTable.classList.remove("d-none");
  } catch (error) {
    loadingMessage.innerHTML = `<p class="text-danger">Erro: ${error.message}</p>`;
  }
}

fetchOrders();

function deleteOrder(id) {
  orderIdToDelete = id;
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  modal.show();
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", async function () {
    if (orderIdToDelete) {
      try {
        const response = await fetch(`${urlBaseApiOrder}/${orderIdToDelete}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(
            `Erro na API: ${response.status} ${response.statusText}`
          );
        }

        alert("Pedido foi excluído com sucesso!");
        window.location.reload();
      } catch (error) {
        alert(`Erro ao excluir: ${error.message}`);
      }
    }
  });
