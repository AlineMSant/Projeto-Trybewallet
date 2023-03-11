import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExpenses } from '../redux/actions';

class Table extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { dispatch } = this.props;
    const idItem = parseFloat(event.target.value);
    console.log(typeof idItem);
    console.log(idItem);
    dispatch(deleteExpenses(idItem));
  }

  render() {
    const { allExpenses } = this.props;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            { allExpenses.map((expense, index) => (
              <tr key={ index } value={ index }>
                <td>{ expense.description }</td>
                <td>{ expense.tag }</td>
                <td>{ expense.method }</td>
                <td>{ parseFloat(expense.value).toFixed(2) }</td>
                <td>
                  {expense.exchangeRates[expense.currency].name}
                </td>
                <td>
                  {parseFloat(expense.exchangeRates[expense.currency].ask).toFixed(2)}

                </td>
                <td>
                  {parseFloat(expense.value * expense
                    .exchangeRates[expense.currency].ask).toFixed(2)}

                </td>
                <td>Real</td>
                <td>
                  <button
                    data-testid="delete-btn"
                    onClick={ this.handleClick }
                    value={ index }
                  >
                    Excluir
                  </button>
                </td>
              </tr>)) }
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  allExpenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    description: PropTypes.string,
    eschangeRates: PropTypes.objectOf(PropTypes.objectOf.string),
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  allExpenses: state.wallet.expenses,
});

export default connect(mapStateToProps)(Table);
