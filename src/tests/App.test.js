import { screen } from '@testing-library/react';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import userEvent from '@testing-library/user-event';
import mockData from './helpers/mockData';

it('A pagina inicial na rota / deve renderizar dois inputs e um botão', () => {
  const initialEntries = ['/'];

  const { history } = renderWithRouterAndRedux(<App />, { initialEntries });

  const { pathname } = history.location;
  expect(pathname).toBe('/');

  const inputs = screen.getAllByRole('textbox');
  expect(inputs).toHaveLength(2);
  expect(inputs[0]).toBeVisible();
  expect(inputs[1]).toBeVisible();

  const button = screen.getByRole('button');
  expect(button).toBeVisible();
  expect(button.innerHTML).toBe('Entrar');
});

it('Verifica se a rota /carteira renderiza o header, formulario e tabela', () => {
  const initialEntries = ['/carteira'];

  const { history } = renderWithRouterAndRedux(<App />, { initialEntries }); // warning

  const { pathname } = history.location;
  expect(pathname).toBe('/carteira');

  const headerInfos = screen.getAllByRole('heading', { level: 3 });
  expect(headerInfos).toHaveLength(2);
  expect(headerInfos[0]).toBeVisible();
  expect(headerInfos[1]).toBeVisible();

  const valueInput = screen.getByTestId('value-input');
  const currencyInput = screen.getByTestId('currency-input');
  const methodInput = screen.getByTestId('method-input');
  const tagInput = screen.getByTestId('tag-input');
  const descriptionInput = screen.getByTestId('description-input');
  const buttonAdd = screen.getByText('Adicionar despesa');

  expect(valueInput).toBeVisible();
  expect(currencyInput).toBeVisible();
  expect(methodInput).toBeVisible();
  expect(tagInput).toBeVisible();
  expect(descriptionInput).toBeVisible();
  expect(buttonAdd).toBeVisible();

  const table = screen.getByRole('table');
  expect(table).toBeVisible();

  const headerTable = screen.getAllByRole('row');
  expect(headerTable).toHaveLength(1);
});

it('Verifica se o email é salvo no estado global e renderizado no header de Wallet', () => {
  const initialEntries = ['/carteira'];
  const initialState = { user: { email: 'email@gmail.com' } };

  renderWithRouterAndRedux(<App />, { initialState, initialEntries });

  const headerInfos = screen.getAllByRole('heading', { level: 3 });
  expect(headerInfos[0].innerHTML).toBe('email@gmail.com');
});

it('Verifica se renderiza os valores corretamente na tabela após clicar em Adicionar despesa', async () => {
  const initialEntries = ['/carteira'];

  renderWithRouterAndRedux(<App />, { initialEntries });

  const valueInput = screen.getByTestId('value-input');
  const descriptionInput = screen.getByTestId('description-input');
  const buttonAdd = screen.getByText('Adicionar despesa');

  userEvent.type(valueInput, '10');
  userEvent.type(descriptionInput, 'dez dólares');
  userEvent.click(buttonAdd);

  const insideTableDescription = await screen.findByText('dez dólares');
  expect(insideTableDescription).toBeVisible();

  const insideTableValue = await screen.findByText('10.00');
  expect(insideTableValue).toBeVisible();
});

it('Verifica se a soma total no header corresponde ao valor correto', () => {
  const initialEntries = ['/carteira'];
  const arrayCurrencies = [{
    id: 0,
    value: '10',
    description: 'oi',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    exchangeRates: mockData,
  }];

  const initialState = { wallet: {
    expenses: arrayCurrencies,
    currencies: [Object.keys(mockData)] } };

  renderWithRouterAndRedux(<App />, { initialState, initialEntries });

  const headerTotal = screen.getByTestId('total-field');
  expect(headerTotal.innerHTML).toBe('47.53');
});
