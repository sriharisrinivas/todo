import React, { useState } from 'react';
import { Button, Col, Collapse, Form, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { API_END_POINTS, CONSTANTS } from '../../config';
import { useDispatch } from 'react-redux';
import { fetchTodos } from '../../Redux/Action/TodosAction';

const initialFields = {
    title: "",
    description: "",
    status: 1,
    severity: 1,
    category: 1,
    taskCreatedDate: '',
    taskDate: ''
};

function AddTaskComponent() {

    const [fields, setFields] = useState(initialFields);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(true);

    const handleChange = (e) => {
        setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmitTask = async () => {
        let url = CONSTANTS.SERVICE_URL + API_END_POINTS.CREATE_TODO;
        let payload = { ...fields };
        payload.taskCreatedDate = new Date();
        payload.taskDate = new Date();
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify(fields)
        };
        const response = await fetch(url, options);
        dispatch(fetchTodos());
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <Form.Text className='task-main-title'>Create a Task</Form.Text>
                {open ?
                    <i class="fa-solid fa-caret-up" onClick={() => { setOpen(false); }}></i> :
                    <i class="fa-solid fa-caret-down" onClick={() => { setOpen(true); }}></i>}
            </div>
            <Collapse in={open}>
                <Row>
                    <Col className='card task-card'>


                        <Form.Group>
                            <Form.Label><span className='field-required'>* </span>Task</Form.Label>
                            {/* <Form.Label>Task Description</Form.Label> */}

                            <Form.Control className="todo-field" size="lg" type="text" name={"title"} value={fields.title} onChange={handleChange} placeholder='Enter a Task...' />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control className="todo-field" size="lg" type="text" name={"description"} value={fields.description} onChange={handleChange} placeholder='Enter the Description...' />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Severity</Form.Label>
                                    <Form.Select className="todo-field" name={"severity"} value={fields.severity} onChange={handleChange} size='lg'>
                                        <option value={1}>None</option>
                                        <option value={2}>Low</option>
                                        <option value={3}>High</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>

                                    <Form.Select className="todo-field" name={"category"} value={fields.category} onChange={handleChange} size='lg'>
                                        <option value={1}>Personal</option>
                                        <option value={2}>Work</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>Task to be done date</Form.Label> <br />
                            <DatePicker
                                showIcon
                                toggleCalendarOnIconClick
                                selected={fields.taskDate}
                                onChange={(date) => setFields(prev => ({ ...prev, taskDate: date }))}
                            />
                        </Form.Group>

                        <div>
                            <button className='btn btn-outline-warning' onClick={onSubmitTask} >Submit</button>
                        </div>
                    </Col>
                </Row>
            </Collapse>
        </>
    );
}

export default AddTaskComponent;