// Esse reducer será responsável por tratar as informações da pessoa usuária
import { SAVED_USER } from '../actions';

const INITIAL_STATE = {
  email: '', // string que armazena o email da pessoa usuária
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVED_USER:
    return {
      ...state,
      email: action.payload,
    };

  default:
    return state;
  }
};

export default user;
