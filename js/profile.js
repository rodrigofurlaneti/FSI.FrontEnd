let profileIdToDelete = null;

async function fetchProfiles() {
    const url = urlBaseApiProfile;
    const loadingMessage = document.getElementById("loadingMessage");
    const profilesTable = document.getElementById("profilesTable");
    const profilesBody = document.getElementById("profilesBody");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const profiles = await response.json();

        if (profiles.length === 0) {
            loadingMessage.innerHTML = "<p class='text-warning'>Nenhum perfil encontrado.</p>";
            return;
        }

        // Gerar as linhas da tabela
        profilesBody.innerHTML = profiles.map(profile => `
                <tr>
                    <td>${profile.id}</td>
                    <td>${profile.name}</td>
                    <td>
                        <img id="iconProfile" name="iconProfile" src="../../icon/${profile.picture}" alt="Icon profile" width="28" height="28"/>
                    </td>
                    <td>${new Date(profile.dateInsert).toLocaleDateString("pt-BR")}</td>
                    <td>${new Date(profile.dateUpdate).toLocaleDateString("pt-BR")}</td>
                    <td>${profile.status ? 'Ativo' : 'Inativo'}</td>
                    <td>
                        <div class="row justify-content-md-center">
                            <div class="col-sm-6">
                                <a href="profileUpdate.html?id=${profile.id}" class="btn btn-warning btn-sm">
                                    Atualizar
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise iconText" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                    </svg>
                                </a>
                            </div>

                        <div class="col-sm-5">
                            <a href="#" onclick="deleteProfile(${profile.id})" class="btn btn-danger btn-sm">
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
        profilesTable.classList.remove("d-none");

    } catch (error) {
        loadingMessage.innerHTML = `<p class="text-danger">Erro: ${error.message}</p>`;
    }
}

fetchProfiles();

function deleteProfile(id) {
    profileIdToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    modal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", async function () {
    if (profileIdToDelete) {
        try {
            const response = await fetch(`${urlBaseApiProfile}/${profileIdToDelete}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }

            alert("Perfil excluído com sucesso!");
            window.location.reload();
        } catch (error) {
            alert(`Erro ao excluir: ${error.message}`);
        }
    }
});