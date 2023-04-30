import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Landing, Login, Profile } from '../pages';
import ProtectedRouter from './ProtectedRouter';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRouter />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
