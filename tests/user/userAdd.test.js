/**
 * @jest-environment jsdom
 */

const { loadProfiles, submitUserForm } = require("../../js/userAdd.js");

global.fetch = jest.fn(); // Mock da API

describe("Testes para userAdd.js", () => {
    let selectProfile, form, message;

    beforeEach(() => {
        document.body.innerHTML = `
            <select id="idProfile">
                <option value="">Selecione um perfil</option>
            </select>
            <form id="userForm">
                <input id="username" type="text" value="testuser" />
                <input id="email" type="email" value="test@example.com" />
                <input id="password" type="password" value="password123" />
                <button type="submit">Enviar</button>
            </form>
            <div id="message"></div>
        `;

        selectProfile = document.getElementById("idProfile");
        form = document.getElementById("userForm");
        message = document.getElementById("message");

        jest.restoreAllMocks(); // Limpa mocks anteriores
        global.fetch = jest.fn(); // Reinicializa o mock do fetch
        fetch.mockClear();
    });

    test("Deve carregar perfis e preencher o select", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([
                { id: 1, name: "Administrador" },
                { id: 2, name: "Usuário" }
            ])
        });

        await loadProfiles();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(selectProfile.children.length).toBe(3); // "Selecione um perfil" + 2 perfis
        expect(selectProfile.children[1].textContent).toBe("Administrador");
        expect(selectProfile.children[2].textContent).toBe("Usuário");
    });

    test("Deve exibir mensagem de erro quando a API falhar", async () => {
        fetch.mockResolvedValue({ ok: false, status: 500, statusText: "Erro Interno" });

        await loadProfiles();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(selectProfile.innerHTML).toContain("Erro ao carregar perfis");
    });

    test("Deve tratar erros de rede", async () => {
        fetch.mockRejectedValue(new Error("Falha de conexão"));

        await loadProfiles();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(selectProfile.innerHTML).toContain("Erro ao carregar perfis");
    });

    test("Deve enviar o formulário corretamente", async () => {
        fetch.mockResolvedValue({ ok: true });

        // Simular seleção de perfil
        selectProfile.innerHTML += '<option value="1" selected>Administrador</option>';

        // Criamos um evento de submit e passamos o target como o form
        const event = new Event("submit", { bubbles: true, cancelable: true });

        // Chamamos diretamente a função
        await submitUserForm(event);

        // Valida se fetch foi chamado corretamente
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: expect.any(String)
        }));

        expect(document.getElementById("message").innerHTML).toContain("Usuário cadastrado com sucesso!");
    });

    test("Deve exibir erro ao falhar o envio do formulário", async () => {
        fetch.mockResolvedValue({ ok: false, status: 500, statusText: "Erro Interno" });

        // Simular seleção de perfil
        selectProfile.innerHTML += '<option value="1" selected>Administrador</option>';

        await submitUserForm(new Event("submit"));

        expect(message.innerHTML).toContain("Erro: Erro na API");
    });
});