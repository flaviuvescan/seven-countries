# Seven Countries

Seven Countries is a small browser game where the player tries to guess a hidden European country in 7 guesses. Each guess reveals comparison hints against the target country, covering size, population, population density, GDP per capita, median age, happiness, and geographic direction.

## Product Design

- Two modes: `Daily Challenge` picks the same country for everyone on a given date, and `Unlimited` picks a random country each round.
- The first guess reveals all hint categories for that country.
- Later guesses reveal one free hint automatically, and the player can spend from a shared hint pool to uncover the rest.
- The game tracks simple lifetime stats in browser storage: games played, win rate, current streak, and max streak.

## Tech Stack

- Plain HTML, CSS, and JavaScript
- No framework, bundler, backend, or database
- Local JSON dataset loaded with `fetch`
- Browser `localStorage` for persistent stats

## Code Architecture

- [site/index.html](C:/Projects/seven-countries/site/index.html) defines the page structure: header, mode switcher, hint grid, input area, game-over panel, and stats panel.
- [site/style.css](C:/Projects/seven-countries/site/style.css) contains the full visual system, including the dark theme, grid layout, responsive behavior, and color coding for hint states.
- [site/game.js](C:/Projects/seven-countries/site/game.js) contains all game state and behavior.
- [site/data/european-countries.json](C:/Projects/seven-countries/site/data/european-countries.json) stores the country dataset and numeric attributes used for comparisons.

## How The Game Logic Flows

1. `loadCountries()` fetches the JSON dataset, loads saved stats, and starts a game.
2. `startGame()` resets round state and selects a target country.
3. `selectTargetCountry()` uses a date-based seeded pick for daily mode or `Math.random()` for unlimited mode.
4. `makeGuess()` validates input, records the guess, checks win/loss state, and renders a new hint row.
5. `renderGuess()` creates the UI row for the guessed country.
6. `updateHintCell()` computes the text and color for each hint based on how the guess compares to the target.
7. `endGame()` locks the UI, updates stats, and reveals the correct answer.

## Important State In `game.js`

- `countries`: full dataset loaded from JSON
- `targetCountry`: the current answer
- `guesses`: guessed country names for the current round
- `hintsRemaining`: remaining manual hint reveals
- `attempts`: number of guesses used
- `gameOver`: whether the round has ended
- `gameMode`: either `daily` or `unlimited`
- `stats`: persisted player statistics

## Practical Notes

- This project is best served as a static site.
- Most future changes will happen in `site/game.js` for behavior and `site/style.css` for presentation.
- The app is intentionally simple: there is no module system, build pipeline, or automated test setup yet.

## Roadmap (Planned Improvements)

- Improve mobile layout for vertical play.
- Add scoring UI that shows `Guesses Left` and `Hints Left`.
- Add a backend submission flow for scores plus a `World Results` screen that shows score distributions and the percentage of `Lucky Bastards` (first-try wins).
- Add additional continents beyond Europe.
- Create a harder `World+` mode that shows distance in km/miles.
- Spin off a `Seven Capitals` version using `World+` rules (distance).
- Add a `US States` version.
- Register a domain for the project.
- After each win or loss, add a `Learn more about <solution>` link that opens the relevant Wikipedia page (country/state/capital).
- Add Light Mode and a Sleepy Mode (night light) while rebranding the current theme as Dark Mode.
- Create a version for Jobs where you guess a specific job.
