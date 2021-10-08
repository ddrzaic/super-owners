import React from 'react';
import { Switch, Route} from 'react-router-dom';
import Owners from './Owners';
import Home from './Home'
import About from './About';
import OwnerDetails from './OwnerDetails';

function Main() {
  return (
      <main>
          <Switch>
              <Route exact path='/' component={Home}></Route>
              <Route exact path='/owners' component={Owners}></Route>
              <Route exact path='/about' component={About}></Route>
              <Route exact path='/owners/:id' component={OwnerDetails}></Route>
          </Switch>
      </main>
  );
}

export default Main;
