document
  .getElementById("categoryForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const categoryData = {
      name: document.getElementById("categoryname").value,
      picture: document.getElementById("picture").value,
      description: document.getElementById("description").value,
      dateInsert: new Date().toISOString(),
      dateUpdate: new Date().toISOString(),
      status: true,
    };

    try {
      const response = await fetch(urlBaseApiCategory, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      document.getElementById("message").innerHTML =
        "<p class='text-success'>Categoria cadastrado com sucesso!</p>";

      setTimeout(() => {
        window.location.href = "category.html";
      }, 2000);
    } catch (error) {
      document.getElementById(
        "message"
      ).innerHTML = `<p class='text-danger'>Erro: ${error.message}</p>`;
    }
  });
