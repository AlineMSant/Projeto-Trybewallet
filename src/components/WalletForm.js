import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeExpense, editArrayExpenses, generateExpenses } from '../redux/actions';
import Table from './Table';

class WalletForm extends Component {
  constructor() {
    super();

    this.state = {
      id: 0,
      value: 0,
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  handleClick() {
    const { dispatch } = this.props;
    dispatch(generateExpenses(this.state));

    this.setState((prevState) => ({
      id: prevState.id + 1,
      value: 0,
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    }));

    // https://pt.stackoverflow.com/questions/341596/fun%C3%A7%C3%A3o-reset-form-em-js-n%C3%A3o-funciona#:~:text=Ao%20clicar%20no%20bot%C3%A3o%20ser%C3%A1,ou%20palavras%20reservadas%20da%20linguagem.
    const form = document.getElementById('form');
    form.reset();
  }

  handleClickEdit() {
    const { dispatch, idToEdit } = this.props;
    const { value, description, currency, method, tag } = this.state;

    const obj = {
      id: idToEdit,
      value,
      description,
      currency,
      method,
      tag,
    };

    dispatch(editArrayExpenses(obj));
    dispatch(changeExpense(false, 0));

    // https://pt.stackoverflow.com/questions/341596/fun%C3%A7%C3%A3o-reset-form-em-js-n%C3%A3o-funciona#:~:text=Ao%20clicar%20no%20bot%C3%A3o%20ser%C3%A1,ou%20palavras%20reservadas%20da%20linguagem.
    const form = document.getElementById('form');
    form.reset();
  }

  render() {
    const { currencies, edit } = this.props;

    return (

      <div>

        <form id="form">
          <label htmlFor="value">
            Valor:
            <input
              type="number"
              id="value"
              name="value"
              data-testid="value-input"
              onChange={ this.handleChange }
            />
          </label>

          <label htmlFor="currency">
            Moeda:
            <select
              data-testid="currency-input"
              id="currency"
              name="currency"
              onChange={ this.handleChange }
            >
              { currencies
                .map((currency, index) => (
                  <option
                    key={ index }
                    value={ currency }
                  >
                    { currency }

                  </option>))}
            </select>
          </label>

          <label htmlFor="method">
            Método de pagamento:
            <select
              id="method"
              name="method"
              data-testid="method-input"
              onChange={ this.handleChange }
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </label>

          <label htmlFor="tag">
            Tag:
            <select
              id="tag"
              name="tag"
              data-testid="tag-input"
              onChange={ this.handleChange }
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
          </label>

          <label htmlFor="description">
            Descrição:
            <input
              type="textbox"
              id="description"
              name="description"
              data-testid="description-input"
              onChange={ this.handleChange }
            />
          </label>

          { edit
            ? (
              <button
                type="button"
                onClick={ this.handleClickEdit }
              >
                Editar despesa
              </button>)

            : (
              <button
                type="button"
                onClick={ this.handleClick }
              >
                Adicionar despesa
              </button>)}

        </form>

        <Table />
      </div>
    );
  }
}

WalletForm.propTypes = {
  // allExpenses: PropTypes.arrayOf(PropTypes.shape({
  //   id: PropTypes.number,
  //   value: PropTypes.string,
  //   currency: PropTypes.string,
  //   method: PropTypes.string,
  //   description: PropTypes.string,
  //   eschangeRates: PropTypes.objectOf(PropTypes.objectOf.string),
  // })).isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  allExpenses: state.wallet.expenses,
  edit: state.wallet.editor,
  idToEdit: state.wallet.idToEdit,
});

export default connect(mapStateToProps)(WalletForm);
