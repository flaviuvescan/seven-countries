# Seven Countries

Seven Countries is a small browser game where the player tries to guess a hidden entry in 7 guesses. The homepage now lets players choose a version (Europe, US States, Asia, Capitals, or Chemical Elements). Each guess reveals comparison hints against the target based on the active version’s columns.

## Product Design

- Two modes: `Daily Challenge` picks the same entry for everyone on a given date (per version), and `Unlimited` picks a random entry each round.
- The first guess reveals all hint categories for that entry.
- Later guesses reveal one free hint automatically, and the player can spend from a shared hint pool to uncover the rest.
- The game tracks lifetime stats per version in browser storage: games played, win rate, current streak, and max streak.
- Versions:
  - Europe (countries with size, population, corruption, GDP per capita, age, happiness, and position)
  - US States (same columns as Europe)
  - Asia (countries with size, population, corruption, GDP per capita, age, happiness, and position)
  - Capitals (altitude instead of happiness)
  - Chemical Elements (symbol, atomic number, atomic mass, density, melting point, boiling point, table position)

## Tech Stack

- Plain HTML, CSS, and JavaScript
- No framework, bundler, backend, or database
- Local JSON dataset loaded with `fetch`
- Browser `localStorage` for persistent stats

## Code Architecture

- `index.html` defines the page structure: header, version picker, mode switcher, hint grid, input area, game-over panel, and stats panel.
- `style.css` contains the full visual system, including the dark theme, grid layout, responsive behavior, and color coding for hint states.
- `game.js` contains all game state, version configuration, and behavior.
- `documentation/` stores project memory and data-source tracking documents.
- `data/european-countries.json` stores the Europe dataset and numeric attributes used for comparisons.
- `data/us-states.json` stores the US States dataset.
- `data/asia-countries.json` stores the Asia dataset.
- `data/world-capitals.json` stores the Capitals dataset (including altitude).
- `data/chemical-elements.json` stores the Chemical Elements dataset.

## How The Game Logic Flows

1. `initializeVersion()` renders the version picker, loads the version dataset, loads saved stats, and starts a game.
2. `startGame()` resets round state and selects a target entry.
3. `selectTargetEntry()` uses a date-based seeded pick for daily mode or `Math.random()` for unlimited mode.
4. `makeGuess()` validates input, records the guess, checks win/loss state, and renders a new hint row.
5. `renderGuess()` creates the UI row for the guessed entry.
6. `updateHintCell()` computes the text and color for each hint based on how the guess compares to the target.
7. `endGame()` locks the UI, updates stats, and reveals the correct answer.

## Important State In `game.js`

- `VERSION_CONFIGS`: per-version metadata, columns, and datasets
- `entries`: full dataset loaded from JSON
- `targetEntry`: the current answer
- `guesses`: guessed entry names for the current round
- `hintsRemaining`: remaining manual hint reveals
- `attempts`: number of guesses used
- `gameOver`: whether the round has ended
- `gameMode`: either `daily` or `unlimited`
- `stats`: persisted player statistics (per version)

## Practical Notes

- This project is best served as a static site.
- Most future changes will happen in `game.js` for behavior and `style.css` for presentation.
- The app is intentionally simple: there is no module system, build pipeline, or automated test setup yet.
- Track dataset provenance in `documentation/data-gathering.md`.

## Roadmap (Planned Improvements)

- Improve mobile layout for vertical play.
- Add scoring UI that shows `Guesses Left` and `Hints Left`.
- Add a backend submission flow for scores plus a `World Results` screen that shows score distributions and the percentage of `Lucky Bastards` (first-try wins).
- Add additional continents beyond Asia/Europe and expand datasets.
- Create a harder `World+` mode that shows distance in km/miles.
- Register a domain for the project.
- After each win or loss, add a `Learn more about <solution>` link that opens the relevant Wikipedia page (country/state/capital/element).
- Add Light Mode and a Sleepy Mode (night light) while rebranding the current theme as Dark Mode.
- Create a version for Jobs where you guess a specific job.

## LLM Suggestions

### Candidate Version Ideas

- Superheroes appears to be the most fun version so far, followed by Europe and US States. The likely secret sauce is a set of hint categories that are easy to understand, varied enough to create strong signal, and playful enough to invite intuition instead of pure memorization.
- Good candidates tend to have a few dozen well-known entities, shared variables across the whole dataset, and a mix of hard facts plus softer "vibe" stats.
- Strong future candidates and possible hint variables:
  - Dinosaurs: era, diet, length, weight, height, speed, continent found, danger rating
  - Dog Breeds: origin country, weight, height, lifespan, intelligence rank, trainability, energy level, friendliness
  - Pokemon: generation, primary type, secondary type, height, weight, base speed, attack, defense, catch rate
  - Mythological Gods: pantheon, domain, gender, generation, weapon, temperament, sky/sea/underworld affinity, popularity rank
  - Famous Cars: debut year, country, top speed, horsepower, weight, drivetrain, seats, body style, brand popularity
  - Birds or Animals: continent, habitat, weight, length or wingspan, top speed, lifespan, diet, conservation status
  - WWE Wrestlers or Fighters: debut year, height, weight, championships, charisma, strength, speed, popularity
  - Villains: debut year, franchise, intelligence, cruelty, strength, stealth, popularity, threat level
  - Fantasy Characters or Races: universe, lifespan, height, magic, strength, intelligence, agility, charisma, alignment
  - Jobs: median salary, required education, growth rate, physical demand, social interaction, creativity, prestige, automation risk
  - Planets or Moons: radius, mass, gravity, day length, year length, temperature, number of moons, order from sun
  - Roman Emperors, US Presidents, or Monarchs: reign start, reign length, age at accession, dynasty or party, military background, popularity, cause of death
  - Scientists: birth year, field, Nobel status, nationality, lifespan, citation or popularity rank, theory/math/experiment category
  - Musical Instruments: family, pitch range, weight or size, origin era, loudness, portability, difficulty
  - Board Games: release year, player count, play time, complexity, luck vs strategy, popularity rank, theme
  - Video Game Franchises: debut year, genre, sales, platform spread, difficulty, critical score, protagonist count
  - Movie Monsters or Kaiju: debut year, height, weight, powers, destruction level, speed, intelligence, franchise
  - Spacecraft: launch year, country or agency, mass, crew capacity, destination class, max speed, mission duration
  - Sharks or Sea Creatures: length, weight, depth, speed, diet, danger, habitat, lifespan
  - Trees: height, lifespan, range, leaf type, wood density, growth rate, climate zone
  - Alcohol or Cocktails: base spirit, ABV, origin year or place, sweetness, bitterness, popularity, ingredient count
  - Cheeses: country, milk type, age, firmness, smell, fat content, popularity
  - Languages: speakers, writing system, family, age, countries, difficulty, word order
  - Chess Openings: ECO family, popularity, aggressiveness, theory depth, draw rate, side, pawn structure family
  - Mountains: elevation, prominence, continent, difficulty, death rate, first ascent year, latitude
