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

    const inputEmail = screen.getByTestId('email-input');
    const inputPassword = screen.getByTestId('password-input');
    expect(inputEmail).toBeVisible();
    expect(inputPassword).toBeVisible();

    const button = screen.getByRole('button');
    expect(button).toBeVisible();
    expect(button.innerHTML).toBe('Entrar');
  });

  it('Verifica se o botão só é habilitado após os campos de email e senha serem preechidos corretamente', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const inputEmail = screen.getByTestId('email-input');
    const inputPassword = screen.getByTestId('password-input');
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('disabled');

    userEvent.type(inputEmail, 'aline@gmail');
    expect(button).toHaveAttribute('disabled');

    userEvent.clear(inputEmail);

    userEvent.type(inputEmail, 'alinegmail.com');
    expect(button).toHaveAttribute('disabled');

    userEvent.clear(inputEmail);

    userEvent.type(inputEmail, 'aline@gmail.com');
    expect(button).toHaveAttribute('disabled');

    userEvent.type(inputPassword, '12345');
    expect(button).toHaveAttribute('disabled');

    userEvent.clear(inputPassword);

    userEvent.type(inputPassword, '123456');
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
  const buttonAddText = 'Adicionar despesa';
  const deleteBtnTestId = 'delete-btn';

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
    const buttonAdd = screen.getByText(buttonAddText);

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
    const buttonAdd = screen.getByText(buttonAddText);

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

    const deleteButtons = screen.getAllByTestId(deleteBtnTestId);
    expect(deleteButtons).toHaveLength(3);
    expect(deleteButtons[0]).toBeVisible();

    userEvent.click(deleteButtons[0]);

    const deleteButtonsAfter = screen.getAllByTestId(deleteBtnTestId);
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

describe('Testes wallet para cobertura de reducers', () => {
  const descriptionInputTestId = 'description-input';
  const valueInputTestId = 'value-input';
  const totalHeaderTestId = 'total-field';
  const buttonAddText = 'Adicionar despesa';
  const deleteBtnTestId = 'delete-btn';

  it('Testes gerais de outra forma mockando o fetch', async () => {
    const initialEntries = ['/carteira'];

    renderWithRouterAndRedux(<App />, { initialEntries });

    jest.spyOn(global, 'fetch');

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    const valueInput = screen.getByTestId(valueInputTestId);
    const descriptionInput = screen.getByTestId(descriptionInputTestId);
    const buttonAdd = screen.getByText(buttonAddText);

    expect(valueInput).toBeVisible();
    expect(descriptionInput).toBeVisible();
    expect(buttonAdd).toBeVisible();

    userEvent.type(valueInput, '10');
    userEvent.type(descriptionInput, 'dez');
    userEvent.click(buttonAdd);

    userEvent.type(valueInput, '20');
    userEvent.type(descriptionInput, 'vinte');
    userEvent.click(buttonAdd);

    userEvent.type(valueInput, '30');
    userEvent.type(descriptionInput, 'trinta');
    userEvent.click(buttonAdd);

    const insideTableDescription = await screen.findByText('dez');
    expect(insideTableDescription).toBeVisible();

    const headerTotal = screen.getByTestId(totalHeaderTestId);
    expect(headerTotal.innerHTML).toBe('285.19');

    const editButton = screen.getAllByTestId('edit-btn');
    expect(editButton).toHaveLength(3);
    expect(editButton[0]).toBeVisible();
    expect(editButton[1]).toBeVisible();
    expect(editButton[2]).toBeVisible();

    userEvent.click(editButton[0]);

    const editButtonForm = screen.getByText('Editar despesa');
    expect(editButtonForm).toBeVisible();

    userEvent.type(valueInput, '70');
    userEvent.type(descriptionInput, 'setenta');
    userEvent.click(editButtonForm);

    const headerTotalAfterEdit = screen.getByTestId(totalHeaderTestId);
    expect(headerTotalAfterEdit.innerHTML).toBe('570.37');

    const insideTableDescAfterEditS = screen.getByText('setenta');
    const insideTableDescAfterEditV = screen.getByText('vinte');
    const insideTableDescAfterEditT = screen.getByText('trinta');
    expect(insideTableDescAfterEditS).toBeVisible();
    expect(insideTableDescAfterEditV).toBeVisible();
    expect(insideTableDescAfterEditT).toBeVisible();

    const deleteButton = screen.getAllByTestId(deleteBtnTestId);
    expect(deleteButton).toHaveLength(3);
    expect(deleteButton[0]).toBeVisible();
    expect(deleteButton[1]).toBeVisible();
    expect(deleteButton[2]).toBeVisible();

    userEvent.click(deleteButton[0]);
    userEvent.click(deleteButton[1]);
    userEvent.click(deleteButton[2]);

    const headerTotalAfterDelete = screen.getByTestId(totalHeaderTestId);
    expect(headerTotalAfterDelete.innerHTML).toBe('0.00');
    expect(insideTableDescAfterEditS).not.toBeVisible();
    expect(insideTableDescAfterEditV).not.toBeVisible();
    expect(insideTableDescAfterEditT).not.toBeVisible();
  });
});
