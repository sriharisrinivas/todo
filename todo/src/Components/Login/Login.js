import React, { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import LoginSignUpForm from '../LoginSignUpForm/LoginSignUpForm';

function Login() {


    return (
        <Container fluid className='login-page'>
            <Row>
                <Col sm="none" md="none" lg="8" className='login-left-section'>

                </Col>
                <Col sm="12" md="12" lg="4" className='login-signup-container card'>
                   <LoginSignUpForm />
                </Col>
            </Row>

        </Container>
    );
}

export default Login;