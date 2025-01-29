import React from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';


const CardItem = ({ data, onEdit, onDelete, path, hidden }) => {
    return (
        <div className="flex items-start space-x-6 p-6 bg-white shadow rounded border border-gray-200">
            <div className="flex flex-col items-center justify-center">
                <Link to={path}>
                    <img src={data.image} alt="" className=" w-32 rounded-md bg-slate-100" />

                </Link>
                <div hidden={hidden} className="flex items-center space-x-2 mt-2">
                    <button
                        onClick={() => onEdit(data)} 
                        className="px-3 py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                    >
                        <FaEdit className="text-blue-500 text-xl" />
                    </button>
                    <button
                        onClick={() => onDelete(data)} 
                        className="px-3 py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                    >
                        <MdDelete className="text-red-500 text-xl" />
                    </button>
                </div>
            </div>
            <div className="min-w-0 relative flex-auto mt-4 md:mt-0 md:ml-6">
                <h2 className="font-semibold text-slate-900 truncate pr-20">{data.primary}</h2>
                <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
                    <div className="w-full flex items-center">
                        <dd>{data.secondary}</dd>
                    </div>
                    <div className="flex items-center mt-2">
                        <dd>{data.tertiary}</dd>
                    </div>
                    <div className="w-full flex items-center mt-2 font-normal">
                        <dd className="text-slate-400">{data.additional}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default CardItem;
