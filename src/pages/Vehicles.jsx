import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircle } from "react-icons/io";
import Modal from '../components/Modal';

export default function Vehicle() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState({ plate: '', type: '', owner: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [filterType, setFilterType] = useState(null);
    const [step, setStep] = useState(1);
    const [ownerData, setOwnerData] = useState(null);
    const [cedula, setCedula] = useState('');

    const initialData = [
        {
            id: 1,
            plate: "ABC123",
            type: false, // false for Moto, true for Carro
            owner: "jaime"
        }
    ];

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Plate', accessor: 'plate' },
        { Header: 'Owner', accessor: 'owner' },
        {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ value }) => (value ? 'Carro' : 'Moto')
        },
    ];

    // GET
    const fetchData = async (page) => {
        /*
        try {
            const response = await fetch('http://localhost:8080/api/vehicles?page=' + page);
            const result = await response.json();
            setData(result.data);
            setFilteredData(result.data);
            setTotalPages(result.info.pages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        */
        // Utiliza el arreglo estático para pruebas
        setData(initialData);
        setFilteredData(initialData);
        setTotalPages(1);
    };

    const fetchOwnerData = async (cedula) => {
        /*
        try {
            const response = await fetch(`http://localhost:8080/api/owners?cedula=${cedula}`);
            const result = await response.json();
            if (result) {
                setOwnerData(result);
                setEditData({ ...editData, owner: result.name });
                setStep(2);
            } else {
                alert('Owner not found');
            }
        } catch (error) {
            console.error('Error fetching owner data:', error);
        }
        */
        // Utiliza datos estáticos para pruebas
        if (cedula === '1234') {
            const owner = { name: "Jaime" };
            setOwnerData(owner);
            setEditData({ ...editData, owner: owner.name });
            setStep(2);
        } else {
            alert('Owner not found');
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.plate.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== null) {
            filtered = filtered.filter(item =>
                (filterType === 'carro' && item.type === true) ||
                (filterType === 'moto' && item.type === false)
            );
        }

        setFilteredData(filtered);
    }, [searchTerm, data, filterType]);

    const handleEdit = (row) => {
        setEditData(row);
        setIsEditing(true);
        setStep(2);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        /*
        fetch(`http://localhost:8080/api/vehicles/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                const updatedData = data.filter((item) => item.id !== id);
                setData(updatedData);
                setFilteredData(updatedData);
            })
            .catch(error => {
                console.error('Error deleting vehicle:', error);
            });
        */
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEditing) {
            const updatedVehicle = { plate: editData.plate, owner: editData.owner, type: editData.type === 'carro' };

            /*
            fetch(`http://localhost:8080/api/vehicles/${editData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedVehicle)
            })
                .then(response => response.json())
                .then(data => {
                    const updatedData = data.map((vehicle) => (vehicle.id === editData.id ? data : vehicle));
                    setData(updatedData);
                    setFilteredData(updatedData);
                    setEditData({ plate: '', type: '', owner: '' });
                    setIsEditing(false);
                    setModalOpen(false);
                })
                .catch(error => {
                    console.error('Error updating vehicle:', error);
                });
            */

            const updatedData = data.map((vehicle) => (vehicle.id === editData.id ? { ...vehicle, ...updatedVehicle } : vehicle));
            setData(updatedData);
            setFilteredData(updatedData);
            setEditData({ plate: '', type: '', owner: '' });
            setIsEditing(false);
            setModalOpen(false);
        } else {
            const newVehicle = { ...editData, id: data.length + 1, type: editData.type === 'carro' };

            /*
            fetch('http://localhost:8080/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newVehicle)
            })
                .then(response => response.json())
                .then(data => {
                    const updatedData = [...data, data];
                    setData(updatedData);
                    setFilteredData(updatedData);
                    setEditData({ plate: '', type: '', owner: '' });
                    setModalOpen(false);
                })
                .catch(error => {
                    console.error('Error adding vehicle:', error);
                });
            */

            const updatedData = [...data, newVehicle];
            setData(updatedData);
            setFilteredData(updatedData);
            setEditData({ plate: '', type: '', owner: '' });
            setModalOpen(false);
        }
    };

    const handleAddNew = () => {
        setEditData({ plate: '', type: '', owner: '' });
        setIsEditing(false);
        setStep(1);
        setModalOpen(true);
    };

    const handleFilterClick = (type) => {
        if (filterType === type) {
            setFilterType(null);
        } else {
            setFilterType(type);
        }
    };

    const handleCheckCedula = () => {
        fetchOwnerData(cedula);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6">
            <div className="mx-auto flex flex-col items-center rounded-lg w-full">
                <div className="w-[90%]">
                    <img
                        src="https://images.pexels.com/photos/409701/pexels-photo-409701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
                            className={`w-24 h-10 rounded-md flex items-center justify-center ${filterType === 'moto' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-700 transition-transform transform hover:scale-105`}
                            onClick={() => handleFilterClick('moto')}>
                            Moto
                        </button>
                        <button
                            className={`w-24 h-10 rounded-md flex items-center justify-center ${filterType === 'carro' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-700 transition-transform transform hover:scale-105`}
                            onClick={() => handleFilterClick('carro')}>
                            Carro
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

                <div className="mt-8  mb-6 ">
                
                </div>

                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
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
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2">
                                Plate:
                                <input
                                    type="text"
                                    value={editData.plate}
                                    onChange={(e) => setEditData({ ...editData, plate: e.target.value })}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                                    required
                                />
                            </label>
                            <label className="block mb-2">
                                Type:
                                <select
                                    value={editData.type ? 'carro' : 'moto'}
                                    onChange={(e) => setEditData({ ...editData, type: e.target.value === 'carro' })}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="carro">Carro</option>
                                    <option value="moto">Moto</option>
                                </select>
                            </label>
                            <label className="block mb-2">
                                Owner:
                                <input
                                    type="text"
                                    value={editData.owner}
                                    readOnly
                                    className="w-full p-2 mt-1 border border-gray-300 rounded bg-gray-200"
                                />
                            </label>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Save</button>
                        </form>
                    )}
                </Modal>
            </div>
        </div>
    );
}