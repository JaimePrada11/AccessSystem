import React, { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Table = ({ columns, data, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full table-auto border-collapse rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 rounded-t-lg">
                            {columns.map((col) => (
                                <th key={col.accessor} className="px-4 py-2 text-center text-gray-700">{col.Header}</th>
                            ))}
                            <th className="px-4 py-2 text-center text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row, index) => (
                            <tr key={index} className={`bg-white`}>
                                {columns.map((col) => (
                                    <td key={col.accessor} className="px-4 py-2 text-center text-gray-600">{row[col.accessor]}</td>
                                ))}
                                <td className="px-4 py-2 text-left flex flex-col md:flex-row  justify-center space-x-2 items-center">
                                    <button
                                        onClick={() => onEdit(row)}
                                        className="px-3 py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                                    >
                                        <FaEdit className="mr-1 text-blue-500 text-xl" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(row)}
                                        className="px-3 py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                                    >
                                        <MdDelete className="mr-1 text-red-500 text-xl" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div> <div className="flex justify-between items-center py-3">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>

    );
};

export default Table;
