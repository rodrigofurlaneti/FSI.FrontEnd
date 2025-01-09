async function loadCategories() {
    try {
        const response = await fetch(urlBaseApiCategory);

        if (!response.ok) {
            throw new Error(`Erro ao carregar categorias: ${response.status} ${response.statusText}`);
        }

        const categories = await response.json();
        const selectCategory = document.getElementById("idCategory");

        // Limpar opções anteriores
        selectCategory.innerHTML = '<option value="">Selecione uma categoria</option>';

        // Preencher o select com as categorias retornadas
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id; // Usa o ID da catagoria como valor
            option.textContent = category.name; // Usa o nome da categoria como texto
            selectCategory.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
        document.getElementById("idCategory").innerHTML = '<option value="">Erro ao carregar as categorias</option>';
    }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadCategories);

const apiUrl = urlBaseApiProduct;
const categoriesApiUrl = urlBaseApiCategory; // API de Categories
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Função para carregar as categorias dinamicamente
async function loadCategories() {
    const categorySelect = document.getElementById("idCategory");

    try {
        const response = await fetch(categoriesApiUrl);
        if (!response.ok) throw new Error("Erro ao carregar as categorias.");

        const categories = await response.json();
        categorySelect.innerHTML = `<option value="">Selecione uma categoria</option>`;
        
        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });

    } catch (error) {
        categorySelect.innerHTML = `<option value="">Erro ao carregar as categorias</option>`;
        console.error(error);
    }
}

// Função para carregar os dados do produto
async function loadProductData() {
if (!productId) {
    alert("ID do produto não encontrado!");
    window.location.href = "product.html";
    return;
}

try {
    const response = await fetch(`${apiUrl}/${productId}`);
    if (!response.ok) throw new Error("Erro ao carregar produto.");

    const product = await response.json();

    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("details").value = product.details;
    document.getElementById("picture").value = product.picture;
    document.getElementById("amount").value = product.amount;
    document.getElementById("valueOf").value = product.valueOf;
    document.getElementById("valueFor").value = product.valueFor;
    document.getElementById("discount").value = product.discount;
    document.getElementById("status").value = product.status;

    await loadCategories(); // Aguarde o carregamento das categorias antes de definir o valor

    if (product.idCategory) {
        document.getElementById("idCategory").value = product.idCategory;
    }

} catch (error) {
    alert("Erro ao carregar os dados: " + error.message);
}
}

// Função para atualizar o produto
document.getElementById("updateProductForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedProduct = {
        id: document.getElementById("productId").value,
        name: document.getElementById("productName").value,
        description: document.getElementById("description").value,
        details: document.getElementById("details").value,
        picture: document.getElementById("picture").value,
        amount: document.getElementById("amount").value,
        valueOf: document.getElementById("valueOf").value,
        valueFor: document.getElementById("valueFor").value,
        discount: document.getElementById("discount").value,
        idCategory: parseInt(document.getElementById("idCategory").value),
        status: document.getElementById("status").value === "true"
    };

    try {
        const response = await fetch(`${apiUrl}/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) throw new Error("Erro ao atualizar produto.");

        alert("Produto atualizado com sucesso!");
        window.location.href = "product.html";
    } catch (error) {
        alert("Erro ao salvar alterações: " + error.message);
    }
});

loadProductData();