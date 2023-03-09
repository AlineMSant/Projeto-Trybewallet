import React from 'react';

class Login extends React.Component {
  render() {
    return (
      <div>
        <input
          type="textbox"
          data-testid="email-input"
        />
        <input
          type="textbox"
          data-testid="password-input"
        />
        <button>Entrar</button>
      </div>
    );
  }
}

export default Login;
