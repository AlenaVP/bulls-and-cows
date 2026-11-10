import { createDigitValidator } from '../game/logic/create-digit-validator.js';
import { isValidGuess } from '../game/logic/is-valid-guess.js';
import { submitGuess } from '../game/state/submit-guess.js';
import { createGame } from '../game/state/create-game.js';
import type { GameSettings } from '../game/types/game-settings.js';
import type { GameState } from '../game/types/game-state.js';

function createPanel(title: string, description: string, className: string): HTMLElement {
  const section = document.createElement('section');
  section.className = `panel ${className}`;

  const heading = document.createElement('h2');
  heading.className = 'panel__title';
  heading.textContent = title;

  const paragraph = document.createElement('p');
  paragraph.className = 'panel__description';
  paragraph.textContent = description;

  section.append(heading, paragraph);

  return section;
}

function createSelectField(
  id: string,
  labelText: string,
  options: number[],
): { field: HTMLElement; select: HTMLSelectElement } {
  const field = document.createElement('div');
  field.className = 'form-field';

  const label = document.createElement('label');
  label.className = 'form-field__label';
  label.htmlFor = id;
  label.textContent = labelText;

  const select = document.createElement('select');
  select.className = 'form-field__select';
  select.id = id;

  options.forEach((value) => {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = String(value);
    select.append(option);
  });

  field.append(label, select);

  return { field, select };
}

function createSettingsPanel(onStartGame: (settings: GameSettings) => void): HTMLElement {
  const panel = createPanel('Game settings', 'Choose the number length and numeral system.', 'panel--settings');

  const form = document.createElement('div');
  form.className = 'settings-form';

  const baseField = createSelectField('game-base', 'Numeral system', [2, 8, 10, 16]);
  const baseSelect = baseField.select;
  baseSelect.value = '10';

  const lengthField = createSelectField('game-length', 'Secret number length', [2, 3, 4, 5, 6]);
  const lengthSelect = lengthField.select;
  lengthSelect.value = '5';

  const startButton = document.createElement('button');
  startButton.className = 'button button--primary';
  startButton.type = 'button';
  startButton.textContent = 'New game';

  function updateLengthOptions(): void {
    const base = Number(baseSelect.value);
    const currentLength = Number(lengthSelect.value);
    const maxLength = Math.min(6, base);

    lengthSelect.replaceChildren();

    for (let length = 2; length <= maxLength; length += 1) {
      const option = document.createElement('option');
      option.value = String(length);
      option.textContent = String(length);
      lengthSelect.append(option);
    }

    lengthSelect.value = String(Math.min(currentLength, maxLength));
  }

  baseSelect.addEventListener('change', updateLengthOptions);

  startButton.addEventListener('click', () => {
    onStartGame({
      length: Number(lengthSelect.value),
      base: Number(baseSelect.value),
    });
  });

  form.append(baseField.field, lengthField.field, startButton);
  panel.append(form);

  return panel;
}

function createHistoryItem(guess: string, bulls: number, cows: number): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'history-item';

  const guessValue = document.createElement('span');
  guessValue.className = 'history-item__guess';
  guessValue.textContent = guess;

  const result = document.createElement('span');
  result.className = 'history-item__result';
  result.textContent = `${bulls} bulls, ${cows} cows`;

  item.append(guessValue, result);

  return item;
}

export function renderApp(root: HTMLElement): void {
  let currentGame: GameState | null = null;

  const app = document.createElement('div');
  app.className = 'app-shell';

  const header = document.createElement('header');
  header.className = 'app-header';

  const kicker = document.createElement('p');
  kicker.className = 'app-header__kicker';
  kicker.textContent = 'LOGIC GAME';

  const title = document.createElement('h1');
  title.className = 'app-header__title';
  title.textContent = 'Bulls & Cows';

  const description = document.createElement('p');
  description.className = 'app-header__description';
  description.textContent = 'Guess the secret number using logic and deduction.';

  header.append(kicker, title, description);

  const main = document.createElement('main');
  main.className = 'app-layout';

  const gamePanel = createPanel('Your game', 'Enter your guesses and discover the secret number.', 'panel--game');

  const gameInfo = document.createElement('p');
  gameInfo.className = 'game-info';
  gameInfo.textContent = 'Choose your settings and start a new game.';

  const guessForm = document.createElement('form');
  guessForm.className = 'guess-form';

  const guessInput = document.createElement('input');
  guessInput.className = 'guess-input';
  guessInput.type = 'text';
  guessInput.autocomplete = 'off';
  guessInput.spellcheck = false;
  guessInput.placeholder = 'Enter your guess';
  guessInput.setAttribute('aria-label', 'Your guess');
  guessInput.disabled = true;

  const submitButton = document.createElement('button');
  submitButton.className = 'button button--primary';
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit guess';
  submitButton.disabled = true;

  const guessFeedback = document.createElement('p');
  guessFeedback.className = 'guess-feedback';
  guessFeedback.setAttribute('aria-live', 'polite');

  guessForm.append(guessInput, submitButton);
  gamePanel.append(gameInfo, guessForm, guessFeedback);

  const historyPanel = createPanel('Guess history', 'Your previous attempts will appear here.', 'panel--history');

  const historyList = document.createElement('ol');
  historyList.className = 'history-list';
  historyPanel.append(historyList);

  const leaderboardPanel = createPanel(
    'Leaderboard',
    'Your best game results will be displayed here.',
    'panel--leaderboard',
  );

  function updateSubmitButton(): void {
    if (!currentGame || currentGame.status === 'won') {
      submitButton.disabled = true;
      return;
    }

    submitButton.disabled = !isValidGuess(guessInput.value, currentGame.settings.length, currentGame.settings.base);
  }

  function startGame(settings: GameSettings): void {
    currentGame = createGame(settings);

    guessInput.value = '';
    guessInput.maxLength = settings.length;
    guessInput.placeholder = `Enter ${settings.length} unique digits`;
    guessInput.disabled = false;

    historyList.replaceChildren();
    guessFeedback.textContent = '';

    gameInfo.textContent = `New game started. Find the ${settings.length}-digit number in base ${settings.base}.`;

    updateSubmitButton();
    guessInput.focus();
  }

  guessInput.addEventListener('input', () => {
    if (!currentGame) {
      return;
    }

    const { length, base } = currentGame.settings;
    const isValidDigit = createDigitValidator(base);
    const digits = [...guessInput.value.toLowerCase()];

    guessInput.value = digits
      .filter((digit, index) => isValidDigit(digit) && digits.indexOf(digit) === index)
      .slice(0, length)
      .join('');

    updateSubmitButton();
  });

  guessForm.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    if (!currentGame || currentGame.status === 'won') {
      return;
    }

    const guess = guessInput.value;

    if (!isValidGuess(guess, currentGame.settings.length, currentGame.settings.base)) {
      guessFeedback.textContent = 'Enter a valid guess with unique digits.';
      return;
    }

    const normalizedGuess = guess.toLowerCase();
    const isDuplicate = currentGame.history.some((entry) => entry.guess === normalizedGuess);

    if (isDuplicate) {
      guessFeedback.textContent = 'You have already tried this number.';
      return;
    }

    currentGame = submitGuess(currentGame, normalizedGuess);

    const lastEntry = currentGame.history[currentGame.history.length - 1];

    if (!lastEntry) {
      return;
    }

    historyList.prepend(createHistoryItem(lastEntry.guess, lastEntry.result.bulls, lastEntry.result.cows));

    guessInput.value = '';
    guessFeedback.textContent = '';

    if (currentGame.status === 'won') {
      gameInfo.textContent = `Congratulations! You found the secret number: ${currentGame.secret}.`;
      guessFeedback.textContent = `Solved in ${currentGame.history.length} attempts!`;
      guessInput.disabled = true;
    } else {
      gameInfo.textContent = `Attempts: ${currentGame.history.length}`;
      guessInput.focus();
    }

    updateSubmitButton();
  });

  const settingsPanel = createSettingsPanel(startGame);

  main.append(settingsPanel, gamePanel, historyPanel, leaderboardPanel);
  app.append(header, main);

  root.append(app);
}
