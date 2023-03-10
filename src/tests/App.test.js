import { screen } from '@testing-library/react';
import { renderWithRedux } from './helpers/renderWith';
import Login from '../pages/Login';

it('A pagina inicial deve renderizar dois inputs e um botão', () => {
  renderWithRedux(<Login />);

  const inputs = screen.getAllByRole('textbox');
  expect(inputs).toHaveLength(2);
  expect(inputs[0]).toBeVisible();
  expect(inputs[1]).toBeVisible();

  const button = screen.getByRole('button');
  expect(button).toBeVisible();
  expect(button.innerHTML).toBe('Entrar');
});
