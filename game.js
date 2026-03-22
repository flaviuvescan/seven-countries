let countries = [];
let targetCountry = null;
let guesses = [];
let hintsRemaining = 7;
let attempts = 0;
let gameOver = false;
let gameMode = 'daily';
let stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0
};

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

async function loadCountries() {
  try {
    const response = await fetch('data/european-countries.json');
    countries = await response.json();
    loadStats();
    startGame();
  } catch (error) {
    console.error('Error loading countries:', error);
  }
}

function loadStats() {
  const saved = localStorage.getItem('sevenCountriesStats');
  if (saved) {
    stats = JSON.parse(saved);
    updateStatsDisplay();
  }
}

function saveStats() {
  localStorage.setItem('sevenCountriesStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
  document.getElementById('games-played').textContent = stats.gamesPlayed;
  document.getElementById('win-rate').textContent = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) + '%' 
    : '0%';
  document.getElementById('current-streak').textContent = stats.currentStreak;
  document.getElementById('max-streak').textContent = stats.maxStreak;
}

function getDailySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function selectTargetCountry() {
  if (gameMode === 'daily') {
    const seed = getDailySeed();
    const index = Math.floor(seededRandom(seed) * countries.length);
    return countries[index];
  } else {
    return countries[Math.floor(Math.random() * countries.length)];
  }
}

function startGame() {
  targetCountry = selectTargetCountry();
  guesses = [];
  hintsRemaining = 7;
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

function calculateDensity(country) {
  return country.population / country.area;
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
  
  let muchSmaller, smaller, larger, muchLarger;
  
  switch (type) {
    case 'age':
      muchSmaller = 'Much Younger';
      smaller = 'Younger';
      larger = 'Older';
      muchLarger = 'Much Older';
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

function getDirection(lat1, lng1, lat2, lng2) {
  let latDiff = lat2 - lat1;
  let lngDiff = lng2 - lng1;
  
  let direction = '';
  if (latDiff > 5) direction += 'N';
  else if (latDiff < -5) direction += 'S';
  
  if (lngDiff > 5) direction += 'E';
  else if (lngDiff < -5) direction += 'W';
  
  if (!direction) direction = 'Same';
  return direction;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatDistance(km) {
  if (km < 100) return Math.round(km) + ' km';
  if (km < 1000) return Math.round(km / 10) * 10 + ' km';
  return Math.round(km / 100) / 10 + 'k km';
}

function showSuggestions(query) {
  if (!query) {
    suggestions.classList.remove('visible');
    return;
  }

  const filtered = countries
    .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    .filter(c => !guesses.some(g => g.toLowerCase() === c.name.toLowerCase()))
    .slice(0, 5);

  if (filtered.length === 0) {
    suggestions.classList.remove('visible');
    return;
  }

  suggestions.innerHTML = filtered.map(c =>
    `<div class="suggestion-item" data-name="${c.name}">${c.name}</div>`
  ).join('');
  suggestions.classList.add('visible');

  suggestions.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      input.value = item.dataset.name;
      suggestions.classList.remove('visible');
    });
  });
}

function makeGuess(countryName) {
  if (gameOver || attempts >= 7) return;

  if (!countryName || countryName.trim() === '') {
    alert('Please enter a country name!');
    return;
  }

  const guessedCountry = countries.find(c =>
    c.name.toLowerCase() === countryName.toLowerCase().trim()
  );

  if (!guessedCountry) {
    alert('Country not found in the list!');
    return;
  }

  if (guesses.some(g => g.toLowerCase() === guessedCountry.name.toLowerCase())) {
    alert('You already guessed this country!');
    return;
  }

  guesses.push(guessedCountry.name);
  attempts++;
  
  const isCorrect = guessedCountry.name === targetCountry.name;
  
  if (isCorrect) {
    endGame(true);
  } else if (attempts >= 7) {
    endGame(false);
  }
  
  updateUI();
  renderGuess(guessedCountry, isCorrect === false);
}

function revealHint(guessIndex, hintType) {
  if (hintsRemaining <= 0 || gameOver) return;
  
  hintsRemaining--;
  updateUI();
  
  const hintCell = document.querySelector(`[data-guess="${guessIndex}"][data-hint="${hintType}"]`);
  if (hintCell) {
    const guessedCountry = countries.find(c => c.name === guesses[guessIndex]);
    hintCell.classList.remove('unrevealed');
    updateHintCell(hintCell, guessedCountry, hintType);
  }
}

function updateHintCell(cell, guessedCountry, hintType) {
  const density = calculateDensity(guessedCountry);
  const targetDensity = calculateDensity(targetCountry);

  let text, className;

  switch (hintType) {
  case 'size':
    text = getComparisonText(targetCountry.area, guessedCountry.area);
    className = getComparisonClass(targetCountry.area, guessedCountry.area);
    break;
  case 'population':
    text = getComparisonText(targetCountry.population, guessedCountry.population);
    className = getComparisonClass(targetCountry.population, guessedCountry.population);
    break;
  case 'density':
    text = getComparisonText(targetDensity, density, { much: 2, similar: 0.1 }, 'density');
    className = getComparisonClass(targetDensity, density);
    break;
  case 'gdp':
    text = getComparisonText(targetCountry.gdpPerCapita, guessedCountry.gdpPerCapita, { much: 2, similar: 0.1 }, 'gdp');
    className = getComparisonClass(targetCountry.gdpPerCapita, guessedCountry.gdpPerCapita);
    break;
  case 'age':
    text = getComparisonText(targetCountry.medianAge, guessedCountry.medianAge, { much: 1.2, similar: 0.15 }, 'age');
    className = getComparisonClass(targetCountry.medianAge, guessedCountry.medianAge, { much: 1.2, similar: 0.15 });
    break;
  case 'happiness':
    text = getComparisonText(targetCountry.happiness, guessedCountry.happiness, { much: 1.3, similar: 0.1 });
    className = getComparisonClass(targetCountry.happiness, guessedCountry.happiness, { much: 1.3, similar: 0.1 });
    break;
  case 'position':
    const direction = getDirection(
      guessedCountry.lat, guessedCountry.lng,
      targetCountry.lat, targetCountry.lng
    );
    text = direction;
    className = direction === 'Same' ? 'correct' : 'direction';
    if (direction !== 'Same') {
      cell.classList.add('dir-' + direction.toLowerCase());
    }
    break;
  }

  cell.innerHTML = text;
  cell.classList.add(className);
}

function renderGuess(guessedCountry, showHints = true) {
  const guessIndex = guesses.length - 1;
  const isFirstGuess = attempts === 1;

  const row = document.createElement('div');
  row.className = 'hint-row';

  const hints = ['size', 'population', 'density', 'gdp', 'age', 'happiness', 'position'];

  const countryCell = document.createElement('div');
  countryCell.className = 'hint-cell country-name';
  countryCell.textContent = guessedCountry.name;
  row.appendChild(countryCell);

  let freeHintIndex = -1;
  if (!isFirstGuess && showHints) {
    const unrevealedHints = hints.filter((h, i) => h);
    freeHintIndex = Math.floor(Math.random() * unrevealedHints.length);
  }

  hints.forEach((hint, idx) => {
    const cell = document.createElement('div');
    cell.className = 'hint-cell';
    cell.dataset.guess = guessIndex;
    cell.dataset.hint = hint;

    if (isFirstGuess || !showHints) {
      updateHintCell(cell, guessedCountry, hint);
    } else {
      cell.classList.add('unrevealed');
      cell.textContent = '?';
      cell.addEventListener('click', () => revealHint(guessIndex, hint));
    }

    row.appendChild(cell);
  });

  guessesContainer.appendChild(row);

  if (!isFirstGuess && showHints && freeHintIndex >= 0) {
    const unrevealedCells = Array.from(row.querySelectorAll('.hint-cell.unrevealed'));
    if (unrevealedCells.length > 0) {
      const randomCell = unrevealedCells[freeHintIndex % unrevealedCells.length];
      const hintType = randomCell.dataset.hint;
      randomCell.classList.remove('unrevealed');
      updateHintCell(randomCell, guessedCountry, hintType);
    }
  }
}

function updateUI() {
  hintCountEl.textContent = hintsRemaining;
  attemptCountEl.textContent = 7 - attempts;
}

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  submitBtn.disabled = true;
  diceBtn.disabled = true;

  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
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
  answerDiv.textContent = targetCountry.name;
  correctAnswer.appendChild(answerDiv);

  if (gameMode === 'unlimited') {
    playAgainBtn.classList.remove('hidden');
  }

  gameOverEl.classList.remove('hidden');
}

input.addEventListener('input', (e) => showSuggestions(e.target.value));

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
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
  const availableCountries = countries.filter(c => !guesses.includes(c.name));
  if (availableCountries.length === 0) {
    alert('No more countries to guess!');
    return;
  }
  const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
  input.value = randomCountry.name;
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

document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-section')) {
    suggestions.classList.remove('visible');
  }
});

loadCountries();
