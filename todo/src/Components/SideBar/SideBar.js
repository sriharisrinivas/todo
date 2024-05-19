import React from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { Button, Col, Form, NavLink, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';

function SideBar() {
    return (
        <div style={{ display: 'flex', overflow: 'scroll initial' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/home" className="text-decoration-none" style={{ color: 'inherit' }}>
                        Sidebar
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink exact to="/home" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Home</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/home" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Add New Task</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/home" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="table">All Tasks</CDBSidebarMenuItem>
                        </NavLink>
                        {/* <NavLink exact to="/completedTasks" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="user">Completed Tasks</CDBSidebarMenuItem>
                        </NavLink> */}
                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px 5px',
                        }}
                    >
                        User Name
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
}

export default SideBar;