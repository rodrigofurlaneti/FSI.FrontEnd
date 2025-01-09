async function loadProfiles() {
    try {
        const response = await fetch('https://localhost:44337/api/Profiles');

        if (!response.ok) {
            throw new Error(`Erro ao carregar perfis: ${response.status} ${response.statusText}`);
        }

        const profiles = await response.json();
        const selectProfile = document.getElementById("idProfile");

        selectProfile.innerHTML = '<option value="">Selecione um perfil</option>';

        profiles.forEach(profile => {
            const option = document.createElement("option");
            option.value = profile.id;
            option.textContent = profile.name;
            selectProfile.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao buscar perfis:", error);
        document.getElementById("idProfile").innerHTML = '<option value="">Erro ao carregar perfis</option>';
    }
}

// Função separada para facilitar os testes unitários
async function submitUserForm(event) {
    event.preventDefault();

    const idProfileValue = document.getElementById("idProfile").value;
    console.log("🔹 idProfile:", idProfileValue);

    const userData = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        idProfile: parseInt(idProfileValue),
        dateInsert: new Date().toISOString(),
        dateUpdate: new Date().toISOString(),
        status: true
    };

    console.log("🔹 userData:", userData);

    try {
        const response = await fetch('https://localhost:44337/api/Users', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        console.log("✅ fetch foi chamado!");

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        document.getElementById("message").innerHTML = "<p class='text-success'>Usuário cadastrado com sucesso!</p>";

        setTimeout(() => { window.location.href = "user.html"; }, 2000);

    } catch (error) {
        console.error("❌ Erro ao enviar formulário:", error);
        document.getElementById("message").innerHTML = `<p class='text-danger'>Erro: ${error.message} Erro: Erro na API</p>`;
    }
}

// Garante que o código só execute no navegador
if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        loadProfiles();

        const form = document.getElementById("userForm");
        if (form) {
            form.addEventListener("submit", submitUserForm);
        }
    });
}

// Exporta para testes unitários
if (typeof module !== "undefined") {
    module.exports = { loadProfiles, submitUserForm };
}
