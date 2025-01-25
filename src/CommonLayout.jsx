import React from 'react';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircle } from "react-icons/io";

const CommonLayout = ({ titleImage, searchPlaceholder, searchValue, onSearchChange, onAddNew, extraButtons = [], extraInputs = [], children }) => {
    return (
        <div className="flex flex-col items-center space-y-6 p-6">
            <div className="w-full">
                <img
                    src={titleImage}
                    className="shadow-xl w-full h-64 object-cover rounded-lg"
                    alt="Background"
                />
            </div>
            <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 p-4">
                <div className="relative flex items-center w-full max-w-md">
                    <CiSearch className="absolute left-3 text-gray-500" size={24} />
                    <input
                        type="search"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={onSearchChange}
                        className="w-64 h-10 pl-10 pr-4 py-2 bg-white text-gray-800 placeholder-gray-500 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    {extraInputs.map((input, index) => (
                        <input
                            key={index}
                            type={input.type}
                            value={input.value}
                            onChange={input.onChange}
                            placeholder={input.placeholder}
                            className={`w-40 h-10 p-2 border border-gray-300 rounded-md ${input.className}`}
                        />
                    ))}
                </div>
                <div className="w-full max-w-md flex justify-center md:justify-end gap-2">
                    {extraButtons.map((button, index) => (
                        <button 
                            key={index}
                            onClick={button.onClick}
                            className={`w-32 h-10 ${button.className} text-white px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:scale-105`}
                        >
                            {button.icon}
                            {button.label}
                        </button>
                    ))}
                    <button 
                        onClick={onAddNew}
                        className="w-32 h-10 bg-blue-600 text-white px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:scale-105">
                        <IoMdAddCircle className="text-xl" /> Add New
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default CommonLayout;
