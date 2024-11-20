// script.js
document.addEventListener("DOMContentLoaded", () => {
    const guestForm = document.getElementById("guestForm");
    const guestList = document.getElementById("guestList");
    const totalGuests = document.getElementById("totalGuests");
    const guestListPage = document.getElementById("guestListPage");
    const guestListMenu = document.getElementById("guestListMenu");

    const plannedAmountInput = document.getElementById("plannedAmount");
    const expenseDescriptionInput = document.getElementById("expenseDescription");
    const expenseValueInput = document.getElementById("expenseValue");
    const expenseList = document.getElementById("expenseList");
    const totalPlanned = document.getElementById("totalPlanned");
    const totalSpent = document.getElementById("totalSpent");
    const balance = document.getElementById("balance"); // Elemento para exibir o saldo
    const budgetPage = document.getElementById("budgetPage");
    const budgetMenu = document.getElementById("budgetMenu");
    const addExpenseButton = document.getElementById("addExpenseButton");
    const setPlannedAmountButton = document.getElementById("setPlannedAmountButton");

    const adjustAmountContainer = document.getElementById("adjustAmountContainer");
    const expensesContainer = document.getElementById("expensesContainer");

    const printButton = document.getElementById("printButton"); // Botão de imprimir lista

    let guests = JSON.parse(localStorage.getItem("guests")) || [];
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let plannedAmount = parseFloat(localStorage.getItem("plannedAmount")) || 0;

    // Função para renderizar a lista de convidados
    function renderGuestList() {
        guestList.innerHTML = "";

        guests.sort((a, b) => a.name.localeCompare(b.name));

        guests.forEach((guest, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${guest.name}</td>
                <td><button class="delete-btn" data-index="${index}">Remover</button></td>
            `;
            guestList.appendChild(row);
        });

        updateTotalGuests();

        // Adicionar eventos de remoção
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                guests.splice(index, 1);
                saveGuests();
                renderGuestList();
            });
        });
    }

    // Função para renderizar a lista de despesas
    function renderExpenseList() {
        expenseList.innerHTML = "";

        let totalExpense = 0;

        expenses.forEach((expense, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${expense.description}</td>
                <td>R$ ${expense.value.toFixed(2)}</td>
            `;
            expenseList.appendChild(row);

            totalExpense += expense.value;
        });

        totalSpent.textContent = `Total Gasto: R$ ${totalExpense.toFixed(2)}`;
        totalPlanned.textContent = `Total Planejado: R$ ${plannedAmount.toFixed(2)}`;

        // Calcular e exibir o saldo (Planejado - Gasto)
        const saldo = plannedAmount - totalExpense;
        balance.textContent = `Saldo: R$ ${saldo.toFixed(2)}`;
    }

    // Função para definir o valor planejado
    function setPlannedAmount() {
        const amount = parseFloat(plannedAmountInput.value);

        if (!isNaN(amount) && amount > 0) {
            plannedAmount = amount;
            savePlannedAmount();
            renderExpenseList();

            // Exibir a área de ajuste e despesas
            adjustAmountContainer.style.display = "block";
            expensesContainer.style.display = "block";

            // Limpar o campo de valor planejado
            plannedAmountInput.value = '';
        } else {
            alert("Por favor, insira um valor válido.");
        }
    }

    // Função para imprimir a lista de convidados
    function imprimirLista() {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Lista de Convidados</title></head><body>');
        printWindow.document.write('<h1>Lista de Convidados</h1>');
        printWindow.document.write('<table border="1"><thead><tr><th>#</th><th>Nome</th></tr></thead><tbody>');

        guests.forEach((guest, index) => {
            printWindow.document.write(`
                <tr>
                    <td>${index + 1}</td>
                    <td>${guest.name}</td>
                </tr>
            `);
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    // Salvar lista de convidados
    function saveGuests() {
        localStorage.setItem("guests", JSON.stringify(guests));
    }

    // Salvar despesas
    function saveExpenses() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    // Salvar valor planejado
    function savePlannedAmount() {
        localStorage.setItem("plannedAmount", plannedAmount);
    }

    // Atualizar total de convidados
    function updateTotalGuests() {
        totalGuests.textContent = `Total de Convidados: ${guests.length}`;
    }

    // Adicionar novo convidado
    guestForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;

        guests.push({ name });

        saveGuests();
        renderGuestList();

        guestForm.reset();
    });

    // Adicionar gasto
    addExpenseButton.addEventListener("click", () => {
        const description = expenseDescriptionInput.value;
        const value = parseFloat(expenseValueInput.value);

        if (description && !isNaN(value) && value > 0) {
            expenses.push({ description, value });

            renderExpenseList();

            saveExpenses();
            expenseDescriptionInput.value = '';
            expenseValueInput.value = '';
        } else {
            alert("Preencha todos os campos corretamente.");
        }
    });

    // Alternar para a tela "Lista de Convidados"
    guestListMenu.addEventListener("click", (event) => {
        event.preventDefault();
        guestListPage.style.display = "block";
        budgetPage.style.display = "none";
    });

    // Alternar para a tela "Orçamento"
    budgetMenu.addEventListener("click", (event) => {
        event.preventDefault();
        guestListPage.style.display = "none";
        budgetPage.style.display = "block";
    });

    // Ação do botão de definir valor planejado
    setPlannedAmountButton.addEventListener("click", setPlannedAmount);

    // Ação do botão de imprimir lista
    printButton.addEventListener("click", imprimirLista);

    // Inicializar as telas
    renderGuestList();
    renderExpenseList();
});
