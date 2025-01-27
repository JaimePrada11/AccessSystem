import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../hooks/useData';
import axiosInstance from '../../Services/apiService';

export default function Vehicle() {
    const { data, loading, error, createItem, updateItem, removeItem } = useApi('/people'); 
    const [filteredData, setFilteredData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ plate: '', type: '', owner: '' });
    const [searchTerm, setSearchTerm] = useState('');


    const mappedData = (data || []).flatMap(person =>
        person.vehicles.map(item => ({
            id: item.id,
            image: item.image,
            primary: item.plate,
            secondary: `Tipo: ${item.vehicleType ? 'Moto' : 'Carro'}`,
            additional: `Dueño: ${person.name}`
        }))
    );

    useEffect(() => {
        setFilteredData(mappedData);
    }, [data]);


    const handleSubmit = async (newData) => {
        if (isEditing) {
            await updateItem(editData.id, newData);
        } else {
            await createItem(newData);
        }
        setModalOpen(false);
        setEditData({ plate: '', type: '', owner: '' });
    };

    const handleEdit = (item) => {
        setEditData(item);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = async (item) => {
        await removeItem(item.id); 
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
        <CommonLayout
            titleImage="https://images.pexels.com/photos/2225617/pexels-photo-2225617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            searchPlaceholder="Search by Serial"
            searchValue={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onAddNew={handleAddNew} >

            {loading ? (
                <p>Cargando datos...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <List>
                    {filteredData.map((item, index) => (
                        <CardItem
                            key={index}
                            data={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </List>
            )}

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
}