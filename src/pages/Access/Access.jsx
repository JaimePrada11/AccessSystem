import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import CommonLayout from '../CommonLayout';
import List from '../components/Cards/List';
import CardItem from '../components/Cards/CardItem';
import Form from '../components/Form';
import useApi from '../Services/apiService';

const Access = () => {
  const { data, loading, error, createItem, updateItem, removeItem } = useApi('/access');
  const { data: peopleData, loading: peopleLoading, error: peopleError } = useApi('/people');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ entryAccess: '', exitAccess: '', accessType: '', notes: '', porters: [] });

  useEffect(() => {
    if (Array.isArray(data) && Array.isArray(peopleData)) {
      const mappedData = data.map((access) => {
        const person = peopleData.find(person => person.id === access.people);
        return {
          id: access.idAccess,
          primary: `${person ? person.name : 'Unknown'} (CC. ${person ? person.cedula : 'N/A'})`,
          secondary: `Entrada: ${access.entryAccess}, Salida: ${access.exitAccess}`,
          tertiary: `Tipo: ${access.accessType ? 'Autorizado' : 'No Autorizado'}`,
          additional: `Notas: ${access.accessNotes.map(note => note.note).join(', ')}`,
          porters: access.porters.join(', ')
        };
      });
      setFilteredData(mappedData);
    }
  }, [data, peopleData]);

  useEffect(() => {
    const filtered = filteredData.filter(access =>
      access.primary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleSubmit = async (newData) => {
    if (isEditing) {
      await updateItem(newData.id, newData);
    } else {
      await createItem({ ...newData, id: data.length + 1 });
    }
    setModalOpen(false);
    setEditData({ entryAccess: '', exitAccess: '', accessType: '', notes: '', porters: [] });
  };

  const handleEdit = (item) => {
    const secondarySplit = item.secondary.split(', ');
    const entryAccess = secondarySplit[0].split(': ')[1];
    const exitAccess = secondarySplit[1].split(': ')[1];
    
    setEditData({
      id: item.id,
      entryAccess: entryAccess,
      exitAccess: exitAccess,
      accessType: item.tertiary.includes('Autorizado'),
      notes: item.additional.split(': ')[1],
      porters: item.porters.split(', ')
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    await removeItem(item.id);
  };

  const handleAddNew = () => {
    setEditData({ entryAccess: '', exitAccess: '', accessType: '', notes: '', porters: [] });
    setIsEditing(false);
    setModalOpen(true);
  };

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/417192/pexels-photo-417192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Search by Name"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}
    >
      {loading || peopleLoading ? (
        <p>Cargando datos...</p>
      ) : error || peopleError ? (
        <p>{error || peopleError}</p>
      ) : (
        <List>
          {filteredData.map((item, index) => (
            <CardItem
              key={index}
              data={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </List>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Form
          fields={[
            { name: 'entryAccess', label: 'Fecha de Entrada', type: 'text', required: true },
            { name: 'exitAccess', label: 'Fecha de Salida', type: 'text', required: true },
            { name: 'accessType', label: 'Tipo de Acceso', type: 'checkbox', options: ['Autorizado'], required: true },
            { name: 'notes', label: 'Notas', type: 'text', required: true },
            { name: 'porters', label: 'Porteros', type: 'text', required: true }
          ]}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      </Modal>
    </CommonLayout>
  );
};

export default Access;
