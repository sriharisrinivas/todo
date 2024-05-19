import moment from 'moment';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import AddTaskComponent from '../AddTaskComponent/AddTaskComponent';
import { API_END_POINTS, CONSTANTS } from '../../config';
import { fetchTodos } from '../../Redux/Action/TodosAction';
import { useDispatch } from 'react-redux';


function TaskItem({ item }) {

    const dispatch = useDispatch();

    const [selectedRowDetails, setSelectedRowDetails] = useState(undefined);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const onUpdateTask = async (item, isDelete = false) => {
        let url = CONSTANTS.SERVICE_URL + API_END_POINTS.UPDATE_TODO;

        let payload = {
            title: item["TITLE"],
            description: item["DESCRIPTION"] ? item["DESCRIPTION"] : "",
            status: item["STATUS"] == 1 ? 2 : 1,
            severity: item["SEVERITY"],
            category: item["CATEGORY"],
            taskDate: new Date(item["TASK_DATE"]),
            taskId: item["TASK_ID"]
        };

        if (isDelete) {
            payload.status = 3;
        }

        let options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        };

        dispatch(fetchTodos());
        await fetch(url, options);
    };

    const onToggleStatus = (item) => {
        onUpdateTask(item);
    };

    const onDeleteTask = (item) => {
        onUpdateTask(item, true);
    };

    const callBack = () => {
        handleClose();
        setSelectedRowDetails(undefined);
    };

    const onEditTask = (item) => {
        setSelectedRowDetails(item);
        setShow(true);
    };

    return (
        // <Row className='card mt-2 mb-2'>
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTaskComponent selectedRowDetails={selectedRowDetails} callBack={callBack} />
                </Modal.Body>
            </Modal>


            <Row className={`task-item-container ${item.STATUS == 2 || item.STATUS == 3 ? "dynamic-task-item-container" : ''}`}>
                <Col className='d-flex align-items-center task-name-container'>
                    <Form.Check disabled={item["STATUS"] == 3} checked={item["STATUS"] == 2} onChange={() => onToggleStatus(item)} />
                    <p>{item["TITLE"]}</p>
                </Col>

                <Col className='task-header-and-value-wrapper'>
                    <Form.Text className='task-heading'>Severity: </Form.Text>
                    <Form.Text>{item["SEVERITY_DESC"]}</Form.Text>
                </Col>

                <Col className='task-header-and-value-wrapper'>
                    <Form.Text className='task-heading'>Status: </Form.Text>
                    <Form.Text>{item["STATUS_DESC"]}</Form.Text>
                </Col>

                <Col className='task-header-and-value-wrapper'>
                    <Form.Text className='task-heading'>Category: </Form.Text>
                    <Form.Text>{item["CATEGORY_DESC"]}</Form.Text>
                </Col>

                <Col className='task-header-and-value-wrapper'>
                    {item["TASK_DATE"] && <Form.Text className='task-heading'>Task Date: </Form.Text>}

                    {
                        item["TASK_DATE"] ?
                            <Form.Text>{moment(item["TASK_DATE"]).format("DD-MM-YYYY")}</Form.Text> :
                            <Form.Text>&nbsp;</Form.Text>
                    }
                </Col>

                <Col className='d-flex align-items-center'>
                    {/* {
                        item.rowSelected ?
                            <button className='task-edit-btn btn btn-primary mb-1' onClick={() => { onUpdate(item); }}>Update</button> :
                            <button className='task-edit-btn btn btn-primary mb-1' onClick={() => { onEditTask(item); }}>Edit</button>
                    } */}
                    <button disabled={item["STATUS"] != 1} className='task-edit-btn btn btn-primary' onClick={() => { onEditTask(item); }}>Edit</button>

                    {item["STATUS"] != 3 &&
                        <Col className='ms-2 mt-1'>
                            <i className='fa fa-trash mt-1' onClick={() => { onDeleteTask(item); }}></i>
                        </Col>
                    }

                </Col>
            </Row>
        </>

        // </Row>
    );
}

export default TaskItem;