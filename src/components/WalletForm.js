import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WalletForm extends Component {
  render() {
    const { currencies } = this.props;

    return (
      <form>
        <label htmlFor="value">
          Valor:
          <input
            type="number"
            id="value"
            data-testid="value-input"
          />
        </label>

        <label htmlFor="currency">
          Moeda:
          <select data-testid="currency-input" id="currency">
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
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="credito">Cartão de crédito</option>
            <option value="debito">Cartão de débito</option>
          </select>
        </label>

        <label htmlFor="category">
          Tag:
          <select
            id="category"
            name="category"
            data-testid="tag-input"
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
            data-testid="description-input"
          />
        </label>
      </form>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default WalletForm;
