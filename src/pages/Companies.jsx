import React from 'react';
import { FaBuilding } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { Link } from 'react-router-dom'; // Import the Link component

const Companies = () => {

  const data = [
    {
      id: 1,
      name: "claro"
    },
    {
      id: 2,
      name: "movistar"
    },
    {
      id: 3,
      name: "claro"
    },
    {
      id: 4,
      name: "claro"
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="w-full">
        <img
          src="https://images.pexels.com/photos/417192/pexels-photo-417192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className="shadow-xl w-full h-64 object-cover rounded-lg"
          alt="Building"
        />
      </div>
      <div className="w-full flex flex-wrap justify-center gap-6 mt-6">
        {data.length > 0 ? (
          data.map((item, index) => (
            <Link to={`/company/${item.id}`} key={index} className="bg-white/10 backdrop-blur-lg p-6 transform transition-transform duration-300 hover:scale-105 rounded-xl flex flex-col items-center shadow-lg">
              <FaBuilding size={50} className="text-gray-800 mt-4" />
              <div className="text-center mt-4">
                <div className="font-bold text-lg text-gray-800 uppercase tracking-wide">
                  {item.name}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex justify-center items-center w-full">
            <MdOutlineAddCircleOutline size={100} className="text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
