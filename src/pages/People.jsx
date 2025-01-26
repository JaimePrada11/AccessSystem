import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import CommonLayout from '../CommonLayout';
import List from '../components/Cards/List';
import CardItem from '../components/Cards/CardItem';
import Form from '../components/Form';
import useApi from '../hooks/useApi';

const getRandomUserImages = async () => {
  const response = await fetch('https://randomuser.me/api/?results=5');
  if (!response.ok) {
    throw new Error('Error fetching user data');
  }
  return response.json().then(data => data.results.map(user => user.picture.large));
};

const People = () => {
  const { data, loading, error, createItem, updateItem, removeItem } = useApi('/company'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante' });

  useEffect(() => {
    if (data && data.length > 0) {
      const allPeople = data.flatMap(company => 
        company.peopleList.map(person => ({
          ...person,
          companyName: company.name // Agregamos el nombre de la compañía
        }))
      );
      getRandomUserImages().then(userImages => {
        const mappedData = allPeople.map((person, index) => ({
          image: userImages[index % userImages.length],
          primary: person.name,
          secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
          tertiary: `Tipo: ${person.personType ? 'Empleado' : 'Visitante'} , Compañía: ${person.companyName} `,
          additional: `Carnet: ${person.carnet.code} (Estado: ${person.carnet.status ? 'Activo' : 'Inactivo'})`,
        }));
        setFilteredData(mappedData);
      }).catch(error => {
        console.error('Error fetching user images:', error);
      });
    } else {
      console.log('No data in peopleList');
    }
  }, [data]);

  useEffect(() => {
    const filtered = filteredData.filter(person =>
      person.primary.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEditData({ name: '', cedula: '', phone: '', type: 'visitante' });
  };

  const handleEdit = (item) => {
    const secondarySplit = item.secondary ? item.secondary.split(' ') : [];
    const primary = item.primary || '';
    const cedula = secondarySplit.length > 1 ? secondarySplit[1] : '';
    const phone = secondarySplit.length > 3 ? secondarySplit[3] : '';
    const type = item.tertiary && item.tertiary.includes('Empleado') ? 'empleado' : 'visitante';

    setEditData({
      id: item.id,
      name: primary,
      cedula: cedula,
      phone: phone,
      type: type
    });

    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    await removeItem(item.id);
  };

  const handleAddNew = () => {
    setEditData({ name: '', cedula: '', phone: '', type: 'visitante' });
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
            >
              {/* Mostrar el nombre de la compañía en la tarjeta */}
              <div className="company-name">{item.companyName}</div>
            </CardItem>
          ))}
        </List>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Form
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'cedula', label: 'Cedula', type: 'text', required: true },
            { name: 'phone', label: 'Phone', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['visitante', 'empleado'], required: true }
          ]}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      </Modal>
    </CommonLayout>
  );
};

export default People;
