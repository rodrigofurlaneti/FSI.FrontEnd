async function loadUsers() {
  try {
    const response = await fetch(urlBaseApiUser);

    if (!response.ok) {
      throw new Error(
        `Erro ao carregar usuários: ${response.status} ${response.statusText}`
      );
    }

    const users = await response.json();
    const selectUser = document.getElementById("idUser");

    // Limpar opções anteriores
    selectUser.innerHTML = '<option value="">Selecione um usuário</option>';

    // Preencher o select com as usuários retornadas
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id; // Usa o ID do usuário como valor
      option.textContent = user.username; // Usa o nome do usuário como texto
      selectUser.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao buscar as usuários:", error);
    document.getElementById("idUser").innerHTML =
      '<option value="">Erro ao carregar as usuários</option>';
  }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadUsers);

document
  .getElementById("commandForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const commandData = {
      idUser: parseInt(document.getElementById("idUser").value),
      dateInsert: new Date().toISOString(),
      dateUpdate: new Date().toISOString(),
      status: true,
    };

    try {
      const response = await fetch(urlBaseApiCommand, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commandData),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      document.getElementById("message").innerHTML =
        "<p class='text-success'>Comanda cadastrada com sucesso!</p>";

      setTimeout(() => {
        window.location.href = "command.html";
      }, 2000);
    } catch (error) {
      document.getElementById(
        "message"
      ).innerHTML = `<p class='text-danger'>Erro: ${error.message}</p>`;
    }
  });
