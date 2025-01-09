let commandIdToDelete = null;

async function fetchCommands() {
  const url = urlBaseApiCommand;
  const loadingMessage = document.getElementById("loadingMessage");
  const commandsTable = document.getElementById("commandsTable");
  const commandsBody = document.getElementById("commandsBody");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const commands = await response.json();

    if (commands.length === 0) {
      loadingMessage.innerHTML =
        "<p class='text-warning'>Nenhuma comanda foi encontrada.</p>";
      return;
    }

    // Criar um array de promessas para buscar os nomes dos usuários
    const userPromises = commands.map(async (command) => {
      try {
        const userResponse = await fetch(`${urlBaseApiUser}/${command.idUser}`);

        if (!userResponse.ok) {
          throw new Error(`Erro ao buscar usuário ${command.idUser}`);
        }

        const userData = await userResponse.json();
        return { ...command, username: userData.username };
      } catch (error) {
        console.error(error);
        return { ...command, username: "Desconhecido" };
      }
    });

    // Aguardar todas as requisições de usuários
    const commandsWithUsers = await Promise.all(userPromises);

    // Gerar as linhas da tabela
    commandsBody.innerHTML = commandsWithUsers
      .map(
        (command) => `
        <tr>
            <td>${command.id}</td>
            <td>${command.idUser}</td>
            <td>${command.username}</td>
            <td>${new Date(command.dateInsert).toLocaleDateString("pt-BR")}</td>
            <td>${new Date(command.dateUpdate).toLocaleDateString("pt-BR")}</td>
            <td>${command.status ? "Ativo" : "Inativo"}</td>
            <td>
                <div class="row justify-content-md-center">
                    <div class="col-sm-6">
                        <a href="commandUpdate.html?id=${
                          command.id
                        }" class="btn btn-warning btn-sm">
                            Atualizar
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise iconText" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg>
                        </a>
                    </div>
                    <div class="col-sm-5">
                        <a href="#" onclick="deleteProduct(${
                          command.id
                        })" class="btn btn-danger btn-sm">
                            Excluir
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x iconText" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </td>
        </tr>
    `
      )
      .join("");

    // Esconder a mensagem de carregamento e exibir a tabela
    loadingMessage.classList.add("d-none");
    commandsTable.classList.remove("d-none");
  } catch (error) {
    loadingMessage.innerHTML = `<p class="text-danger">Erro: ${error.message}</p>`;
  }
}

fetchCommands();

function deleteProduct(id) {
  commandIdToDelete = id;
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  modal.show();
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", async function () {
    if (commandIdToDelete) {
      try {
        const response = await fetch(
          `${urlBaseApiCommand}/${commandIdToDelete}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          throw new Error(
            `Erro na API: ${response.status} ${response.statusText}`
          );
        }

        alert("Comanda foi excluído com sucesso!");
        window.location.reload();
      } catch (error) {
        alert(`Erro ao excluir: ${error.message}`);
      }
    }
  });
