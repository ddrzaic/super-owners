

import React from 'react';
import Main from './components/Main';
import Navbar from './components/Navbar';
import './App.css';
import { useHistory } from 'react-router-dom';

function App() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = React.useState('');
  React.useEffect(() => {
    document.addEventListener("userChanged", () => {
      setCurrentUser(localStorage.getItem('user_email'));
      console.log("Event catched");
    });
    setCurrentUser(localStorage.getItem('user_email'));
  }, []);



  return (
    <div>
      <Navbar userEmail={currentUser} history = {history} />
      <div className="container">
        <Main></Main>
      </div>
    </div>
  );
}

export default App;
