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
    selectUser.innerHTML = '<option value="">Selecione uma usuário</option>';

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

const apiUrl = urlBaseApiCommand;
const usersApiUrl = urlBaseApiUser; // API de Users
const urlParams = new URLSearchParams(window.location.search);
const commandId = urlParams.get("id");

// Função para carregar os usuários dinamicamente
async function loadUsers() {
  const userSelect = document.getElementById("idUser");

  try {
    const response = await fetch(usersApiUrl);
    if (!response.ok) throw new Error("Erro ao carregar is usuários.");

    const users = await response.json();
    userSelect.innerHTML = `<option value="">Selecione um usuário</option>`;

    users.forEach((user) => {
      userSelect.innerHTML += `<option value="${user.id}">${user.username}</option>`;
    });
  } catch (error) {
    userSelect.innerHTML = `<option value="">Erro ao carregar os usuários</option>`;
    console.error(error);
  }
}

// Função para carregar os dados do comanda
async function loadCommandData() {
  if (!commandId) {
    alert("ID do comanda não encontrado!");
    window.location.href = "command.html";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${commandId}`);
    if (!response.ok) throw new Error("Erro ao carregar comanda.");

    const command = await response.json();

    document.getElementById("commandId").value = command.id;

    await loadUsers(); // Aguarde o carregamento das usuários antes de definir o valor

    if (command.idUser) {
      document.getElementById("idUser").value = command.idUser;
    }
  } catch (error) {
    alert("Erro ao carregar os dados: " + error.message);
  }
}

// Função para atualizar o comanda
document
  .getElementById("updateCommandForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedCommand = {
      id: document.getElementById("commandId").value,
      idUser: parseInt(document.getElementById("idUser").value),
      status: document.getElementById("status").value === "true",
    };

    try {
      const response = await fetch(`${apiUrl}/${commandId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCommand),
      });

      if (!response.ok) throw new Error("Erro ao atualizar comanda.");

      alert("Comanda atualizado com sucesso!");
      window.location.href = "command.html";
    } catch (error) {
      alert("Erro ao salvar alterações: " + error.message);
    }
  });

loadCommandData();
