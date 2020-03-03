import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';
import { GuessPage } from './pages/guess.page';
import { InputPage } from './pages/input.page';

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={GuessPage} />
        <Route exact path="/input" component={InputPage} />
      </Switch>
    </div>
  );
}

export default App;
