import animationData from 'assets/lotties/loading.json';
import React from 'react';
import './index.scss';
import Lottie from 'lottie-react';

const Loading: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="loading-container">
      <Lottie animationData={animationData} loop={true}
      autoplay={true}
      style={{ height: 100, width: 100 }}  />
    </div>
  );
};

export default Loading;
