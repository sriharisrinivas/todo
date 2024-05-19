import React from 'react';
import "./header.css";
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
// import { APP_NAME } from '../constants'
import { Link, useNavigate } from 'react-router-dom';
// import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

function Header(props) {
    const navigate = useNavigate();
    const onLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    };

    const darkModeState = true; //useSelector(state => state.darkModeReducer.isDarkMode);

    return (
        <div className='header-container'>
            <Navbar fixed='top' bg={darkModeState ? "dark" : "light"} data-bs-theme={darkModeState ? "dark" : "light"} collapseOnSelect expand="md" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/home   " className='app-header'>
                        <img src="/logo.png" width={40} height={40} />
                        <span className='ms-3'>TO-DO</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className='me-auto'></Nav>
                        <Nav>
                            <Nav.Link as={Link} to="/home">
                                {/* <Link to="/"> */}
                                Home
                                {/* </Link> */}
                            </Nav.Link>
                            {/* <Nav.Link href="">
                                {darkModeState ?
                                    <i class="fa-solid fa-moon" title="Dark Mode" onClick={() => { console.log("first");dispatch(lightModeAction()) }}></i> :
                                    <i class="fa-regular fa-sun" title="Light Mode" onClick={() => { console.log("first1"); dispatch(darkModeAction()) }}></i>}
                            </Nav.Link> */}
                            <Nav.Link eventKey={2} href="">
                                <button className='btn btn-warning logout-button' onClick={onLogout}>Logout</button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default (Header);