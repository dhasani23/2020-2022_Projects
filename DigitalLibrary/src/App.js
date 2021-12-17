import './App.css';
import BookList from './Components/BookList.js';
import MyLibrary from './Components/MyLibrary.js';
import Button from '@material-ui/core/Button';
import libraryImage from './libraryImage.jpg';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <main>
        <h1 style={{textAlign:"center"}}>Digital Library</h1>
        <Link to="/library" style={{ textDecoration: 'none' }}><Button style={{float:"right", marginRight:75}} variant="contained" color="secondary">My Library</Button></Link> <br /> <br />
        <div style={{textAlign:"center"}}>
          <Link to="/search" style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">Find Books</Button></Link> <br /> <br />
        </div>
        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/library" component={Library} />
        </Switch>
        <div style={{textAlign:"center"}}>
          <img src={libraryImage} alt="libraryImage" style={{width:660, height:400}}></img>
          <p>© 2021 David Hasani</p>
        </div>
      </main>
    </Router>
  );
}

const Search = () => (
  <div style={{textAlign:"center", marginBottom:40}}>
    <BookList />
  </div>
);

const Library = () => (
  <div style={{textAlign:"center", marginTop:10}}>
    <MyLibrary />
  </div>
);

export default App;
