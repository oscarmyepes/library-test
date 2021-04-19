import '@testing-library/jest-dom';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

export let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});
