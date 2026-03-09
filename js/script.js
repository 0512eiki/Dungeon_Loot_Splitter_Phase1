// Persistent state: one array of loot objects for the whole session.
// The array is the single source of truth for all loot data.
const lootItems = [];

// All DOM access uses getElementById, as required.
const partySizeInput = document.getElementById('partySize');
const partyMessage = document.getElementById('partyMessage');
const lootNameInput = document.getElementById('lootName');
const lootValueInput = document.getElementById('lootValue');
const lootQuantityInput = document.getElementById('lootQuantity');
const addLootBtn = document.getElementById('addLootBtn');
const addLootMessage = document.getElementById('addLootMessage');
const noLootMessage = document.getElementById('noLootMessage');
const lootRows = document.getElementById('lootRows');
const lootTotalsRow = document.getElementById('lootTotalsRow');
const totalLootElement = document.getElementById('totalLoot');
const splitLootBtn = document.getElementById('splitLootBtn');
const splitMessage = document.getElementById('splitMessage');
const finalTotalElement = document.getElementById('finalTotal');
const perMemberElement = document.getElementById('perMember');
const splitResults = document.getElementById('splitResults');

// Register required events.
addLootBtn.addEventListener('click', addLoot);
splitLootBtn.addEventListener('click', splitLoot);
partySizeInput.addEventListener('input', updateUI);

// Render initial blank state.
updateUI();

function addLoot() {
  addLootMessage.textContent = '';

  const name = lootNameInput.value.trim();
  const value = Number(lootValueInput.value);
  const quantity = Number(lootQuantityInput.value);

  // Validate before mutating state.
  if (name === '') {
    addLootMessage.textContent = 'Please enter a Loot Name.';
    return;
  }

  if (lootValueInput.value.trim() === '' || Number.isNaN(value)) {
    addLootMessage.textContent = 'Please enter a valid Loot Value.';
    return;
  }

  if (value < 0) {
    addLootMessage.textContent = 'Loot Value cannot be negative.';
    return;
  }

  if (lootQuantityInput.value.trim() === '' || Number.isNaN(quantity)) {
    addLootMessage.textContent = 'Please enter a valid Quantity.';
    return;
  }

  if (quantity < 1 || !Number.isInteger(quantity)) {
    addLootMessage.textContent = 'Quantity must be 1 or greater.';
    return;
  }

  // Store loot as an object with name, value, and quantity.
  lootItems.push({ name: name, value: value, quantity: quantity });

  lootNameInput.value = '';
  lootValueInput.value = '';
  lootQuantityInput.value = '';
  addLootMessage.textContent = 'Loot added successfully.';

  updateUI();
}

function updateUI() {
  // Clear shared messages before recalculating interface state.
  splitMessage.textContent = '';

  // Read current party size and validate without mutating state.
  const partySizeRaw = partySizeInput.value.trim();
  const partySize = Number(partySizeRaw);
  const partySizeValid = partySizeRaw !== '' && !Number.isNaN(partySize) && partySize >= 1 && Number.isInteger(partySize);

  if (!partySizeValid && partySizeRaw !== '') {
    partyMessage.textContent = 'Party size must be 1 or greater.';
  } else if (partySizeRaw === '') {
    partyMessage.textContent = 'Enter party size to split loot.';
  } else {
    partyMessage.textContent = '';
  }

  // Always re-render the loot list from the array (source of truth).
  lootRows.innerHTML = '';

  if (lootItems.length === 0) {
    noLootMessage.classList.remove('hidden');
    lootTotalsRow.classList.add('hidden');
  } else {
    noLootMessage.classList.add('hidden');
    lootTotalsRow.classList.remove('hidden');
  }

  // Traditional for loop to render loot rows and calculate totals.
  let total = 0;
  for (let i = 0; i < lootItems.length; i += 1) {
    const row = document.createElement('div');
    row.className = 'loot-row';

    const nameCell = document.createElement('div');
    nameCell.className = 'loot-cell';
    nameCell.innerText = lootItems[i].name;

    const valueCell = document.createElement('div');
    valueCell.className = 'loot-cell';
    valueCell.innerText = lootItems[i].value.toFixed(2);

    const quantityCell = document.createElement('div');
    quantityCell.className = 'loot-cell';
    quantityCell.innerText = lootItems[i].quantity;

    const actionCell = document.createElement('div');
    actionCell.className = 'loot-cell loot-actions';

    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Remove';
    removeBtn.addEventListener('click', function () {
      removeLoot(i);
    });

    actionCell.appendChild(removeBtn);

    row.appendChild(nameCell);
    row.appendChild(valueCell);
    row.appendChild(quantityCell);
    row.appendChild(actionCell);

    lootRows.appendChild(row);

    total += lootItems[i].value * lootItems[i].quantity;
  }

  totalLootElement.textContent = total.toFixed(2);
  finalTotalElement.textContent = total.toFixed(2);

  const hasLoot = lootItems.length > 0;
  const canSplit = hasLoot && partySizeValid;

  splitLootBtn.disabled = !canSplit;

  if (canSplit) {
    const splitValue = total / partySize;
    perMemberElement.textContent = splitValue.toFixed(2);
    splitResults.classList.remove('hidden');
  } else {
    perMemberElement.textContent = '0.00';
    splitResults.classList.add('hidden');
  }
}

function splitLoot() {
  // Split button does not calculate; it simply triggers a refresh from state.
  updateUI();
}

function removeLoot(index) {
  // Remove the correct item using splice() and immediately re-render.
  lootItems.splice(index, 1);
  updateUI();
}
