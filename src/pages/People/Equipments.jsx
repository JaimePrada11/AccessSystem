import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import CommonLayout from '../../CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../Services/apiService';
import { useParams } from 'react-router-dom';

const Equipments = () => {
    const { id } = useParams();
    const { data, loading, error, fetchItem } = useApi('/people'); 
    const { createItem, updateItem, removeItem } = useApi(); // Removed specific route here
    const [filteredData, setFilteredData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ serial: '', registrationDate: '', description: '', owner: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [step, setStep] = useState(0); // 0: input owner ID, 1: show full form

    const mappedData = (data || []).flatMap(person => 
        person.equipments.map(item => ({
            id: item.id,
            image: item.image, 
            primary: item.serial,
            secondary: `Fecha de Registro: ${item.registrationDate}`,
            tertiary: `Descripción: ${item.description}`,
            additional: `Dueño: ${person.name}`
        }))
    );

    useEffect(() => {
        setFilteredData(mappedData);
    }, [data]);

    useEffect(() => {
        let filtered = mappedData.filter(item =>
            item.primary.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredData(filtered);
    }, [searchTerm]);

    const handleSubmit = async (newData) => {
        if (isEditing) {
            await updateItem(`/people/${id}/equipment/${editData.id}`, newData);
        } else {
            newData.registrationDate = new Date().toISOString().split('T')[0];
            const ownerData = data.find(person => person.cedula === newData.owner);
            if (ownerData) {
                await createItem(`/people/${ownerData.id}/equipment`, newData); // Use specific route for equipment creation
            } else {
                alert('El dueño no existe en la base de datos.');
                return;
            }
        }
        setModalOpen(false);
        setEditData({ serial: '', registrationDate: '', description: '', owner: '' });
    };

    const handleEdit = (item) => {
        setEditData(item);
        setIsEditing(true);
        setStep(1); // Show full form for editing
        setModalOpen(true);
    };

    const handleDelete = async (item) => {
        await removeItem(`/people/${id}/equipment/${item.id}`); 
    };

    const handleAddNew = () => {
        setEditData({ serial: '', registrationDate: '', description: '', owner: '' });
        setIsEditing(false);
        setStep(0); // Start with owner ID input
        setModalOpen(true);
    };

    const handleOwnerSubmit = async (ownerId) => {
        const ownerData = data.find(person => person.cedula === ownerId);
        if (!ownerData) {
            alert('El dueño no existe en la base de datos.');
            return;
        }
        setEditData({ ...editData, owner: ownerId });
        setStep(1); // Show full form after owner verification
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
                {step === 0 ? (
                    <Form
                        fields={[
                            { name: 'owner', label: 'Cédula del Dueño', type: 'text', required: true },
                        ]}
                        onSubmit={(data) => handleOwnerSubmit(data.owner)}
                        initialData={editData}
                    />
                ) : (
                    <Form
                        fields={[
                            { name: 'serial', label: 'Serial', type: 'text', required: true },
                            { name: 'registrationDate', label: 'Fecha de Registro', type: 'date', required: true, readOnly: true, value: new Date().toISOString().split('T')[0] },
                            { name: 'description', label: 'Descripción', type: 'text' },
                            { name: 'owner', label: 'Dueño', type: 'text', required: true, readOnly: true, value: editData.owner },
                        ]}
                        onSubmit={handleSubmit}
                        initialData={editData}
                    />
                )}
            </Modal>
        </CommonLayout>
    );
};

export default Equipments;
