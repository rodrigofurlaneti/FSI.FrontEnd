async function loadProfiles() {
    try {
        const response = await fetch(urlBaseApiProfile);

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

if (typeof module !== "undefined") {
    module.exports = { loadProfiles };
}

// Apenas executa no navegador
if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", loadProfiles);
}

// Apenas executa no navegador
if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", loadProfiles);
}

document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const userData = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        idProfile: parseInt(document.getElementById("idProfile").value),
        dateInsert: new Date().toISOString(),
        dateUpdate: new Date().toISOString(),
        status: true
    };

    try {
        const response = await fetch(urlBaseApiUser, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        document.getElementById("message").innerHTML = "<p class='text-success'>Usuário cadastrado com sucesso!</p>";

        setTimeout(() => { window.location.href = "user.html"; }, 2000);

    } catch (error) {
        document.getElementById("message").innerHTML = `<p class='text-danger'>Erro: ${error.message}</p>`;
    }
});






