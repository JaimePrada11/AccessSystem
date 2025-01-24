import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import Table from '../components/Table'
import { IoMdAddCircle } from "react-icons/io";
import Modal from '../components/Modal'; 

const API_URL = 'https://rickandmortyapi.com/api/character/';

function CompanyInfo() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Status', accessor: 'status' },
        { Header: 'Species', accessor: 'species' },
        { Header: 'Gender', accessor: 'gender' },
        { Header: 'Location', accessor: 'locationName' },
    ];

    const fetchData = async (page) => {
        try {
            const response = await fetch(`${API_URL}?page=${page}`);
            const result = await response.json();

            const modifiedData = result.results.map((character) => ({
                ...character,
                locationName: character.location?.name || 'Unknown',
            }));

            setData(modifiedData);
            setFilteredData(modifiedData);
            setTotalPages(result.info.pages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredData(data);
        } else {
            const results = data.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(results);
        }
    }, [searchTerm, data]); 

    const handleEdit = (row) => {
        setEditData(row);
        setModalOpen(true);
    };

    const handleDelete = (row) => {
        const filteredData = data.filter((item) => item.id !== row.id);
        setData(filteredData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedData = data.map((item) => 
            item.id === editData.id ? editData : item
        );
        setData(updatedData);
        setModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6">

            <div className="mx-auto flex flex-col items-center rounded-lg w-full">
                <div className="w-[90%]">
                    <img
                        src="https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        className="shadow-xl w-full h-64 object-cover rounded-md"
                        alt="Edificio"
                    />
                </div>

                <div className="w-full flex flex-row justify-between items-center gap-4 p-4">
                    <div className="relative flex items-center w-full max-w-md">
                        <CiSearch className="absolute left-3 text-gray-500" size={24} />
                        <input
                            type="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 h-10 pl-10 pr-4 py-2 bg-white text-gray-800 placeholder-gray-500 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div className="w-full max-w-md flex justify-end">
                        <button className="w-32 h-10 bg-blue-600 text-white px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:scale-105">
                            <IoMdAddCircle className="text-xl" /> Add New
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <Table
                        columns={columns}
                        data={filteredData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <h2 className="text-xl font-bold mb-4">Edit Data</h2>
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2">
                            Name:
                            <input
                                type="text"
                                value={editData.name || ''}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            Status:
                            <input
                                type="text"
                                value={editData.status || ''}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            Species:
                            <input
                                type="text"
                                value={editData.species || ''}
                                onChange={(e) => setEditData({ ...editData, species: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            Gender:
                            <input
                                type="text"
                                value={editData.gender || ''}
                                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            Location:
                            <input
                                type="text"
                                value={editData.locationName || ''}
                                onChange={(e) => setEditData({ ...editData, locationName: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                            />
                        </label>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Save</button>
                        <button type="button" onClick={() => setModalOpen(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default CompanyInfo
