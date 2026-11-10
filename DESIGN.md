# Design Documentation

## 1. Project Overview

**Bulls and Cows** is a number-guessing game implemented with TypeScript, HTML, and CSS.

The application generates a secret number containing unique digits in a selected numeral system. The player attempts to guess the secret number and receives feedback in the form of:

- **Bulls** — correct digits in correct positions.
- **Cows** — correct digits in incorrect positions.

The game supports four numeral systems:

- Binary (base 2)
- Octal (base 8)
- Decimal (base 10)
- Hexadecimal (base 16)

The secret number length can be configured from 2 to 6 digits, provided that it does not exceed the selected base.

The application also tracks game duration, records completed games, and maintains a leaderboard using `localStorage`.

### Technologies

- TypeScript
- HTML5
- CSS3
- Vitest
- ESLint
- Prettier
- Husky
- lint-staged

No backend or external API is required. All game logic and persistence are handled on the client side.

---

## 2. Architecture and Project Structure

The project follows a modular architecture that separates game logic, state management, shared types, and user interface code.

```text
src/
├── game/
│   ├── logic/
│   │   ├── constants.ts
│   │   ├── create-digit-validator.ts
│   │   ├── generate-secret.ts
│   │   ├── evaluate-guess.ts
│   │   ├── is-valid-guess.ts
│   │   └── count-possible-secrets.ts
│   │
│   ├── state/
│   │   ├── create-game.ts
│   │   ├── submit-guess.ts
│   │   ├── get-game-duration.ts
│   │   ├── create-game-record.ts
│   │   ├── get-leaderboard.ts
│   │   ├── save-leaderboard.ts
│   │   ├── load-leaderboard.ts
│   │   └── add-game-record.ts
│   │
│   └── types/
│       ├── game-settings.ts
│       ├── game-state.ts
│       ├── guess-history-entry.ts
│       ├── guess-result.ts
│       └── game-record.ts
│
├── ui/
│   └── render-app.ts
│
└── main.ts

styles/
└── main.css

index.html
DESIGN.md
```

### Architectural responsibilities

**Game logic (`src/game/logic/`)**

Contains reusable functions responsible for:

- Validating individual digits and complete guesses.
- Generating unique secret numbers.
- Evaluating guesses.
- Calculating the number of possible secret combinations.

**Game state (`src/game/state/`)**

Manages the game lifecycle:

- Creating a new game.
- Processing guesses and updating game state.
- Calculating elapsed time.
- Creating and managing leaderboard records.
- Persisting records in local storage.

**Shared types (`src/game/types/`)**

Defines the data structures used throughout the application.

**User interface (`src/ui/`)**

Responsible for rendering application elements, handling user interactions, displaying game progress, and connecting the interface to game logic.

The separation ensures that the core game logic does not depend on DOM APIs.

---

## 3. Data Structures and Algorithms

### 3.1. Game State

The current game is represented by the `GameState` interface.

```ts
interface GameState {
  settings: GameSettings;
  secret: string;
  history: GuessHistoryEntry[];
  status: GameStatus;
  startedAt: number;
  finishedAt: number | null;
}

type GameStatus = 'playing' | 'won';
```

The state contains:

- Selected game settings.
- Secret number.
- Guess history.
- Current game status.
- Start and finish timestamps.

A game history entry contains the submitted guess, its evaluation, and the submission timestamp.

### 3.2. Secret Number Generation

`generateSecret()` generates a secret number containing unique digits.

The implementation uses an array of available digits and removes each selected digit after it has been chosen.

This guarantees that a digit cannot appear more than once.

The random number generator is injected as an optional argument. This makes the function deterministic in tests and avoids dependence on the global random generator.

Leading zeros are allowed.

### 3.3. Guess Validation

`createDigitValidator()` implements a curried function.

It accepts a numeral system base and returns a validator for individual characters:

```ts
const isValidDigit = createDigitValidator(16);

isValidDigit('a'); // true
isValidDigit('f'); // true
isValidDigit('g'); // false
```

The validator is reused by `isValidGuess()` and the UI input handler.

`isValidGuess()` checks:

1. The guess has the required length.
2. Every character is valid for the selected base.
3. All digits are unique.

Hexadecimal input is normalized to lowercase to ensure case-insensitive comparison.

### 3.4. Guess Evaluation

`evaluateGuess()` calculates bulls and cows.

The implementation uses array methods:

- `map()` to compare digits at matching positions.
- `filter()` to identify matching positions and digits.
- `reduce()` to calculate the number of cows.

The secret and guess are normalized to lowercase before comparison.

The function returns a `GuessResult` object:

```ts
interface GuessResult {
  bulls: number;
  cows: number;
}
```

### 3.5. Possible Secret Combinations

`countPossibleSecrets()` calculates the number of possible secret numbers.

Since digits cannot repeat and leading zeros are allowed, the number of combinations is a permutation:

\[
P(n,k) = \frac{n!}{(n-k)!}
\]

Where:

- \(n\) is the numeral system base.
- \(k\) is the secret number length.

The implementation uses recursion:

```ts
function countPermutations(remainingLength: number, availableDigits: number): number {
  if (remainingLength === 0) {
    return 1;
  }

  return availableDigits * countPermutations(remainingLength - 1, availableDigits - 1);
}
```

Memoization is implemented using a `Map`, which stores previously calculated results.

This avoids repeating the same recursive calculations across function calls.

### 3.6. Immutable Game State

Game state updates do not mutate the original state.

`submitGuess()` creates a new state object and a new history array:

```ts
return {
  ...state,
  history: [...state.history, newEntry],
  status: isWon ? 'won' : 'playing',
  finishedAt: isWon ? submittedAt : null,
};
```

This approach preserves the previous state and makes updates predictable.

Duplicate guesses and guesses submitted after winning do not modify the state.

### 3.7. Leaderboard

A `GameRecord` contains:

- Game settings.
- Number of attempts.
- Game duration.
- Completion timestamp.

The leaderboard is sorted using the following criteria:

1. Fewer attempts are better.
2. If attempts are equal, shorter duration is better.

The leaderboard is limited to the ten best records.

Records are serialized as JSON and stored in `localStorage`.

When loading records, the application validates the parsed data before using it. Invalid JSON, malformed records, or unavailable storage result in an empty leaderboard.

---

## 4. Big O Complexity Analysis

The following analysis covers the four required functions.

### 4.1. `generateSecret(length, base)`

The function selects `length` unique digits from an array containing `base` available digits.

Each iteration removes one element using `splice()`.

In the worst case, removing an element from an array requires shifting subsequent elements.

The total work is:

\[
O(base) + O(base-1) + \ldots + O(base-length+1)
\]

Therefore:

- **Time complexity:** \(O(length \cdot base)\)
- **Space complexity:** \(O(base)\)

The auxiliary array stores the available digits, while the resulting secret contains `length` digits.

### 4.2. `evaluateGuess(secret, guess)`

The function performs a fixed number of array operations on the guess and secret.

The `map()` and `filter()` operations are linear.

The cows calculation uses `includes()` inside `filter()`, which requires a linear search through the secret for each digit.

Therefore:

- **Time complexity:** \(O(length^2)\)
- **Space complexity:** \(O(length)\)

The additional space is used by the normalized arrays and intermediate arrays produced by array methods.

### 4.3. `isValidGuess(guess, length, base)`

The function:

1. Checks the guess length.
2. Creates a digit validator.
3. Normalizes and splits the guess.
4. Checks every digit using `every()`.
5. Creates a `Set` to detect duplicates.

The validation operations are linear with respect to the guess length.

Therefore:

- **Time complexity:** \(O(length)\)
- **Space complexity:** \(O(length)\)

The additional space is used by the normalized digit array and the `Set`.

### 4.4. `countPossibleSecrets(length, base)`

The recursive implementation calculates permutations by reducing the number of available digits at each step.

Without memoization, the recursion performs one recursive call per remaining digit.

Therefore:

- **Time complexity:** \(O(length)\) for a cache miss.
- **Space complexity:** \(O(length)\) for the recursion stack and memoization entries.

When a previously calculated state is found in the memoization map:

- **Time complexity:** \(O(1)\) average lookup time.
- **Additional recursion space:** \(O(1)\).

The memoization map is shared between function calls, allowing calculated states to be reused.

---

## 5. Clean Code Principles

### 5.1. Single Responsibility Principle

Functions and modules have clearly defined responsibilities.

Examples:

- `generateSecret()` generates a secret number.
- `isValidGuess()` validates a complete guess.
- `evaluateGuess()` evaluates a guess.
- `createGame()` initializes a game.
- `submitGuess()` processes a guess and returns an updated state.
- `getGameDuration()` calculates game duration.
- `saveLeaderboard()` persists records.
- `loadLeaderboard()` retrieves and validates records.
- `getLeaderboard()` sorts and limits records.

This makes the application easier to understand, test, and maintain.

### 5.2. Pure Functions

Core game logic is implemented using pure functions whenever possible.

Examples include:

- `createDigitValidator()`
- `isValidGuess()`
- `evaluateGuess()`
- `getLeaderboard()`

These functions do not directly manipulate the DOM or access browser storage.

Functions that require external dependencies, such as randomness, time, or storage, accept them through parameters where appropriate.

This improves testability and makes behavior predictable.

### 5.3. Immutability

The application avoids modifying existing game state and leaderboard arrays.

Examples:

- `submitGuess()` creates a new game state.
- Guess history is updated using array spread syntax.
- `getLeaderboard()` sorts a copied array rather than the original.
- Game settings are copied when a new game is created.

This prevents accidental side effects.

### 5.4. Reusability

Reusable logic is extracted into independent modules.

For example, `createDigitValidator()` is shared between complete guess validation and real-time input filtering.

`formatDuration()` is reused for displaying game duration and leaderboard results.

### 5.5. Type Safety

TypeScript interfaces and types describe the application's data structures.

Shared types are defined in `src/game/types/`.

Strict TypeScript compiler settings help detect potential errors during development.

Type-only imports are used where appropriate.

### 5.6. Defensive Programming

The application validates user input and persisted data.

Examples:

- Invalid numeral system bases and secret lengths are rejected.
- Duplicate digits are not accepted.
- Duplicate guesses are not added to history.
- Guesses after winning are ignored.
- Invalid leaderboard data is rejected.
- Storage errors are handled without crashing the application.

### 5.7. Separation of Concerns

Game logic is independent of the DOM.

The UI communicates with the game through exported functions and displays the resulting state.

This allows core functionality to be tested without rendering the application.

### 5.8. Consistent Code Style

The project uses:

- ESLint for static code analysis.
- Prettier for consistent formatting.
- Husky and lint-staged for pre-commit checks.
- Vitest for automated testing.

The pre-commit hook runs lint-staged on changed files, while the pre-push hook runs the test suite.

---

## 6. Testing Strategy

The project follows Test-Driven Development (TDD).

For each required game logic function:

1. Tests are created before implementation.
2. The tests are executed to verify that they fail for the expected reason.
3. The implementation is written to satisfy the tests.
4. Tests are executed again to verify the implementation.
5. Changes are checked with ESLint and TypeScript.

Vitest is used as the testing framework.

The test suite covers:

- Valid and invalid input.
- Boundary conditions.
- Different numeral systems.
- Hexadecimal case normalization.
- Random number injection.
- Game state transitions.
- Duplicate guesses.
- Winning conditions.
- Game duration.
- Leaderboard sorting and limits.
- Local storage errors and invalid data.
- Integration of leaderboard saving and loading.

The implementation is also checked using TypeScript compilation and ESLint.

---

## 7. Persistence

The leaderboard is stored in browser `localStorage` under the key:

```text
bulls-and-cows-leaderboard
```

Records are serialized using `JSON.stringify()` and restored using `JSON.parse()`.

Loaded data is validated before being used.

If storage is unavailable or the stored data is invalid, the application falls back to an empty leaderboard instead of failing.

No backend or external API is required.

---

## 8. Conclusion

The project demonstrates the use of TypeScript, functional programming, recursion, memoization, immutability, and Test-Driven Development in a browser-based application.

The modular architecture separates game logic from presentation and persistence, making the application easier to test, extend, and maintain.
