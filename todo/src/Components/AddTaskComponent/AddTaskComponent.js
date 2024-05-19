import React, { useEffect, useState } from 'react';
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

function AddTaskComponent({ selectedRowDetails, callBack }) {

    const [fields, setFields] = useState(initialFields);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(true);

    const [advancedOptions, setAdvancedOptions] = useState(false);

    const handleChange = (e) => {
        setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmitTask = async () => {
        let url = !selectedRowDetails ?
            (CONSTANTS.SERVICE_URL + API_END_POINTS.CREATE_TODO) :
            (CONSTANTS.SERVICE_URL + API_END_POINTS.UPDATE_TODO);

        let payload = { ...fields };
        payload.taskCreatedDate = new Date();
        payload.taskDate = payload.taskDate != "" ? payload.taskDate : new Date();

        let options = {
            method: selectedRowDetails ? "PUT" : 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        };

        await fetch(url, options);
        
        setFields(initialFields);
        dispatch(fetchTodos());

        if (selectedRowDetails) {
            callBack();
        }
    };

    useEffect(() => {
        if (selectedRowDetails) {
            setAdvancedOptions(true);
            setFields(pre => ({
                ...pre,
                title: selectedRowDetails["TITLE"],
                description: selectedRowDetails["DESCRIPTION"] ? selectedRowDetails["DESCRIPTION"] : "",
                status: selectedRowDetails["STATUS"],
                severity: selectedRowDetails["SEVERITY"],
                category: selectedRowDetails["CATEGORY"],
                // taskCreatedDate: '',
                taskDate: new Date(selectedRowDetails["TASK_DATE"]),
                taskId: selectedRowDetails["TASK_ID"]
            }));
        }
    }, [selectedRowDetails]);

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <Form.Text onClick={() => { setOpen(!open); }} className='task-main-title'>Create a Task</Form.Text>
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
                            <Form.Label className='me-3' onClick={() => { setAdvancedOptions(!advancedOptions); }}>Advanced options</Form.Label>
                            {advancedOptions ?
                                <i class="fa-solid fa-caret-up" onClick={() => { setAdvancedOptions(false); }}></i> :
                                <i class="fa-solid fa-caret-down" onClick={() => { setAdvancedOptions(true); }}></i>
                            }

                        </Form.Group>

                        {/* Advanced Options Toggle Container */}
                        <Collapse in={advancedOptions}>
                            <div className='adv-options-container'>
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
                            </div>
                        </Collapse>
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