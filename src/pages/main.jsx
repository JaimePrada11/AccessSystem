import React from 'react';
import { FaBuilding, FaFingerprint } from "react-icons/fa6";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineExitToApp } from "react-icons/md";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MainContainer = () => {
  const menuItems = [
    { icon: <FaBuilding size={50} className="text-gray-800 mt-4" />, label: "Companies" },
    { icon: <IoMdPerson size={50} className="text-gray-800 mt-4" />, label: "Person" },
    { icon: <FaFingerprint size={50} className="text-gray-800 mt-4" />, label: "Entries" },
    { icon: <MdOutlineExitToApp size={50} className="text-gray-800 mt-4" />, label: "Exit" },
  ];

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="w-full">
        <img
          src="https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className="shadow-xl w-full h-64 object-cover rounded-lg"
          alt="Building"
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-6">
        <div className="w-full lg:w-2/3">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Rápido</h1>
          <div className="grid grid-cols-2 gap-6 mb-8 w-full">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-6 transform transition-transform duration-300 hover:scale-105 rounded-xl flex flex-col items-center "
              >
                {item.icon}
                <div className="text-center mt-4">
                  <div className="font-bold text-lg text-gray-800 uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex hidden items-center sm:block p-6 bg-white/10 backdrop-blur-lg rounded-xl transform transition-transform duration-300 hover:scale-105 items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Calendar</h2>
          <div className="p-4 rounded-lg ">
            <Calendar className="rounded-3xl text-xl bg-transparent " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
