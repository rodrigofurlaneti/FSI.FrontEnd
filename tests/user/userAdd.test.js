/**
 * @jest-environment jsdom
 */

const userAdd = require("../../js/userAdd.js");

global.fetch = jest.fn(); // Mock da API

describe("Testes para loadProfiles", () => {
    let selectProfile;

    beforeEach(() => {
        document.body.innerHTML = `
            <select id="idProfile"></select>
            <form id="userForm">
                <input id="username" type="text" />
                <input id="email" type="email" />
                <input id="password" type="password" />
                <button type="submit">Enviar</button>
            </form>
            <div id="message"></div>
        `;

        selectProfile = document.getElementById("idProfile");
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

        await userAdd.loadProfiles(); // Certifique-se de exportar a função no userAdd.js

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(selectProfile.children.length).toBe(3); // "Selecione um perfil" + 2 perfis
        expect(selectProfile.children[1].textContent).toBe("Administrador");
        expect(selectProfile.children[2].textContent).toBe("Usuário");
    });

    test("Deve exibir mensagem de erro quando a API falhar", async () => {
        fetch.mockResolvedValue({ ok: false, status: 500, statusText: "Erro Interno" });

        await userAdd.loadProfiles();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(selectProfile.innerHTML).toContain("Erro ao carregar perfis");
    });

    test("Deve tratar erros de rede", async () => {
        fetch.mockRejectedValue(new Error("Falha de conexão"));

        await userAdd.loadProfiles();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(selectProfile.innerHTML).toContain("Erro ao carregar perfis");
    });
});
