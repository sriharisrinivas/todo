import React from 'react';
import AddTaskComponent from '../AddTaskComponent/AddTaskComponent';
import TaskList from '../TaskList/tasklist';
import { Col, Row } from 'react-bootstrap';

function ContentContainer() {
    return (
        <>
            <Row className="d-flex" style={{ width: "84%"}}>
                <Col className='home-container pt-3'>
                    <AddTaskComponent />
                    <br />
                    <TaskList />
                </Col>
            </Row>
        </>
    );
}

export default ContentContainer;