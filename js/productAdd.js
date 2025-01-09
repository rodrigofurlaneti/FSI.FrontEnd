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

document.getElementById("productForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productData = {
        name: document.getElementById("productname").value,
        idCategory: parseInt(document.getElementById("idCategory").value),
        description: document.getElementById("description").value,
        details: document.getElementById("details").value,
        picture: document.getElementById("picture").value,
        amount: document.getElementById("amount").value,
        valueOf: document.getElementById("valueOf").value,
        valueFor: document.getElementById("valueFor").value,
        discount: document.getElementById("discount").value,
        dateInsert: new Date().toISOString(),
        dateUpdate: new Date().toISOString(),
        status: true
    };

    try {
        const response = await fetch(urlBaseApiProduct, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        document.getElementById("message").innerHTML = "<p class='text-success'>Produto cadastrado com sucesso!</p>";

        setTimeout(() => { window.location.href = "product.html"; }, 2000);

    } catch (error) {
        document.getElementById("message").innerHTML = `<p class='text-danger'>Erro: ${error.message}</p>`;
    }
});