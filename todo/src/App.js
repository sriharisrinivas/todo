import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import Home from './Components/Home/home';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Col, Row } from 'react-bootstrap';
import { BrowserRouter, Route, Switch, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import { store } from './Redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        {/* <Home /> */}
        {/* <Login /> */}
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<Home />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
