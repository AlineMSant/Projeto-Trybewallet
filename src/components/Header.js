import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      headerCurrency: 'BRL',
    };
  }

  render() {
    const { email, expenses } = this.props;
    const { headerCurrency } = this.state;

    const totalCurrency = expenses.reduce((acc, curr) => {
      const { currency, value, exchangeRates } = curr;
      const rate = exchangeRates[currency].ask;
      const totalRate = value * rate;
      return acc + totalRate;
    }, 0);

    return (
      <div>
        <h3 data-testid="email-field">{ email }</h3>

        <h3>
          Dispesa total:
          <p data-testid="total-field">
            { totalCurrency.toFixed(2) }
          </p>
          <p data-testid="header-currency-field">
            { headerCurrency }
          </p>
        </h3>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user.email,
  expenses: state.wallet.expenses,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    description: PropTypes.string,
    eschangeRates: PropTypes.objectOf(PropTypes.objectOf.string),
  })).isRequired,
};

export default connect(mapStateToProps)(Header);
