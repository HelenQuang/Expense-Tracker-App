const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");

const description = document.getElementById("description");
const category = document.getElementById("category");
const amount = document.getElementById("amount");

const historyList = document.getElementById("list");
const transactionForm = document.getElementById("form");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

//Check if there is anything in local storage?
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//Add new transaction
function addTransaction(e) {
  e.preventDefault(); //bc this is a submit event

  if (
    description.value.trim() === "" ||
    category.value.trim() === "" ||
    amount.value.trim() === ""
  ) {
    alert(`Please add new transaction`);
  } else {
    const transaction = {
      id: Math.floor(Math.random() * 100000000),
      description: description.value,
      category: category.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    displayTransaction(transaction);

    updateBalance();

    updateLocalStorage();

    description.value = "";
    category.value = "";
    amount.value = "";
  }
}

//Delete transaction by id
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  init();
}

//Display transaction
function displayTransaction(transaction) {
  //Get sign of amount
  const sign = transaction.amount > 0 ? "+" : "-";

  const item = document.createElement("li");

  //Add class to amount
  item.classList.add(transaction.amount > 0 ? "plus" : "minus");

  //Display to DOM
  item.innerHTML = `
  <strong>${transaction.description}</strong> in ${transaction.category} 
  <span>${sign}${Math.abs(transaction.amount).toFixed(2)}</span> 
  <button class="delete-btn" onClick="deleteTransaction(${transaction.id})">
    <ion-icon name="trash"></ion-icon>  
  </button>
  `;

  //Add to DOM
  historyList.appendChild(item);
}

//Update current balance
function updateBalance() {
  const amountArr = transactions.map((transaction) => transaction.amount);

  //Add up to total amount balance
  const total = amountArr.reduce((acc, item) => (acc += item), 0).toFixed(2);

  //Add up to income and expense
  const income = amountArr
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amountArr
      .filter((item) => item < 0)
      .reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  //Display to DOM
  balance.innerText = `€${total}`;
  moneyPlus.innerText = `€${income}`;
  moneyMinus.innerText = `€${expense}`;
}

// Init app
function init() {
  historyList.innerHTML = "";

  transactions.forEach(displayTransaction);
  updateBalance();
}

init();

//Add event listener
transactionForm.addEventListener("submit", addTransaction);
