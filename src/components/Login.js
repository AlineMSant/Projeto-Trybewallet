import React from 'react';

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
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    }, () => this.disableBtn());
  }

  disableBtn() {
    const {
      email,
      password,
    } = this.state;

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
        >
          Entrar

        </button>
      </div>
    );
  }
}

export default Login;
