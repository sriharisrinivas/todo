import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

function TaskItem({item}) {
    return (
        <Row className='card mt-2 mb-2'>
            <Col className="task-item-container">
                <Form.Check />
                <p>{item["TITLE"]}</p>
            </Col>
        </Row>
    );
}

export default TaskItem;