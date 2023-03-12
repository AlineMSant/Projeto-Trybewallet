export const SAVED_USER = 'SAVED_USER';
export const SAVE_CURRENCY = 'SAVE_CURRENCY';
export const SAVE_EXPENSES = 'SAVE_EXPENSES';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
// export const EDIT_EXPENSE = 'EDIT_EXPENSE';
export const CHANGE_EXPENSE = 'CHANGE_EXPENSE';
export const EDIT_ARRAY_EXPENSE = 'EDIT_ARRAY_EXPENSE';

export const savedUser = (email) => ({
  type: SAVED_USER,
  payload: email,
});

export const saveCurrency = (currency) => ({
  type: SAVE_CURRENCY,
  payload: currency,
});

export const saveExpenses = (objExpenses) => ({
  type: SAVE_EXPENSES,
  payload: objExpenses,
});

export const deleteExpenses = (id) => ({
  type: DELETE_EXPENSE,
  payload: id,
});

export const changeExpense = (booleano, idToEdit) => ({
  type: CHANGE_EXPENSE,
  booleano,
  idToEdit,
});

export const editArrayExpenses = (obj) => ({
  type: EDIT_ARRAY_EXPENSE,
  payload: obj,
});

// export const editExpenses = () => ({
//   type: EDIT_EXPENSE,
// });

const URL = 'https://economia.awesomeapi.com.br/json/all';

export function generateCurrency() {
  return (dispatch) => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => dispatch(saveCurrency(Object.keys(data)
        .filter((moeda) => moeda !== 'USDT'))));
  };
}

export function generateExpenses(info) {
  // info[exchangeRates] = data;

  return (dispatch) => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const objExpenses = {
          ...info,
          exchangeRates: data,
        };

        dispatch(saveExpenses(objExpenses));
      });
  };
}

export function changeArrayExpenses(info) {
  return (dispatch) => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const obj = {
          ...info,
          exchangeRates: data,
        };

        dispatch(editArrayExpenses(obj));
      });
  };
}
