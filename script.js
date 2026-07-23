const form = document.getElementById("form");
const list = document.getElementById("list");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");

let chart;

let data = JSON.parse(localStorage.getItem("transactions")) || [];

// Save to Local Storage
function save() {
    localStorage.setItem("transactions", JSON.stringify(data));
}

// Delete Transaction
function deleteTransaction(index) {

    if (confirm("Are you sure you want to delete this transaction?")) {

        data.splice(index, 1);

        render();
    }
}

// Render Everything
function render() {

    let income = 0;
    let expense = 0;

    list.innerHTML = "";

    const cats = {};

    data.forEach((t, i) => {

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;

            cats[t.category] = (cats[t.category] || 0) + t.amount;
        }

        list.innerHTML += `
        <tr>
            <td>${t.title}</td>
            <td>${t.category}</td>
            <td>₹${t.amount}</td>
            <td>
                <button class="delete-btn" onclick="deleteTransaction(${i})">
                    🗑 Delete
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("income").textContent = "₹" + income;
    document.getElementById("expense").textContent = "₹" + expense;
    document.getElementById("balance").textContent = "₹" + (income - expense);

    const ctx = document.getElementById("pieChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(cats),
            datasets: [{
                data: Object.values(cats),
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4bc0c0",
                    "#9966ff",
                    "#ff9f40",
                    "#66bb6a"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });

    save();
}

// Add Transaction
form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (
        title.value.trim() === "" ||
        amount.value.trim() === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    data.push({
        title: title.value,
        amount: Number(amount.value),
        type: type.value,
        category: category.value
    });

    form.reset();

    render();
});

// Initial Render
render();