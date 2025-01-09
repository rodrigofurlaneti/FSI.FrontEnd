const apiUrl = urlBaseApiProfile;
const urlParams = new URLSearchParams(window.location.search);
const profileId = urlParams.get("id");

async function loadProfileData() {
    if (!profileId) {
        alert("ID do perfil não encontrado!");
        window.location.href = "profile.html";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${profileId}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar perfil.");
        }

        const profile = await response.json();
        document.getElementById("profileId").value = profile.id;
        document.getElementById("profilename").value = profile.name;
        document.getElementById("picture").value = profile.picture;
        document.getElementById("status").value = profile.status;
    } catch (error) {
        alert("Erro ao carregar os dados: " + error.message);
    }
}

document.getElementById("updateProfileForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedProfile = {
        id: document.getElementById("profileId").value,
        name: document.getElementById("profilename").value,
        picture: document.getElementById("picture").value,
        status: document.getElementById("status").value === "true"
    };

    try {
        const response = await fetch(`${apiUrl}/${profileId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProfile)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar o perfil.");
        }

        alert("Perfil atualizado com sucesso!");
        window.location.href = "profile.html";
    } catch (error) {
        alert("Erro ao salvar as alterações: " + error.message);
    }
});

loadProfileData();