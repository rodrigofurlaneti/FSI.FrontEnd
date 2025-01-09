const apiUrl = urlBaseApiCategory;
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get("id");

async function loadCategoryData() {
    if (!categoryId) {
        alert("ID do perfil não encontrado!");
        window.location.href = "category.html";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${categoryId}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar perfil.");
        }

        const category = await response.json();
        document.getElementById("categoryId").value = category.id;
        document.getElementById("categoryname").value = category.name;
        document.getElementById("picture").value = category.picture;
        document.getElementById("description").value = category.description;
        document.getElementById("status").value = category.status;
    } catch (error) {
        alert("Erro ao carregar os dados: " + error.message);
    }
}

document.getElementById("updateCategoryForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedCategory = {
        id: document.getElementById("categoryId").value,
        name: document.getElementById("categoryname").value,
        picture: document.getElementById("picture").value,
        description: document.getElementById("description").value,
        status: document.getElementById("status").value === "true"
    };

    try {
        const response = await fetch(`${apiUrl}/${categoryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCategory)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar o categoria.");
        }

        alert("Categoria atualizado com sucesso!");
        window.location.href = "category.html";
    } catch (error) {
        alert("Erro ao salvar as alterações: " + error.message);
    }
});

loadCategoryData();