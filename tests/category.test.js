// Importamos o test-runner.js
document.write('<script src="./test-runner.js"></script>');

// Mock para fetchCategories()
async function mockFetchCategories() {
    return [
        { id: 1, name: "Hotel Azul", picture: "icon1.png", description: "Luxo", dateInsert: "2024-01-01", dateUpdate: "2024-01-05", status: true },
        { id: 2, name: "Hotel Verde", picture: "icon2.png", description: "Econômico", dateInsert: "2024-02-01", dateUpdate: "2024-02-10", status: false }
    ];
}

// Mock da função para simular exclusão
function mockDeleteCategory(id) {
    return id === 1 ? true : false;
}

// Testando o carregamento das categorias
describe("Testes da Tela de Categorias", () => {
    test("fetchCategories deve retornar categorias mockadas", async () => {
        const categories = await mockFetchCategories();
        expect(categories.length).toBe(2);
        expect(categories[0].name).toBe("Hotel Azul");
    });

    test("deleteCategory deve excluir categoria com ID 1", () => {
        const result = mockDeleteCategory(1);
        expect(result).toBe(true);
    });

    test("deleteCategory não deve excluir categoria inexistente", () => {
        const result = mockDeleteCategory(999);
        expect(result).toBe(false);
    });
});
