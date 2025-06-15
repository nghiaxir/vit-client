import { Col, Row } from 'antd';
import React from 'react';
import { LeftSide, Main, RightSide } from './components';
import './index.scss';

const Home: React.FC = () => {
    return (
        <div className="home mt-5 flex gap-2">
            <LeftSide />
            <Main />
            <RightSide />
        </div>
    );
};

export default Home;
