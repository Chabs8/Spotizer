import logo from './logo.svg';
import './App.css';
import {
  getAlbum
} from "./utils/function";

function App() {
  return (
    <div className="App" onLoad={getAlbum()}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React with Bap
        </a>
      </header>
    </div>
  );
}

export default App;
