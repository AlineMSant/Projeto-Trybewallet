import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeExpense, deleteExpenses } from '../redux/actions';
// import { editExpenses  } from '../redux/actions';

class Table extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
  }

  handleClick(event) {
    const { dispatch } = this.props;
    const idItem = parseFloat(event.target.value);

    dispatch(deleteExpenses(idItem));
    // dispatch(editExpenses());
  }

  handleClickEdit(event) {
    const { dispatch } = this.props;
    const idToEdit = Number(event.target.value);
    dispatch(changeExpense(true, idToEdit));
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
            { allExpenses.map((expense) => (
              <tr key={ expense.id }>
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
                    data-testid="edit-btn"
                    onClick={ this.handleClickEdit }
                    value={ expense.id }
                  >
                    Editar
                  </button>

                  <button
                    data-testid="delete-btn"
                    onClick={ this.handleClick }
                    value={ expense.id }
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
