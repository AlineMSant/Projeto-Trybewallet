// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
import { SAVE_CURRENCY, SAVE_EXPENSES, DELETE_EXPENSE, CHANGE_EXPENSE,
  EDIT_ARRAY_EXPENSE } from '../actions';

const INITIAL_STATE = {
  currencies: [], // array de string
  expenses: [], // array de objetos, com cada objeto tendo as chaves id, value, currency, method, tag, description e exchangeRates
  editor: false, // valor booleano que indica de uma despesa está sendo editada
  idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVE_CURRENCY:
    return {
      ...state,
      currencies: action.payload,
    };
  case SAVE_EXPENSES:
    return {
      ...state,
      expenses: [...state.expenses, action.payload],
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.length === 1 ? [] : state.expenses
        .filter((expense) => expense.id !== action.payload),
    };
  case CHANGE_EXPENSE:
    return {
      ...state,
      editor: action.booleano,
      idToEdit: action.idToEdit,
    };
  case EDIT_ARRAY_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.map((expense) => (expense.id === state
        .idToEdit ? { ...action.payload, exchangeRates: expense.exchangeRates }
        : expense)),
    };

  default:
    return state;
  }
};

export default wallet;
