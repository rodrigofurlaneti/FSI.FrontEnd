let productIdToDelete = null;

async function fetchProducts() {
    const url = urlBaseApiProduct;
    const loadingMessage = document.getElementById("loadingMessage");
    const productsTable = document.getElementById("productsTable");
    const productsBody = document.getElementById("productsBody");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const products = await response.json();

        if (products.length === 0) {
            loadingMessage.innerHTML = "<p class='text-warning'>Nenhuma produto foi encontrada.</p>";
            return;
        }

        // Gerar as linhas da tabela
        productsBody.innerHTML = products.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.details}</td>
                    <td>
                        <img id="iconProduct" name="iconProduct" src="../../img/${product.picture}" alt="Icon product" width="48" height="48"/>
                    </td>
                    <td>${product.amount}</td>
                    <td>${product.valueOf}</td>
                    <td>${product.valueFor}</td>
                    <td>${product.discount}</td>
                    <td>${new Date(product.dateInsert).toLocaleDateString("pt-BR")}</td>
                    <td>${new Date(product.dateUpdate).toLocaleDateString("pt-BR")}</td>
                    <td>${product.status ? 'Ativo' : 'Inativo'}</td>
                    <td>
                        <div class="row justify-content-md-center">
                            <div class="col-sm-6">
                                <a href="productUpdate.html?id=${product.id}" class="btn btn-warning btn-sm">
                                    Atualizar
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise iconText" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                </svg>
                            </a>
                        </div>
                        <div class="col-sm-5">
                                <a href="#" onclick="deleteProduct(${product.id})" class="btn btn-danger btn-sm">
                                    Excluir
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x iconText" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join("");

        // Esconder a mensagem de carregamento e exibir a tabela
        loadingMessage.classList.add("d-none");
        productsTable.classList.remove("d-none");

    } catch (error) {
        loadingMessage.innerHTML = `<p class="text-danger">Erro: ${error.message}</p>`;
    }
}

fetchProducts();

function deleteProduct(id) {
    productIdToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    modal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", async function () {
    if (productIdToDelete) {
        try {
            const response = await fetch(`${urlBaseApiProduct}/${productIdToDelete}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }

            alert("Produto foi excluído com sucesso!");
            window.location.reload();
        } catch (error) {
            alert(`Erro ao excluir: ${error.message}`);
        }
    }
});