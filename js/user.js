//Tooltip
document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

let userIdToDelete = null;

async function fetchUsers() {
    const url = urlBaseApiUser;
    const loadingMessage = document.getElementById("loadingMessage");
    const usersTable = document.getElementById("usersTable");
    const usersBody = document.getElementById("usersBody");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const users = await response.json();

        if (users.length === 0) {
            loadingMessage.innerHTML = "<p class='text-warning'>Nenhum usuário encontrado.</p>";
            return;
        }

        console.log(users);

        // Criar um array de promessas para buscar os dados adicionais 
        const profilePromises = users.map(async (user) => {
            try {
                const profileResponse = await fetch(`${urlBaseApiProfile}/${user.idProfile}`);

                const profileData = await profileResponse.json();

                return {
                    ...user,
                    nameProfile: profileData.name
                };
            } catch (error) {
                console.error(error);
                return { ...user, nameProfile: "Desconhecido" };
            }
        });

        // Aguardar todas as requisições de usuários
        const usersWithDetails = await Promise.all(profilePromises);

        usersBody.innerHTML = usersWithDetails.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.nameProfile}</td>
                        <td>${user.email}</td>
                        <td>${new Date(user.dateInsert).toLocaleDateString("pt-BR")}</td>
                        <td>${new Date(user.dateUpdate).toLocaleDateString("pt-BR")}</td>
                        <td>${user.status ? 'Ativo' : 'Inativo'}</td>
                        <td>
                            <div class="row justify-content-md-center">
                                <div class="col-sm-6">
                                    <a href="userUpdate.html?id=${user.id}" class="btn btn-warning btn-sm" data-bs-toggle="tooltip" title="Atualizar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                        </svg>
                                    </a>
                                </div>

                                <div class="col-sm-5">
                                    <a href="#" onclick="deleteUser(${user.id})" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" title="Excluir">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x" viewBox="0 0 18 18">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                `).join("");

        loadingMessage.classList.add("d-none");
        usersTable.classList.remove("d-none");

    } catch (error) {
        loadingMessage.innerHTML = `<p class="text-danger">Erro: ${error.message}</p>`;
    }
}

fetchUsers();

function deleteUser(id) {
    userIdToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    modal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", async function () {
    if (userIdToDelete) {
        try {
            const response = await fetch(`${urlBaseApiUser}/${userIdToDelete}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }

            alert("Usuário excluído com sucesso!");
            window.location.reload();
        } catch (error) {
            alert(`Erro ao excluir: ${error.message}`);
        }
    }
});