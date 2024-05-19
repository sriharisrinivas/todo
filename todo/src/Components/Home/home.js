
import React, { useState } from 'react';
import "./home.css";
import ContentContainer from '../ContentContainer/ContentContainer';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';


function Home() {
    return (
        <div>
            <Header />

            <div className='d-flex' style={{ height: "92vh" }}>
                <SideBar />
                <ContentContainer />
            </div>
        </div>

    );
}

export default Home;