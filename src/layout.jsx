import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className='lg:ml-45  md:ml-20 '>
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Menu />
        <main className="flex-1 p-4 overflow-auto bg-gray-50 md:ml-20 lg:ml-45 bg-red-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
