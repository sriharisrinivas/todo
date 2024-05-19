import React, { useState } from 'react';
import AddTaskComponent from '../AddTaskComponent/AddTaskComponent';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { API_END_POINTS, CONSTANTS } from '../../config';
import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';

const initialLoginFields = {
    userName: 'sriharisrinivas46876',
    password: 'Srihari999'
};

const initialSignUpFields = {
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: 1,
    profilePic: ''
};

function LoginSignUpForm(props) {

    const navigate = useNavigate();

    const [formType, setFormType] = useState("login");
    const [alertMessage, setAlertMessage] = useState("");
    const [loginFields, setLoginFields] = useState(initialLoginFields);
    const [signUpFields, setSignUpFields] = useState(initialSignUpFields);

    const handleChange = (e) => {
        if (formType == "login") {
            setLoginFields(pre => ({ ...pre, [e.target.name]: e.target.value }));
        } else {
            setSignUpFields(pre => ({ ...pre, [e.target.name]: e.target.value }));
        }
    };

    const registerUser = async () => {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(signUpFields)
        };
        let url = CONSTANTS.SERVICE_URL + API_END_POINTS.CREATE_USER;
        let response = await fetch(url, options);
        let parsedResponse = await response.json();
        if (response.status == 200) {
            setAlertMessage("");
        } else {
            setAlertMessage(parsedResponse.message);
        }
    };

    const loginUser = async () => {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(loginFields)
        };
        let url = CONSTANTS.SERVICE_URL + API_END_POINTS.LOGIN;
        let response = await fetch(url, options);
        let parsedResponse = await response.json();
        if (response.status == 200) {
            setAlertMessage("");
            sessionStorage.setItem("token", parsedResponse.jwtToken)
            navigate("/home");
        } else {
            setAlertMessage(parsedResponse.message);
        }
        console.log("🚀 ~ loginUser ~ response:", response);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (formType == "login") {
            loginUser();
        } else {
            registerUser();
        }
    };


    return (
        <Container className='login-form card'>
            <Form.Text className='login-main-title'>{formType == "login" ? "Login" : "Sign Up"}</Form.Text>

            <Form.Group className='mt-3'>
                <Form.Label><span className='field-required'>* </span>User Name</Form.Label>
                {formType == "login" ?
                    <Form.Control  className="todo-field" size="lg" type="text" name={"userName"} value={loginFields.userName} onChange={handleChange} placeholder='Enter User Name...' /> :
                    <Form.Control  className="todo-field" size="lg" type="text" name={"userName"} value={signUpFields.userName} onChange={handleChange} placeholder='Enter User Name...' />
                }
            </Form.Group>

            {formType == "signup" &&
                <>
                    <Row>
                        <Col sm="12" md="6">
                            <Form.Group className='mt-3'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control  className="todo-field" name={"firstName"} value={signUpFields.firstName} onChange={handleChange} size='lg' />
                            </Form.Group>
                        </Col>

                        <Col sm="12" md="6">
                            <Form.Group className='mt-3'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control  className="todo-field" name={"lastName"} value={signUpFields.lastName} onChange={handleChange} size='lg' />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className='mt-3'>
                        <Form.Label>Gender</Form.Label>
                        <Row>
                            <Col>
                                <Form.Check type="radio" label="Male" name={"gender"} value={1} checked={signUpFields.gender == 1} onChange={handleChange} size='lg' />
                            </Col>
                            <Col>
                                <Form.Check type="radio" label="Female" name={"gender"} value={2} checked={signUpFields.gender == 2} onChange={handleChange} size='lg' />
                            </Col>
                        </Row>
                    </Form.Group>
                </>

            }

            <Form.Group className='mt-3'>
                <Form.Label><span className='field-required'>* </span>Password</Form.Label>
                {formType == "login" ?
                    <Form.Control  className="todo-field" size="lg" type="password" name={"password"} value={loginFields.password} onChange={handleChange} placeholder='Enter Password...' /> :
                    <Form.Control  className="todo-field" size="lg" type="password" name={"password"} value={signUpFields.password} onChange={handleChange} placeholder='Enter Password...' />
                }
            </Form.Group>

            <Form.Text className='field-required'>{alertMessage}</Form.Text>

            {formType == "login" ?
                <button className='btn btn-primary mt-4 mb-2' onClick={onSubmit} >Login</button> :
                <button className='btn btn-primary mt-4 mb-2' onClick={onSubmit} >Create User</button>
            }

            {formType == "login" ?
                <button onClick={() => { setFormType("signup"); }} className='btn btn-outline-warning mt-3 mb-2'>Sign Up</button> :
                <button onClick={() => { setFormType("login"); }} className='btn btn-outline-warning mt-3 mb-2'>Back To Login</button>
            }
        </Container>
    );
}

export default LoginSignUpForm