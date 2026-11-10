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

  const status = document.createElement('p');
  status.className = 'game-status';
  status.setAttribute('aria-live', 'polite');

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
    const settings: GameSettings = {
      length: Number(lengthSelect.value),
      base: Number(baseSelect.value),
    };

    onStartGame(settings);
  });

  form.append(baseField.field, lengthField.field, startButton);
  panel.append(form);

  return panel;
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

  const settingsPanel = createSettingsPanel((settings) => {
    currentGame = createGame(settings);

    const gameInfo = main.querySelector<HTMLElement>('.game-info');

    if (gameInfo && currentGame) {
      gameInfo.textContent = `New game started: ${currentGame.settings.length} digits, base ${currentGame.settings.base}.`;
    }
  });

  const gamePanel = createPanel('Your game', 'Enter your guesses and discover the secret number.', 'panel--game');

  const gameInfo = document.createElement('p');
  gameInfo.className = 'game-info';
  gameInfo.textContent = 'Choose your settings and start a new game.';

  gamePanel.append(gameInfo);

  main.append(
    settingsPanel,
    gamePanel,
    createPanel('Guess history', 'Your previous attempts will appear here.', 'panel--history'),
    createPanel('Leaderboard', 'Your best game results will be displayed here.', 'panel--leaderboard'),
  );

  app.append(header, main);

  root.append(app);
}
