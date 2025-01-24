import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import Table from '../components/Table';
import { IoMdAddCircle } from "react-icons/io";
import Modal from '../components/Modal';

const Equipments = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [step, setStep] = useState(1);
    const [cedula, setCedula] = useState('');
    const [ownerData, setOwnerData] = useState(null);
    const [editData, setEditData] = useState({ id: null, serial: '', registrationDate: '', description: '', owner: '' });

    const initialData = [
        {
            id: 1,
            serial: "123456",
            registrationDate: "2023-01-01",
            description: "Example equipment",
            owner: "John Doe"
        },
        {
            id: 2,
            serial: "789012",
            registrationDate: "2023-05-10",
            description: "Another equipment",
            owner: "Jane Doe"
        }
    ];

    useEffect(() => {
        // Simulación de datos obtenidos de un API
        setData(initialData);
        setFilteredData(initialData);
    }, []);

    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.serial.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (startDate && endDate) {
            filtered = filtered.filter(item =>
                item.registrationDate >= startDate && item.registrationDate <= endDate
            );
        } else if (startDate) {
            filtered = filtered.filter(item => item.registrationDate >= startDate);
        } else if (endDate) {
            filtered = filtered.filter(item => item.registrationDate <= endDate);
        }

        setFilteredData(filtered);
    }, [searchTerm, startDate, endDate, data]);

    const fetchOwnerData = async (cedula) => {
        // Simulación de datos obtenidos de un API
        if (cedula === '1234') {
            const owner = { name: "Jaime" };
            setOwnerData(owner);
            setEditData({ ...editData, owner: owner.name });
            setStep(2);
        } else {
            alert('Owner not found');
        }
    };

    const handleSave = (newData) => {
        if (isEditing) {
            setData(data.map(item => (item.id === editData.id ? newData : item)));
        } else {
            setData([...data, { ...newData, id: data.length + 1 }]);
        }
        setModalOpen(false);
        setEditData({ id: null, serial: '', registrationDate: '', description: '', owner: '' });
        setStep(1);
    };

    const handleEdit = (item) => {
        setEditData(item);
        setIsEditing(true);
        setModalOpen(true);
        setStep(2);
    };

    const handleCheckCedula = () => {
        fetchOwnerData(cedula);
    };

    const handleAddNew = () => {
        setEditData({ id: null, serial: '', registrationDate: new Date().toISOString().split('T')[0], description: '', owner: '' });
        setIsEditing(false);
        setStep(1);
        setModalOpen(true);
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
                            placeholder="Search by serial"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 h-10 pl-10 pr-4 py-2 bg-white text-gray-800 placeholder-gray-500 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-40 h-10 p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-40 h-10 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        onClick={handleAddNew}
                        className="w-32 h-10 bg-blue-600 text-white px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:scale-105">
                        <IoMdAddCircle className="text-xl" /> Add New
                    </button>
                </div>

                <div className="mt-8 mb-6">
                    <Table columns={[
                        { Header: 'ID', accessor: 'id' },
                        { Header: 'Serial', accessor: 'serial' },
                        { Header: 'Registration Date', accessor: 'registrationDate' },
                        { Header: 'Owner', accessor: 'owner' },
                    ]} 
                    data={filteredData} 
                    handleEdit={handleEdit} />
                </div>
            </div>

            {modalOpen && (
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    {step === 1 ? (
                        <div>
                            <label className="block mb-2">
                                Enter Cedula:
                                <input
                                    type="text"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                                    required
                                />
                            </label>
                            <button onClick={handleCheckCedula} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
                                Check Cedula
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(editData); }}>
                            <label className="block mb-2">
                                Serial:
                                <input
                                    type="text"
                                    value={editData.serial}
                                    onChange={(e) => setEditData({ ...editData, serial: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Registration Date:
                                <input
                                    type="date"
                                    value={editData.registrationDate}
                                    readOnly
                                    className="w-full p-2 border rounded bg-gray-200"
                                />
                            </label>
                            <label className="block mb-2">
                                Description:
                                <input
                                    type="text"
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </label>
                            <label className="block mb-2">
                                Owner:
                                <input
                                    type="text"
                                    value={editData.owner}
                                    readOnly
                                    className="w-full p-2 border rounded bg-gray-200"
                                />
                            </label>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
}

export default Equipments;
