export const SAVED_USER = 'SAVED_USER';

export const savedUser = (email) => ({
  type: SAVED_USER,
  payload: email,
});
