import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import { generateCurrency } from '../redux/actions';

class Wallet extends React.Component {
  constructor() {
    super();

    this.state = {
      exchangeRates: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(generateCurrency());

    fetch('https://economia.awesomeapi.com.br/json/all')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          exchangeRates: data,
        });
      });
  }

  render() {
    const { currencies } = this.props;
    const { exchangeRates } = this.state;

    return (
      <div>
        <Header />
        <WalletForm currencies={ currencies } exchangeRates={ exchangeRates } />
      </div>
    );
  }
}

Wallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
});

export default connect(mapStateToProps)(Wallet);
