
import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import CRUD from './components/crud.js'
import BattleRoyal from './components/battleroyal.js'
import Landing from './components/landing.js'

const App = () => {
    return (
        <div>
            <Link to="/battleroyal">battleroyal</Link>
            <Link to="/crud">crud</Link>
            <Link to="/landing">landing</Link>

            <Switch>
                <Route exact path='/' component={CRUD} />
                <Route exact path='/landing' component={Landing} />
                <Route exact path='/crud' component={CRUD} />
                <Route
                path='/battleroyal'
                render={(props) => <BattleRoyal {...props} extra={"123"} />}
                />
            </Switch>
        </div>
    )
  }

  export default App