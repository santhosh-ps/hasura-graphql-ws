import './App.css';
import { UserList } from './User';


function App() {
  const onNewToken = async() => {
    const tokenPayload = await ( await fetch(`${process.env.REACT_APP_API_URL}/.netlify/functions/token`)).json();
    console.log(tokenPayload);
    const url = `${window.location.origin}?token=${tokenPayload.token}`;
    console.log(url);
    window.location.href = url; 
  }
  return (
    <div className="App">
    <button onClick={onNewToken}>New Token</button>
     <UserList/>
    </div>
  );
}

export default App;
