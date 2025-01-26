import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Form from '../components/Form';
import CommonLayout from '../CommonLayout';
import List from '../components/Cards/List';
import CardItem from '../components/Cards/CardItem';
import useApi from '../hooks/useApi';

const Equipments = () => {
    const { data, loading, error, createItem, updateItem, removeItem } = useApi('/people'); // URL de la API para obtener personas
    const [filteredData, setFilteredData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ serial: '', registrationDate: '', description: '', owner: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Mapeo de los datos de personas a la estructura esperada para los equipos
    const mappedData = (data || []).flatMap(person => 
        person.equipments.map(item => ({
            id: item.id,
            image: item.image, // Si tienes alguna imagen, sino puedes quitar esta propiedad
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

        if (startDate && endDate) {
            filtered = filtered.filter(item =>
                item.secondary >= startDate && item.secondary <= endDate
            );
        } else if (startDate) {
            filtered = filtered.filter(item => item.secondary >= startDate);
        } else if (endDate) {
            filtered = filtered.filter(item => item.secondary <= endDate);
        }

        setFilteredData(filtered);
    }, [searchTerm, startDate, endDate]);

    const handleSubmit = async (newData) => {
        if (isEditing) {
            await updateItem(editData.id, newData); // Actualizar equipo
        } else {
            await createItem(newData); // Crear nuevo equipo
        }
        setModalOpen(false);
        setEditData({ serial: '', registrationDate: '', description: '', owner: '' });
    };

    const handleEdit = (item) => {
        setEditData(item);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = async (item) => {
        await removeItem(item.id); // Eliminar equipo
    };

    const handleAddNew = () => {
        setEditData({ serial: '', registrationDate: '', description: '', owner: '' });
        setIsEditing(false);
        setModalOpen(true);
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
};

export default Equipments;
