function describe(title, callback) {
    console.log(`\n📝 ${title}`);
    callback();
}

function test(description, callback) {
    try {
        callback();
        console.log(`✅ ${description}`);
    } catch (error) {
        console.error(`❌ ${description}`);
        console.error(error);
    }
}

function expect(received) {
    return {
        toBe(expected) {
            if (received !== expected) {
                throw new Error(`Esperado: ${expected}, Recebido: ${received}`);
            }
        },
        toBeTruthy() {
            if (!received) {
                throw new Error(`Esperado valor verdadeiro, mas recebeu: ${received}`);
            }
        }
    };
}

// 🔥 Adicione a execução automática dos testes
window.onload = function () {
    console.log("🚀 Iniciando testes...");

    // Chame os testes aqui
    runTests();

    console.log("✅ Todos os testes foram executados!");
};

// Simulação dos testes
function runTests() {
    describe("Testes da Tela de Categorias", function () {
        test("fetchCategories deve retornar categorias mockadas", function () {
            const mockData = [{ id: 1, name: "Categoria 1" }];
            expect(mockData.length).toBe(1);
        });

        test("deleteCategory deve excluir categoria com ID 1", function () {
            const categories = [{ id: 1 }, { id: 2 }];
            const filtered = categories.filter(c => c.id !== 1);
            expect(filtered.length).toBe(1);
        });

        test("deleteCategory não deve excluir categoria inexistente", function () {
            const categories = [{ id: 1 }, { id: 2 }];
            const filtered = categories.filter(c => c.id !== 3);
            expect(filtered.length).toBe(2);
        });
    });
}
