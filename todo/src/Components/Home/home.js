
import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "./home.css";
import AddTaskComponent from '../AddTaskComponent/AddTaskComponent';
import TaskList from '../TaskList/tasklist';
import ContentContainer from '../ContentContainer/ContentContainer';


function Home() {
    return (
        <Row className="App d-flex">
            <Col md="3">
                <Sidebar>
                    <Menu
                        menuItemStyles={{
                            button: {
                                // the active class will be added automatically by react router
                                // so we can use it to style the active menu item
                                [`&.active`]: {
                                    backgroundColor: '#13395e',
                                    color: '#b6c8d9',
                                },
                            },
                        }}>
                        <SubMenu label="Charts">
                            <MenuItem> Pie charts </MenuItem>
                            <MenuItem> Line charts </MenuItem>
                        </SubMenu>
                        <MenuItem> Documentation </MenuItem>
                        <MenuItem> Calendar </MenuItem>
                    </Menu>
                </Sidebar>
            </Col>

            <Col className='home-container' md="9">
                <ContentContainer />
            </Col>


        </Row>

    );
}

export default Home;