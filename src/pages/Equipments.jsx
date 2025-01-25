import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircle } from "react-icons/io";
import Modal from '../components/Modal';
import Form from '../components/Form';
import CommonLayout from '../CommonLayout';
import List from '../components/Cards/List';
import CardItem from '../components/Cards/CardItem';
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

    const mappedData = initialData.map(item => ({
        image: item.image,
        primary: item.serial,
        secondary: `Fecha de Registro: ${item.registrationDate}`,
        tertiary: `Descripción: ${item.description}`,
        additional: `Dueño: ${item.owner}`
    }));

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
            onAddNew={handleAddNew} >

            <List>
                {mappedData.map((item, index) => (
                    <CardItem
                        key={index}
                        data={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                ))}
            </List>

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