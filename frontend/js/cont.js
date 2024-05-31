let counts = [0, 0, 0, 0, 0, 0];
const maxCount = 10;

function increment(counter) {
    if (counts[counter - 1] < maxCount) {
        counts[counter - 1]++;
        updateCount(counter);
    }
}

function decrement(counter) {
    if (counts[counter - 1] > 0) {
        counts[counter - 1]--;
        updateCount(counter);
    }
}

function updateCount(counter) {
    document.getElementById(`count${counter}`).innerText = counts[counter - 1];
    updateButtons(counter);
}

function updateButtons(counter) {
    document.querySelector(`#counter${counter} .increment`).disabled = counts[counter - 1] >= maxCount;
    document.querySelector(`#counter${counter} .decrement`).disabled = counts[counter - 1] <= 0;
}

function accept(counter) {
    alert(`Contador ${counter} aceptado con valor: ${counts[counter - 1]}`);
}

// Initialize button states
for (let i = 1; i <= counts.length; i++) {
    updateButtons(i);
}
