export const SAVED_USER = 'SAVED_USER';
export const SAVE_CURRENCY = 'SAVE_CURRENCY';
export const SAVE_EXPENSES = 'SAVE_EXPENSES';

export const savedUser = (email) => ({
  type: SAVED_USER,
  payload: email,
});

export const saveCurrency = (currency) => ({
  type: SAVE_CURRENCY,
  payload: currency,
});

export const saveExpenses = (expenses) => ({
  type: SAVE_EXPENSES,
  payload: expenses,
});

export function generateCurrency() {
  return (dispatch) => {
    fetch('https://economia.awesomeapi.com.br/json/all')
      .then((response) => response.json())
      .then((data) => dispatch(saveCurrency(Object.keys(data)
        .filter((moeda) => moeda !== 'USDT'))));
  };
}
