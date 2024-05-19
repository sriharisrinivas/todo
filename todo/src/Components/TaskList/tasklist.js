import React, { useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import TaskItem from '../TaskItem/taskitem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from '../../Redux/Action/TodosAction';

function TaskList() {

    const todosList = useSelector(state => state.todosListReducer.todosList);
    console.log("🚀 ~ TaskList ~ todosList:", todosList)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodos());
    }, []);

    return (
        <Row className='card task-card mt-2 mb-2'>
            <Col className="task-list-container">
                <Form.Text className='task-main-title'>Tasks</Form.Text>

                <Row>
                    {todosList.map(item => 
                        <Col sm={12} >
                            <TaskItem item={item} />
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
}

export default TaskList;