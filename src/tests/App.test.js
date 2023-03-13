import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import mockData from './helpers/mockData';

describe('Testes Login', () => {
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

  it('Verifica se o botão só é habilitado após os campos de email e senha serem preechidos corretamente', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const inputs = screen.getAllByRole('textbox');
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('disabled');

    userEvent.type(inputs[0], 'aline@gmail');
    expect(button).toHaveAttribute('disabled');

    userEvent.clear(inputs[0]);

    userEvent.type(inputs[0], 'alinegmail.com');
    expect(button).toHaveAttribute('disabled');

    userEvent.clear(inputs[0]);

    userEvent.type(inputs[0], 'aline@gmail.com');
    expect(button).toHaveAttribute('disabled');

    userEvent.type(inputs[1], '12345');
    expect(button).toHaveAttribute('disabled');

    userEvent.clear(inputs[1]);

    userEvent.type(inputs[1], '123456');
    expect(button).not.toHaveAttribute('disabled');

    userEvent.click(button);

    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
  });
});

describe('Testes wallet', () => {
  const arrayCurrencies = [{
    id: 0,
    value: '10',
    description: 'descrição inicial',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    exchangeRates: mockData,
  }];

  const valueInputTestId = 'value-input';
  const descriptionInputTestId = 'description-input';
  const totalHeaderTestId = 'total-field';

  it('Verifica se a rota /carteira renderiza o header, formulario e tabela', () => {
    const initialEntries = ['/carteira'];

    const { history } = renderWithRouterAndRedux(<App />, { initialEntries }); // warning

    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');

    const headerInfos = screen.getAllByRole('heading', { level: 3 });
    expect(headerInfos).toHaveLength(2);
    expect(headerInfos[0]).toBeVisible();
    expect(headerInfos[1]).toBeVisible();

    const valueInput = screen.getByTestId(valueInputTestId);
    const currencyInput = screen.getByTestId('currency-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    const descriptionInput = screen.getByTestId(descriptionInputTestId);
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

    const valueInput = screen.getByTestId(valueInputTestId);
    const descriptionInput = screen.getByTestId(descriptionInputTestId);
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

    const initialState = { wallet: {
      expenses: arrayCurrencies,
      currencies: [Object.keys(mockData)] } };

    renderWithRouterAndRedux(<App />, { initialState, initialEntries });

    const headerTotal = screen.getByTestId(totalHeaderTestId);
    expect(headerTotal.innerHTML).toBe('47.53');
  });

  it('Verifica se ao deletar a soma total retorna 0', async () => {
    const initialEntries = ['/carteira'];

    const arrayCurWithTwoObj = [{
      id: 0,
      value: '10',
      description: 'descrição',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    }, {
      id: 1,
      value: '10',
      description: 'descrição',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    }, {
      id: 2,
      value: '10',
      description: 'descrição',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    }];

    const initialState = { wallet: {
      expenses: arrayCurWithTwoObj,
      currencies: [Object.keys(mockData)] } };

    renderWithRouterAndRedux(<App />, { initialState, initialEntries });

    const headerTotal = screen.getByTestId(totalHeaderTestId);
    expect(headerTotal.innerHTML).toBe('142.59');

    const deleteButtons = screen.getAllByTestId('delete-btn');
    expect(deleteButtons).toHaveLength(3);
    expect(deleteButtons[0]).toBeVisible();

    userEvent.click(deleteButtons[0]);

    const deleteButtonsAfter = screen.getAllByTestId('delete-btn');
    expect(deleteButtonsAfter).toHaveLength(2);

    const headerTotalAfter = screen.getByTestId(totalHeaderTestId);
    expect(headerTotalAfter.innerHTML).toBe('95.06');
  });

  it('Verifica se ao clicar em editar o botão Editar despesa é renderizado e após clicar no botão Editar despesa a tabela é atualizada', () => {
    const initialEntries = ['/carteira'];

    const initialState = { wallet: {
      expenses: arrayCurrencies,
      currencies: [Object.keys(mockData)] } };

    renderWithRouterAndRedux(<App />, { initialState, initialEntries });

    const insideTableDescription = screen.getByText('descrição inicial');
    expect(insideTableDescription).toBeVisible();

    const insideTableValue = screen.getByText('10.00');
    expect(insideTableValue).toBeVisible();

    const editButton = screen.getByTestId('edit-btn');
    expect(editButton).toBeVisible();

    userEvent.click(editButton);

    const valueInput = screen.getByTestId(valueInputTestId);
    const descriptionInput = screen.getByTestId(descriptionInputTestId);
    userEvent.type(valueInput, '20');
    userEvent.type(descriptionInput, 'altera descrição');

    const editBtnForm = screen.getByText('Editar despesa');
    expect(editBtnForm).toBeVisible();
    userEvent.click(editBtnForm);

    // expect(insideTableDescription).not.toBeVisible();

    const insideTableOtherDesc = screen.getByText('altera descrição');
    expect(insideTableOtherDesc).toBeVisible();
  });
});
