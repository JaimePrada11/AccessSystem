import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import Table from '../components/Table';
import { IoMdAddCircle } from "react-icons/io";
import Modal from '../components/Modal';
import Form from '../components/Form';
import CommonLayout from '../CommonLayout';


const Equipments = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ serial: '', registrationDate: '', description: '', owner: '' });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
        setData(initialData);
        setFilteredData(initialData);
    }, []);

    useEffect(() => {
        let filtered = data.filter(item =>
            item.serial.toLowerCase().includes(searchTerm.toLowerCase())
        );

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

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Serial', accessor: 'serial' },
        { Header: 'Registration Date', accessor: 'registrationDate' },
        { Header: 'Owner', accessor: 'owner' },
        { Header: 'Description', accessor: 'description' },
    ];

    const handleSubmit = (newData) => {
        if (isEditing) {
            setData(data.map(item => (item.id === newData.id ? newData : item)));
        } else {
            setData([...data, { ...newData, id: data.length + 1 }]);
        }
        setModalOpen(false);
        setEditData({ serial: '', registrationDate: '', description: '', owner: '' });
    };

    const handleEdit = (item) => {
        setEditData(item);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = (item) => {
        const updatedData = data.filter(dataItem => dataItem.id !== item.id);
        setData(updatedData);
        setFilteredData(updatedData);
    };

    const handleAddNew = () => {
        setEditData({ serial: '', registrationDate: '', description: '', owner: '' });
        setIsEditing(false);
        setModalOpen(true);
    };

    return (
        <CommonLayout
            titleImage="https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            searchPlaceholder="Search by Serial"
            searchValue={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onAddNew={handleAddNew}
            extraInputs={[
                {
                    type: 'date',
                    value: startDate,
                    onChange: (e) => setStartDate(e.target.value),
                    className: 'w-40 h-10 p-2 border border-gray-300 rounded-md'
                },
                {
                    type: 'date',
                    value: endDate,
                    onChange: (e) => setEndDate(e.target.value),
                    className: 'w-40 h-10 p-2 border border-gray-300 rounded-md'
                }
            ]}
        >
            <Table columns={columns} data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <Form
                    fields={[
                        { name: 'serial', label: 'Serial', type: 'text', required: true },
                        { name: 'registrationDate', label: 'Registration Date', type: 'date', required: true },
                        { name: 'description', label: 'Description', type: 'text' },
                        { name: 'owner', label: 'Owner', type: 'text', required: true },
                    ]}
                    onSubmit={handleSubmit}
                    initialData={editData}
                />
            </Modal>
        </CommonLayout>
    );
};

export default Equipments;