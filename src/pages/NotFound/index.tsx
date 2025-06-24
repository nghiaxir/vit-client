import animationData from 'assets/lotties/error-404.json';
import { LoginButton } from 'components';
import React from 'react';
// import Lottie from 'react-lottie';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const NotFound: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <Lottie animationData={animationData} loop={true}
      autoplay={true}
      style={{ height: 300, width: 300 }} 
      />
      <LoginButton onClick={() => navigate('/', { replace: true })}>
        quay lại trang chủ
      </LoginButton>
    </div>
  );
};

export default NotFound;
