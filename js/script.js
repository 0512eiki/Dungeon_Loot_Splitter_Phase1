// Persistent state: one array of loot objects for the whole session.
const lootItems = [];

// All DOM access uses getElementById, as required.
const partySizeInput = document.getElementById('partySize');
const partyMessage = document.getElementById('partyMessage');
const lootNameInput = document.getElementById('lootName');
const lootValueInput = document.getElementById('lootValue');
const addLootBtn = document.getElementById('addLootBtn');
const addLootMessage = document.getElementById('addLootMessage');
const lootListElement = document.getElementById('lootList');
const emptyLootMessage = document.getElementById('emptyLootMessage');
const runningTotalElement = document.getElementById('runningTotal');
const splitLootBtn = document.getElementById('splitLootBtn');
const splitMessage = document.getElementById('splitMessage');
const finalTotalElement = document.getElementById('finalTotal');
const perMemberElement = document.getElementById('perMember');

// Register required events.
addLootBtn.addEventListener('click', addLoot);
splitLootBtn.addEventListener('click', splitLoot);

// Render initial blank state.
renderLoot();

function addLoot() {
  addLootMessage.textContent = '';
  splitMessage.textContent = '';

  const name = lootNameInput.value.trim();
  const value = Number(lootValueInput.value);

  // Validate before pushing into the array.
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

  // Store loot as an object with name and value.
  lootItems.push({ name: name, value: value });

  lootNameInput.value = '';
  lootValueInput.value = '';
  addLootMessage.textContent = 'Loot added successfully.';

  renderLoot();
}

function renderLoot() {
  lootListElement.innerHTML = '';

  if (lootItems.length === 0) {
    emptyLootMessage.textContent = 'No loot entered yet.';
  } else {
    emptyLootMessage.textContent = '';
  }

  // Traditional for loop to render loot items.
  for (let i = 0; i < lootItems.length; i += 1) {
    const li = document.createElement('li');
    li.textContent = lootItems[i].name + ': $' + lootItems[i].value.toFixed(2);
    lootListElement.appendChild(li);
  }

  const total = calculateTotalLoot();
  runningTotalElement.textContent = total.toFixed(2);
  finalTotalElement.textContent = total.toFixed(2);
}

function calculateTotalLoot() {
  let total = 0;

  // Traditional for loop to calculate total loot.
  for (let i = 0; i < lootItems.length; i += 1) {
    total += lootItems[i].value;
  }

  return total;
}

function splitLoot() {
  splitMessage.textContent = '';
  partyMessage.textContent = '';

  const partySize = Number(partySizeInput.value);

  if (Number.isNaN(partySize) || partySize < 1) {
    partyMessage.textContent = 'Party size must be 1 or greater.';
    return;
  }

  if (lootItems.length === 0) {
    splitMessage.textContent = 'No loot entered. Add loot before splitting.';
    return;
  }

  const total = calculateTotalLoot();
  const splitValue = total / partySize;

  finalTotalElement.textContent = total.toFixed(2);
  perMemberElement.textContent = splitValue.toFixed(2);
}
