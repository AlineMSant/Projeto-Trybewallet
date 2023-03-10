import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveExpenses } from '../redux/actions';

class WalletForm extends Component {
  constructor() {
    super();

    this.state = {
      id: 0,
      value: 0,
      currency: 'USD',
      method: 'dinheiro',
      tag: 'alimentação',
      description: '',
      allExpenses: [],
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.dispatchFunc = this.dispatchFunc.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  handleClick() {
    const { id, value, currency, method, tag, description } = this.state;
    const { exchangeRates } = this.props;

    this.setState((prevState) => ({
      allExpenses: [...prevState.allExpenses, {
        id,
        value,
        currency,
        method,
        tag,
        description,
        exchangeRates }],
    }), () => this.dispatchFunc());

    this.setState({
      id: id + 1,
      value: 0,
      currency: 'USD',
      method: 'dinheiro',
      tag: 'alimentação',
      description: '',
    });

    // https://pt.stackoverflow.com/questions/341596/fun%C3%A7%C3%A3o-reset-form-em-js-n%C3%A3o-funciona#:~:text=Ao%20clicar%20no%20bot%C3%A3o%20ser%C3%A1,ou%20palavras%20reservadas%20da%20linguagem.
    const form = document.getElementById('form');
    form.reset();
  }

  dispatchFunc() {
    const { allExpenses } = this.state;
    const { dispatch } = this.props;
    return dispatch(saveExpenses(allExpenses));
  }

  render() {
    const { currencies } = this.props;

    return (
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
            <option value="dinheiro">Dinheiro</option>
            <option value="credito">Cartão de crédito</option>
            <option value="debito">Cartão de débito</option>
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
            <option value="alimentacao">Alimentação</option>
            <option value="lazer">Lazer</option>
            <option value="trabalho">Trabalho</option>
            <option value="transporte">Transporte</option>
            <option value="saude">Saúde</option>
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

        <button
          type="button"
          onClick={ this.handleClick }
        >
          Adicionar despesa
        </button>

      </form>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  exchangeRates: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export default connect()(WalletForm);
