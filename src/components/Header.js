import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../style/Header.css';
import logo from '../images/logo.png';
import coin from '../images/coin.png';
import user from '../images/user.png';

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
      <div className="header-container">
        <div className="behind-header-form" />
        <img className="img-wallet" src={ logo } alt="logo" />

        <div className="img-info-head">
          <img className="img-coin" src={ coin } alt="logo" />
          <h3 className="total-container">
            Total de despesas:
            <p data-testid="total-field">
              { totalCurrency.toFixed(2) }
            </p>
            <p data-testid="header-currency-field">
              { headerCurrency }
            </p>
          </h3>
        </div>

        <div className="img-info-head">
          <img className="img-user" src={ user } alt="logo" />
          <h3 className="email-header" data-testid="email-field">
            { email }
          </h3>
        </div>

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
