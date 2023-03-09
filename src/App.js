import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route path="/carteira" />
        </Switch>
      </div>
    );
  }
}

export default App;
