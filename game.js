const MAX_ATTEMPTS = 7;
const VERSION_CONFIGS = {
  europe: {
    id: 'europe',
    title: 'Seven Countries',
    homepageTitle: 'Europe',
    subtitle: 'Guess the European country in 7 tries',
    dataFile: 'data/european-countries.json',
    entityName: 'country',
    inputPlaceholder: 'Enter country name...',
    statsKey: 'sevenCountriesStats:europe',
    legacyStatsKey: 'sevenCountriesStats',
    dailySeedOffset: 11,
    columns: [
      { key: 'name', label: 'Country', type: 'name' },
      { key: 'area', label: 'Size', type: 'area' },
      { key: 'population', label: 'Popu-<br>lation', type: 'population' },
      { key: 'density', label: 'Population<br>Density', type: 'density', derived: true },
      { key: 'gdpPerCapita', label: 'GDP Per<br>Capita', type: 'gdpPerCapita' },
      { key: 'medianAge', label: 'Age', type: 'medianAge' },
      { key: 'happiness', label: 'Hap-<br>piness', type: 'happiness' },
      { key: 'position', label: 'Posi-<br>tion', type: 'geoPosition' }
    ]
  },
  states: {
    id: 'states',
    title: 'Seven States',
    homepageTitle: 'US States',
    subtitle: 'Guess the US state in 7 tries',
    dataFile: 'data/us-states.json',
    entityName: 'state',
    inputPlaceholder: 'Enter state name...',
    statsKey: 'sevenCountriesStats:states',
    dailySeedOffset: 23,
    columns: [
      { key: 'name', label: 'State', type: 'name' },
      { key: 'area', label: 'Size', type: 'area' },
      { key: 'population', label: 'Popu-<br>lation', type: 'population' },
      { key: 'density', label: 'Population<br>Density', type: 'density', derived: true },
      { key: 'gdpPerCapita', label: 'GDP Per<br>Capita', type: 'gdpPerCapita' },
      { key: 'medianAge', label: 'Age', type: 'medianAge' },
      { key: 'happiness', label: 'Hap-<br>piness', type: 'happiness' },
      { key: 'position', label: 'Posi-<br>tion', type: 'geoPosition' }
    ]
  },
  asia: {
    id: 'asia',
    title: 'Seven Asia',
    homepageTitle: 'Asia',
    subtitle: 'Guess the Asian country in 7 tries',
    dataFile: 'data/asia-countries.json',
    entityName: 'country',
    inputPlaceholder: 'Enter country name...',
    statsKey: 'sevenCountriesStats:asia',
    dailySeedOffset: 37,
    columns: [
      { key: 'name', label: 'Country', type: 'name' },
      { key: 'area', label: 'Size', type: 'area' },
      { key: 'population', label: 'Popu-<br>lation', type: 'population' },
      { key: 'density', label: 'Population<br>Density', type: 'density', derived: true },
      { key: 'gdpPerCapita', label: 'GDP Per<br>Capita', type: 'gdpPerCapita' },
      { key: 'medianAge', label: 'Age', type: 'medianAge' },
      { key: 'happiness', label: 'Hap-<br>piness', type: 'happiness' },
      { key: 'position', label: 'Posi-<br>tion', type: 'geoPosition' }
    ]
  },
  capitals: {
    id: 'capitals',
    title: 'Seven Capitals',
    homepageTitle: 'Capitals',
    subtitle: 'Guess the world capital in 7 tries',
    dataFile: 'data/world-capitals.json',
    entityName: 'capital',
    inputPlaceholder: 'Enter capital city...',
    statsKey: 'sevenCountriesStats:capitals',
    dailySeedOffset: 41,
    columns: [
      { key: 'name', label: 'Capital', type: 'name' },
      { key: 'area', label: 'Size', type: 'area' },
      { key: 'population', label: 'Popu-<br>lation', type: 'population' },
      { key: 'density', label: 'Population<br>Density', type: 'density', derived: true },
      { key: 'gdpPerCapita', label: 'GDP Per<br>Capita', type: 'gdpPerCapita' },
      { key: 'medianAge', label: 'Age', type: 'medianAge' },
      { key: 'altitude', label: 'Alti-<br>tude', type: 'altitude' },
      { key: 'position', label: 'Posi-<br>tion', type: 'geoPosition' }
    ],
    answerDetails: (item) => item.country
  },
  elements: {
    id: 'elements',
    title: 'Seven Elements',
    homepageTitle: 'Chemical Elements',
    subtitle: 'Guess the chemical element in 7 tries',
    dataFile: 'data/chemical-elements.json',
    entityName: 'element',
    inputPlaceholder: 'Enter element name...',
    statsKey: 'sevenCountriesStats:elements',
    dailySeedOffset: 53,
    columns: [
      { key: 'name', label: 'Element', type: 'name' },
      { key: 'symbol', label: 'Sym-<br>bol', type: 'symbol' },
      { key: 'atomicNumber', label: 'Atomic<br>No.', type: 'atomicNumber' },
      { key: 'atomicMass', label: 'Atomic<br>Mass', type: 'atomicMass' },
      { key: 'density', label: 'Den-<br>sity', type: 'elementDensity' },
      { key: 'meltingPoint', label: 'Melt-<br>ing Pt', type: 'meltingPoint' },
      { key: 'boilingPoint', label: 'Boil-<br>ing Pt', type: 'boilingPoint' },
      { key: 'position', label: 'Posi-<br>tion', type: 'tablePosition' }
    ],
    answerDetails: (item) => `${item.symbol} - Period ${item.period}, Group ${item.group}`
  }
};

const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0
};

let versionId = 'europe';
let currentVersion = VERSION_CONFIGS[versionId];
let entries = [];
let targetEntry = null;
let guesses = [];
let hintsRemaining = MAX_ATTEMPTS;
let attempts = 0;
let gameOver = false;
let gameMode = 'daily';
let stats = { ...DEFAULT_STATS };

const titleEl = document.getElementById('game-title');
const subtitleEl = document.getElementById('game-subtitle');
const versionSelector = document.getElementById('version-selector');
const tableHeader = document.getElementById('hint-header');
const input = document.getElementById('country-input');
const suggestions = document.getElementById('suggestions');
const submitBtn = document.getElementById('submit-btn');
const diceBtn = document.getElementById('dice-btn');
const guessesContainer = document.getElementById('guesses-container');
const hintCountEl = document.getElementById('hint-count');
const attemptCountEl = document.getElementById('attempt-count');
const gameOverEl = document.getElementById('game-over');
const resultMessage = document.getElementById('result-message');
const correctAnswer = document.getElementById('correct-answer');
const playAgainBtn = document.getElementById('play-again-btn');
const dailyBtn = document.getElementById('daily-btn');
const unlimitedBtn = document.getElementById('unlimited-btn');
const statsPanel = document.getElementById('stats-panel');

function cloneDefaultStats() {
  return { ...DEFAULT_STATS };
}

function getCurrentColumns() {
  return currentVersion.columns;
}

function renderVersionSelector() {
  versionSelector.innerHTML = Object.values(VERSION_CONFIGS).map((version) => `
    <button class="version-card${version.id === versionId ? ' active' : ''}" data-version="${version.id}">
      <span class="version-card-title">${version.homepageTitle}</span>
      <span class="version-card-subtitle">${version.subtitle}</span>
    </button>
  `).join('');

  versionSelector.querySelectorAll('.version-card').forEach((button) => {
    button.addEventListener('click', () => switchVersion(button.dataset.version));
  });
}

function renderHeader() {
  titleEl.textContent = currentVersion.title;
  subtitleEl.textContent = currentVersion.subtitle;
  input.placeholder = currentVersion.inputPlaceholder;

  const row = document.createElement('div');
  row.className = 'hint-row header';

  getCurrentColumns().forEach((column) => {
    const cell = document.createElement('div');
    cell.className = 'hint-cell';
    cell.innerHTML = column.label;
    row.appendChild(cell);
  });

  tableHeader.innerHTML = '';
  tableHeader.appendChild(row);
}

async function loadEntries() {
  const response = await fetch(currentVersion.dataFile);
  entries = await response.json();
}

function loadStats() {
  const saved = localStorage.getItem(currentVersion.statsKey);
  const legacy = currentVersion.legacyStatsKey ? localStorage.getItem(currentVersion.legacyStatsKey) : null;
  const source = saved || legacy;

  if (source) {
    try {
      stats = { ...cloneDefaultStats(), ...JSON.parse(source) };
    } catch (error) {
      console.error('Error parsing saved stats:', error);
      stats = cloneDefaultStats();
    }
  } else {
    stats = cloneDefaultStats();
  }

  updateStatsDisplay();
}

function saveStats() {
  localStorage.setItem(currentVersion.statsKey, JSON.stringify(stats));
}

function updateStatsDisplay() {
  document.getElementById('games-played').textContent = stats.gamesPlayed;
  document.getElementById('win-rate').textContent = stats.gamesPlayed > 0
    ? `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%`
    : '0%';
  document.getElementById('current-streak').textContent = stats.currentStreak;
  document.getElementById('max-streak').textContent = stats.maxStreak;
}

function getDailySeed() {
  const today = new Date();
  return (today.getFullYear() * 10000) + ((today.getMonth() + 1) * 100) + today.getDate() + currentVersion.dailySeedOffset;
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function selectTargetEntry() {
  if (gameMode === 'daily') {
    const seed = getDailySeed();
    const index = Math.floor(seededRandom(seed) * entries.length);
    return entries[index];
  }

  return entries[Math.floor(Math.random() * entries.length)];
}

function startGame() {
  targetEntry = selectTargetEntry();
  guesses = [];
  hintsRemaining = MAX_ATTEMPTS;
  attempts = 0;
  gameOver = false;

  updateUI();
  guessesContainer.innerHTML = '';
  gameOverEl.classList.add('hidden');
  playAgainBtn.classList.add('hidden');
  statsPanel.classList.remove('hidden');
  input.value = '';
  input.disabled = false;
  submitBtn.disabled = false;
  diceBtn.disabled = false;
}

function switchVersion(nextVersionId) {
  if (!VERSION_CONFIGS[nextVersionId] || nextVersionId === versionId) {
    return;
  }

  versionId = nextVersionId;
  currentVersion = VERSION_CONFIGS[versionId];
  initializeVersion().catch((error) => {
    console.error('Error switching version:', error);
  });
}

async function initializeVersion() {
  renderVersionSelector();
  renderHeader();
  await loadEntries();
  loadStats();
  startGame();
}

function calculateDensity(entry) {
  return entry.population / entry.area;
}

function getComparisonClass(value, target, thresholds = { much: 2, similar: 0.1 }) {
  const ratio = value / target;

  if (ratio < (1 - thresholds.similar) * 0.5) return 'much-smaller';
  if (ratio < (1 - thresholds.similar)) return 'smaller';
  if (ratio <= (1 + thresholds.similar)) return 'similar';
  if (ratio <= thresholds.much) return 'larger';
  return 'much-larger';
}

function getComparisonText(value, target, thresholds = { much: 2, similar: 0.1 }, type = 'default') {
  const ratio = value / target;

  let muchSmaller;
  let smaller;
  let larger;
  let muchLarger;

  switch (type) {
    case 'size':
      muchSmaller = 'Much Smaller';
      smaller = 'Smaller';
      larger = 'Bigger';
      muchLarger = 'Much Bigger';
      break;
    case 'age':
      muchSmaller = 'Much Younger';
      smaller = 'Younger';
      larger = 'Older';
      muchLarger = 'Much Older';
      break;
    case 'happiness':
      muchSmaller = 'Much Unhappier';
      smaller = 'Unhappier';
      larger = 'Happier';
      muchLarger = 'Much Happier';
      break;
    case 'gdp':
      muchSmaller = 'Much Poorer';
      smaller = 'Poorer';
      larger = 'Richer';
      muchLarger = 'Much Richer';
      break;
    case 'density':
      muchSmaller = 'Much Sparser';
      smaller = 'Sparser';
      larger = 'Denser';
      muchLarger = 'Much Denser';
      break;
    case 'altitude':
      muchSmaller = 'Much Lower';
      smaller = 'Lower';
      larger = 'Higher';
      muchLarger = 'Much Higher';
      break;
    case 'mass':
      muchSmaller = 'Much Lighter';
      smaller = 'Lighter';
      larger = 'Heavier';
      muchLarger = 'Much Heavier';
      break;
    case 'temperature':
      muchSmaller = 'Much Colder';
      smaller = 'Colder';
      larger = 'Hotter';
      muchLarger = 'Much Hotter';
      break;
    default:
      muchSmaller = 'Much Smaller';
      smaller = 'Smaller';
      larger = 'Larger';
      muchLarger = 'Much Larger';
  }

  if (ratio < (1 - thresholds.similar) * 0.5) return muchSmaller;
  if (ratio < (1 - thresholds.similar)) return smaller;
  if (ratio <= (1 + thresholds.similar)) return 'Similar';
  if (ratio <= thresholds.much) return larger;
  return muchLarger;
}

function buildDirection(latDiff, lngDiff) {
  let direction = '';

  if (latDiff > 0) direction += 'N';
  else if (latDiff < 0) direction += 'S';

  if (lngDiff > 0) direction += 'E';
  else if (lngDiff < 0) direction += 'W';

  return direction || 'Same';
}

function getGeoDirection(guess, target) {
  const latDiff = Math.abs(target.lat - guess.lat) > 5 ? target.lat - guess.lat : 0;
  const lngDiff = Math.abs(target.lng - guess.lng) > 5 ? target.lng - guess.lng : 0;
  return buildDirection(latDiff, lngDiff);
}

function getTableDirection(guess, target) {
  const verticalDiff = target.period === guess.period ? 0 : target.period - guess.period;
  const horizontalDiff = target.group === guess.group ? 0 : target.group - guess.group;
  return buildDirection(-verticalDiff, horizontalDiff).replace('N', 'U').replace('S', 'D');
}

function getNameLetterState(name, solution) {
  const remaining = {};
  const normalizedSolution = solution.toLowerCase();

  for (const char of normalizedSolution) {
    if (!/[a-z0-9]/.test(char)) continue;
    remaining[char] = (remaining[char] || 0) + 1;
  }

  return Array.from(name).map((char) => {
    const lower = char.toLowerCase();
    if (!/[a-z0-9]/.test(lower)) {
      return { char, match: false };
    }

    if (remaining[lower] > 0) {
      remaining[lower] -= 1;
      return { char, match: true };
    }

    return { char, match: false };
  });
}

function renderHighlightedName(name, solution) {
  return getNameLetterState(name, solution).map(({ char, match }) => {
    const safeChar = char === ' ' ? '&nbsp;' : char;
    return `<span class="guess-letter${match ? ' partial-match' : ''}">${safeChar}</span>`;
  }).join('');
}

function getEntryByName(name) {
  return entries.find((entry) => entry.name.toLowerCase() === name.toLowerCase().trim());
}

function showSuggestions(query) {
  if (!query) {
    suggestions.classList.remove('visible');
    return;
  }

  const filtered = entries
    .filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))
    .filter((entry) => !guesses.some((guess) => guess.toLowerCase() === entry.name.toLowerCase()))
    .slice(0, 6);

  if (filtered.length === 0) {
    suggestions.classList.remove('visible');
    return;
  }

  suggestions.innerHTML = filtered.map((entry) => `
    <div class="suggestion-item" data-name="${entry.name}">${entry.name}</div>
  `).join('');
  suggestions.classList.add('visible');

  suggestions.querySelectorAll('.suggestion-item').forEach((item) => {
    item.addEventListener('click', () => {
      input.value = item.dataset.name;
      suggestions.classList.remove('visible');
    });
  });
}

function makeGuess(entryName) {
  if (gameOver || attempts >= MAX_ATTEMPTS) return;

  if (!entryName || entryName.trim() === '') {
    alert(`Please enter a ${currentVersion.entityName} name!`);
    return;
  }

  const guessedEntry = getEntryByName(entryName);

  if (!guessedEntry) {
    alert(`${currentVersion.entityName[0].toUpperCase()}${currentVersion.entityName.slice(1)} not found in the list!`);
    return;
  }

  if (guesses.some((guess) => guess.toLowerCase() === guessedEntry.name.toLowerCase())) {
    alert(`You already guessed this ${currentVersion.entityName}!`);
    return;
  }

  guesses.push(guessedEntry.name);
  attempts += 1;

  const isCorrect = guessedEntry.name === targetEntry.name;

  if (isCorrect) {
    endGame(true);
  } else if (attempts >= MAX_ATTEMPTS) {
    endGame(false);
  }

  updateUI();
  renderGuess(guessedEntry, !isCorrect);
}

function revealHint(guessIndex, hintType) {
  if (hintsRemaining <= 0 || gameOver) return;

  hintsRemaining -= 1;
  updateUI();

  const hintCell = document.querySelector(`[data-guess="${guessIndex}"][data-hint="${hintType}"]`);
  if (hintCell) {
    const guessedEntry = getEntryByName(guesses[guessIndex]);
    hintCell.classList.remove('unrevealed');
    updateHintCell(hintCell, guessedEntry, hintType);
  }
}

function setDirectionCell(cell, direction) {
  cell.innerHTML = direction;
  if (direction === 'Same') {
    cell.classList.add('correct');
    return;
  }

  cell.classList.add('direction');
  cell.classList.add(`dir-${direction.toLowerCase()}`);
}

function updateHintCell(cell, guessedEntry, hintType) {
  const guessDensity = guessedEntry.area ? calculateDensity(guessedEntry) : null;
  const targetDensity = targetEntry.area ? calculateDensity(targetEntry) : null;

  let text = '';
  let className = '';

  switch (hintType) {
    case 'area':
      text = getComparisonText(targetEntry.area, guessedEntry.area, { much: 2, similar: 0.1 }, 'size');
      className = getComparisonClass(targetEntry.area, guessedEntry.area);
      break;
    case 'population':
      text = getComparisonText(targetEntry.population, guessedEntry.population);
      className = getComparisonClass(targetEntry.population, guessedEntry.population);
      break;
    case 'density':
      text = getComparisonText(targetDensity, guessDensity, { much: 2, similar: 0.1 }, 'density');
      className = getComparisonClass(targetDensity, guessDensity);
      break;
    case 'gdpPerCapita':
      text = getComparisonText(targetEntry.gdpPerCapita, guessedEntry.gdpPerCapita, { much: 2, similar: 0.1 }, 'gdp');
      className = getComparisonClass(targetEntry.gdpPerCapita, guessedEntry.gdpPerCapita);
      break;
    case 'medianAge':
      text = getComparisonText(targetEntry.medianAge, guessedEntry.medianAge, { much: 1.2, similar: 0.15 }, 'age');
      className = getComparisonClass(targetEntry.medianAge, guessedEntry.medianAge, { much: 1.2, similar: 0.15 });
      break;
    case 'happiness':
      text = getComparisonText(targetEntry.happiness, guessedEntry.happiness, { much: 1.3, similar: 0.1 }, 'happiness');
      className = getComparisonClass(targetEntry.happiness, guessedEntry.happiness, { much: 1.3, similar: 0.1 });
      break;
    case 'altitude':
      text = getComparisonText(targetEntry.altitude, guessedEntry.altitude, { much: 1.5, similar: 0.15 }, 'altitude');
      className = getComparisonClass(targetEntry.altitude, guessedEntry.altitude, { much: 1.5, similar: 0.15 });
      break;
    case 'symbol':
      text = guessedEntry.symbol === targetEntry.symbol ? 'Match' : guessedEntry.symbol;
      className = guessedEntry.symbol === targetEntry.symbol ? 'correct' : 'smaller';
      break;
    case 'atomicNumber':
      text = getComparisonText(targetEntry.atomicNumber, guessedEntry.atomicNumber, { much: 1.5, similar: 0.05 });
      className = getComparisonClass(targetEntry.atomicNumber, guessedEntry.atomicNumber, { much: 1.5, similar: 0.05 });
      break;
    case 'atomicMass':
      text = getComparisonText(targetEntry.atomicMass, guessedEntry.atomicMass, { much: 1.5, similar: 0.03 }, 'mass');
      className = getComparisonClass(targetEntry.atomicMass, guessedEntry.atomicMass, { much: 1.5, similar: 0.03 });
      break;
    case 'elementDensity':
      text = getComparisonText(targetEntry.density, guessedEntry.density, { much: 1.5, similar: 0.08 }, 'density');
      className = getComparisonClass(targetEntry.density, guessedEntry.density, { much: 1.5, similar: 0.08 });
      break;
    case 'meltingPoint':
      text = getComparisonText(targetEntry.meltingPoint, guessedEntry.meltingPoint, { much: 1.5, similar: 0.08 }, 'temperature');
      className = getComparisonClass(targetEntry.meltingPoint, guessedEntry.meltingPoint, { much: 1.5, similar: 0.08 });
      break;
    case 'boilingPoint':
      text = getComparisonText(targetEntry.boilingPoint, guessedEntry.boilingPoint, { much: 1.5, similar: 0.08 }, 'temperature');
      className = getComparisonClass(targetEntry.boilingPoint, guessedEntry.boilingPoint, { much: 1.5, similar: 0.08 });
      break;
    case 'geoPosition':
      setDirectionCell(cell, getGeoDirection(guessedEntry, targetEntry));
      return;
    case 'tablePosition':
      setDirectionCell(cell, getTableDirection(guessedEntry, targetEntry));
      return;
    default:
      text = '';
  }

  cell.innerHTML = text;
  if (className) {
    cell.classList.add(className);
  }
}

function renderGuess(guessedEntry, showHints = true) {
  const guessIndex = guesses.length - 1;
  const isFirstGuess = attempts === 1;
  const row = document.createElement('div');
  row.className = 'hint-row';

  const columns = getCurrentColumns();
  const hintColumns = columns.slice(1);

  const nameCell = document.createElement('div');
  nameCell.className = 'hint-cell country-name';
  nameCell.innerHTML = renderHighlightedName(guessedEntry.name, targetEntry.name);
  row.appendChild(nameCell);

  let freeHintIndex = -1;
  if (!isFirstGuess && showHints) {
    freeHintIndex = Math.floor(Math.random() * hintColumns.length);
  }

  hintColumns.forEach((column) => {
    const cell = document.createElement('div');
    cell.className = 'hint-cell';
    cell.dataset.guess = guessIndex;
    cell.dataset.hint = column.type;

    if (isFirstGuess || !showHints) {
      updateHintCell(cell, guessedEntry, column.type);
    } else {
      cell.classList.add('unrevealed');
      cell.textContent = '?';
      cell.addEventListener('click', () => revealHint(guessIndex, column.type));
    }

    row.appendChild(cell);
  });

  guessesContainer.appendChild(row);

  if (!isFirstGuess && showHints && freeHintIndex >= 0) {
    const unrevealedCells = Array.from(row.querySelectorAll('.hint-cell.unrevealed'));
    if (unrevealedCells.length > 0) {
      const randomCell = unrevealedCells[freeHintIndex % unrevealedCells.length];
      randomCell.classList.remove('unrevealed');
      updateHintCell(randomCell, guessedEntry, randomCell.dataset.hint);
    }
  }
}

function updateUI() {
  hintCountEl.textContent = hintsRemaining;
  attemptCountEl.textContent = MAX_ATTEMPTS - attempts;
}

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  submitBtn.disabled = true;
  diceBtn.disabled = true;

  stats.gamesPlayed += 1;
  if (won) {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
    resultMessage.textContent = 'Congratulations!';
    resultMessage.className = 'win';
  } else {
    stats.currentStreak = 0;
    resultMessage.textContent = 'Game Over';
    resultMessage.className = 'lose';
  }

  saveStats();
  updateStatsDisplay();

  correctAnswer.innerHTML = `The answer was`;
  const answerDiv = document.createElement('div');
  answerDiv.className = 'answer';
  answerDiv.textContent = targetEntry.name;
  correctAnswer.appendChild(answerDiv);

  if (typeof currentVersion.answerDetails === 'function') {
    const detailDiv = document.createElement('div');
    detailDiv.className = 'answer-detail';
    detailDiv.textContent = currentVersion.answerDetails(targetEntry);
    correctAnswer.appendChild(detailDiv);
  }

  if (gameMode === 'unlimited') {
    playAgainBtn.classList.remove('hidden');
  }

  gameOverEl.classList.remove('hidden');
}

input.addEventListener('input', (event) => showSuggestions(event.target.value));

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    suggestions.classList.remove('visible');
    makeGuess(input.value);
    input.value = '';
  }
});

submitBtn.addEventListener('click', () => {
  makeGuess(input.value);
  input.value = '';
  suggestions.classList.remove('visible');
});

diceBtn.addEventListener('click', () => {
  const availableEntries = entries.filter((entry) => !guesses.includes(entry.name));
  if (availableEntries.length === 0) {
    alert(`No more ${currentVersion.entityName}s to guess!`);
    return;
  }

  const randomEntry = availableEntries[Math.floor(Math.random() * availableEntries.length)];
  input.value = randomEntry.name;
});

dailyBtn.addEventListener('click', () => {
  if (gameMode === 'daily') return;
  gameMode = 'daily';
  dailyBtn.classList.add('active');
  unlimitedBtn.classList.remove('active');
  startGame();
});

unlimitedBtn.addEventListener('click', () => {
  if (gameMode === 'unlimited') return;
  gameMode = 'unlimited';
  unlimitedBtn.classList.add('active');
  dailyBtn.classList.remove('active');
  startGame();
});

playAgainBtn.addEventListener('click', () => {
  startGame();
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.input-section')) {
    suggestions.classList.remove('visible');
  }
});

initializeVersion().catch((error) => {
  console.error('Error loading game data:', error);
});

