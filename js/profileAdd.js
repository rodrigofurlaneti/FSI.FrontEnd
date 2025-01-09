document.getElementById("profileForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const profileData = {
        name: document.getElementById("profilename").value,
        picture: document.getElementById("picture").value,
        dateInsert: new Date().toISOString(),
        dateUpdate: new Date().toISOString(),
        status: true
    };

    try {
        const response = await fetch(urlBaseApiProfile, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        document.getElementById("message").innerHTML = "<p class='text-success'>Perfil cadastrado com sucesso!</p>";

        setTimeout(() => { window.location.href = "profile.html"; }, 2000);

    } catch (error) {
        document.getElementById("message").innerHTML = `<p class='text-danger'>Erro: ${error.message}</p>`;
    }
});