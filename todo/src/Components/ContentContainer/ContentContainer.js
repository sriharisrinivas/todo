import React from 'react';
import AddTaskComponent from '../AddTaskComponent/AddTaskComponent';
import TaskList from '../TaskList/tasklist';
import { Col, Row } from 'react-bootstrap';

function ContentContainer() {
    return (
       <Row>
         <Col md="8">
            <div className="">
                <AddTaskComponent />
            </div>

            <div className='mt-5 mb-5'>
                <TaskList />
            </div>
        </Col>
       </Row>
    );
}

export default ContentContainer;