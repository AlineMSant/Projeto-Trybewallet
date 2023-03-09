import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { savedUser } from '../redux/actions';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      disabled: true,
    };

    this.disableBtn = this.disableBtn.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    }, () => this.disableBtn());
  }

  handleClick() {
    const { history, dispatch } = this.props;
    const { email } = this.state;

    dispatch(savedUser(email));

    history.push('/carteira');
  }

  disableBtn() {
    const {
      email,
      password,
    } = this.state;

    // https://horadecodar.com.br/2020/09/13como-validar-email-com-javascript/
    const validationEmail = /\S+@\S+\.\S+/;
    const number = 6;

    if (validationEmail.test(email) && password.length >= number) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  }

  render() {
    const { disabled } = this.state;
    return (
      <div>
        <input
          type="textbox"
          data-testid="email-input"
          name="email"
          onChange={ this.handleChange }
        />
        <input
          type="textbox"
          data-testid="password-input"
          name="password"
          onChange={ this.handleChange }
        />
        <button
          disabled={ disabled }
          onClick={ this.handleClick }
        >
          Entrar

        </button>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(null)(Login);
