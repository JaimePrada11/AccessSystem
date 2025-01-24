import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import Table from '../components/Table';
import { IoMdAddCircle } from "react-icons/io";
import Modal from '../components/Modal';

export default function CompanyInfo() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante' });
    const [isEditing, setIsEditing] = useState(false);
    const [filterType, setFilterType] = useState(null);

    const initialData = [
        {
            id: 1,
            name: "jaime",
            cedula: "123",
            phone: "1234",
            type: false
        }
    ];

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Cedula', accessor: 'cedula' },
        { Header: 'Phone', accessor: 'phone' },
        {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ value }) => (value ? 'Empleado' : 'Visitante')
        },
    ];

    const fetchData = async (page) => {
        setData(initialData);
        setFilteredData(initialData);
        setTotalPages(1);
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== null) {
            filtered = filtered.filter(item =>
                (filterType === 'empleado' && item.type === true) ||
                (filterType === 'visitante' && item.type === false)
            );
        }

        setFilteredData(filtered);
    }, [searchTerm, data, filterType]);

    const handleEdit = (row) => {
        setEditData(row);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = (row) => {
        const updatedData = data.filter((item) => item.id !== row.id);
        setData(updatedData);
        setFilteredData(updatedData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEditing) {
            const updatedData = data.map((item) =>
                item.id === editData.id ? editData : item
            );
            setData(updatedData);
            setFilteredData(updatedData);
        } else {
            const newCompany = { ...editData, id: data.length + 1, type: editData.type === 'empleado' };
            const updatedData = [...data, newCompany];
            setData(updatedData);
            setFilteredData(updatedData);
        }

        setEditData({ name: '', cedula: '', phone: '', type: 'visitante' });
        setIsEditing(false);
        setModalOpen(false);
    };

    const handleAddNew = () => {
        setEditData({ name: '', cedula: '', phone: '', type: 'visitante' });
        setIsEditing(false);
        setModalOpen(true);
    };

    const handleFilterClick = (type) => {
        if (filterType === type) {
            setFilterType(null);
        } else {
            setFilterType(type);
        }
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

                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 p-4">
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

                    <div className='flex flex-row gap-2 items-center justufy-center'>
                        <button
                            className={`w-24 h-10 rounded-md flex items-center justify-center ${filterType === 'empleado' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-700 transition-transform transform hover:scale-105`}
                            onClick={() => handleFilterClick('empleado')}>
                            Empleado
                        </button>
                        <button
                            className={`w-24 h-10 rounded-md flex items-center justify-center ${filterType === 'visitante' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-700 transition-transform transform hover:scale-105`}
                            onClick={() => handleFilterClick('visitante')}>
                            Visitante
                        </button>
                    </div>

                    <div className="w-full max-w-md flex  justify-center md:justify-end gap-2">


                        <button
                            onClick={handleAddNew}
                            className="w-32 h-10 bg-blue-600 text-white px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:scale-105">
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
                    <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Person' : 'Add New Company'}</h2>
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2">
                            Name:
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                                required
                            />
                        </label>
                        <label className="block mb-2">
                            Cedula:
                            <input
                                type="text"
                                value={editData.cedula}
                                onChange={(e) => setEditData({ ...editData, cedula: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                                required
                            />
                        </label>
                        <label className="block mb-2">
                            Phone:
                            <input
                                type="text"
                                value={editData.phone}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                className="w-full p-2 mt-1 border border-gray-300 rounded"
                                required
                            />
                        </label>
                        <label className="block mb-2">
                            Type:
                            <select
                                value={editData.type ? 'empleado' : 'visitante'}
                                onChange={(e) => setEditData({ ...editData, type: e.target.value === 'empleado' })}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            >
                                <option disabled=" Selecciona"> Selecciona</option>
                                <option value="visitante">Visitante</option>
                                <option value="empleado">Empleado</option>
                            </select>
                        </label>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Save</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
