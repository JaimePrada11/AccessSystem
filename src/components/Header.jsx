import React, { useState, useEffect } from 'react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, []);

  const user = {
    name: "John Doe",
    avatar: "https://images.squarespace-cdn.com/content/v1/656f4e4dababbd7c042c4946/82bec838-05c8-4d68-b173-2284a6ad4e52/how-to-stop-being-a-people-pleaser"
  };

  return (
    <header className="header flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-500" size={24}>🕒</span>
          <div
            className="w-64 h-10 pl-10 pr-4 py-2 text-gray-800 placeholder-gray-500 rounded-md  focus:outline-none focus:ring-0  flex items-center"
          >
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div className="storage_header-profileImg flex items-center space-x-2 mr-5">
        <div className="storage_header-imgContainer">
          <img src={user.avatar} alt="User Profile" width={30} height={30} className="rounded-full w-12" />
        </div>
        <span className="text-gray-800 font-medium">{user.name}</span>
      </div>
    </header>
  );
};

export default Header;
