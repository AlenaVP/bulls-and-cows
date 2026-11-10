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

export function renderApp(root: HTMLElement): void {
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

  main.append(
    createPanel('Game settings', 'Choose the number length and numeral system.', 'panel--settings'),
    createPanel('Your game', 'Enter your guesses and discover the secret number.', 'panel--game'),
    createPanel('Guess history', 'Your previous attempts will appear here.', 'panel--history'),
    createPanel('Leaderboard', 'Your best game results will be displayed here.', 'panel--leaderboard'),
  );

  app.append(header, main);

  root.append(app);
}
