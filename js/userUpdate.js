const apiUrl = urlBaseApiUser;
const profilesApiUrl = urlBaseApiProfile; // API de Perfis
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

// Função para carregar os perfis dinamicamente
async function loadProfiles() {
    const profileSelect = document.getElementById("idProfile");

    try {
        const response = await fetch(profilesApiUrl);
        if (!response.ok) throw new Error("Erro ao carregar perfis.");

        const profiles = await response.json();
        profileSelect.innerHTML = `<option value="">Selecione um perfil</option>`;

        profiles.forEach(profile => {
            profileSelect.innerHTML += `<option value="${profile.id}">${profile.name}</option>`;
        });

    } catch (error) {
        profileSelect.innerHTML = `<option value="">Erro ao carregar perfis</option>`;
        console.error(error);
    }
}

// Função para carregar os dados do usuário
async function loadUserData() {
    if (!userId) {
        alert("ID do usuário não encontrado!");
        window.location.href = "user.html";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${userId}`);
        if (!response.ok) throw new Error("Erro ao carregar usuário.");

        const user = await response.json();
        document.getElementById("userId").value = user.id;
        document.getElementById("username").value = user.username;
        document.getElementById("email").value = user.email;
        document.getElementById("status").value = user.status.toString();

        // Aguarda o carregamento dos perfis antes de selecionar o correto
        await loadProfiles();
        document.getElementById("idProfile").value = user.idProfile;

    } catch (error) {
        alert("Erro ao carregar os dados: " + error.message);
    }
}

// Função para atualizar o usuário
document.getElementById("updateUserForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const passwordField = document.getElementById("password");
    const updatedUser = {
        id: document.getElementById("userId").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        idProfile: parseInt(document.getElementById("idProfile").value),
        status: document.getElementById("status").value === "true"
    };

    // Apenas incluir a senha se foi preenchida
    if (passwordField.value.trim()) {
        updatedUser.password = passwordField.value;
    }

    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser)
        });

        if (!response.ok) throw new Error("Erro ao atualizar usuário.");

        alert("Usuário atualizado com sucesso!");
        window.location.href = "user.html";
    } catch (error) {
        alert("Erro ao salvar alterações: " + error.message);
    }
});

loadUserData();