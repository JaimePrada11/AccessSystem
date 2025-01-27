import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import CommonLayout from '../../CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import Form from '../../components/Form';
import useApi from '../../Services/apiService';

const getRandomUserImages = async () => {
  const response = await fetch('https://randomuser.me/api/?results=5');
  if (!response.ok) {
    throw new Error('Error fetching user data');
  }
  return response.json().then(data => data.results.map(user => user.picture.large));
};

const People = () => {
  const { data: peopleData, loading: peopleLoading, error: peopleError, createItem, updateItem, removeItem } = useApi('/people');
  const { data: companyData, loading: companyLoading, error: companyError } = useApi('/company');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante', companyId: '' });

  useEffect(() => {
    if (peopleData && companyData) {
      const allPeople = peopleData.map(person => {
        const company = companyData.find(company => company.peopleList.some(p => p.cedula === person.cedula));
        return {
          ...person,
          companyName: company ? company.name : 'Unknown',
          companyId: company ? company.id : ''
        };
      });
      getRandomUserImages()
        .then(userImages => {
          const mappedData = allPeople.map((person, index) => ({
            image: userImages[index % userImages.length],
            primary: person.name,
            secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
            tertiary: `Tipo: ${person.personType ? 'Empleado' : 'Visitante'} , Compañía: ${person.companyName}`,
            id: person.id,
            name: person.name,
            cedula: person.cedula,
            telefono: person.telefono,
            personType: person.personType,
            companyId: person.companyId,
          }));
          setFilteredData(mappedData);
        })
        .catch(error => {
          console.error('Error fetching user images:', error);
        });
    } else {
      console.log('No data in peopleData or companyData');
    }
  }, [peopleData, companyData]);

  useEffect(() => {
    const filtered = filteredData.filter(person =>
      person.primary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleSubmit = async (newData) => {
    const { companyId, ...peopleData } = newData;
    const endpoint = isEditing ? `/people/${newData.id}` : `/company/${companyId}/people`;

    const response = await fetch(endpoint, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(peopleData)
    });

    if (!response.ok) {
      console.error('Error saving data');
      return;
    }

    setModalOpen(false);
    setEditData({ name: '', cedula: '', phone: '', type: 'visitante', companyId: '' });
  };

  const handleEdit = (item) => {
    const secondarySplit = item.secondary ? item.secondary.split(' ') : [];
    const primary = item.primary || '';
    const cedula = secondarySplit.length > 1 ? secondarySplit[1] : '';
    const phone = secondarySplit.length > 3 ? secondarySplit[3] : '';
    const type = item.tertiary && item.tertiary.includes('Empleado') ? 'empleado' : 'visitante';
    const companyId = companyData.find(company => company.name === item.companyName)?.id || '';

    setEditData({
      id: item.id,
      name: primary,
      cedula: cedula,
      phone: phone,
      type: type,
      companyId: companyId,
    });

    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    await removeItem(item.id);
  };

  const handleAddNew = () => {
    setEditData({ name: '', cedula: '', phone: '', type: 'visitante', companyId: '' });
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
      {peopleLoading || companyLoading ? (
        <p>Cargando datos...</p>
      ) : peopleError ? (
        <p>{peopleError}</p>
      ) : companyError ? (
        <p>{companyError}</p>
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
            { name: 'type', label: 'Type', type: 'select', options: ['visitante', 'empleado'], required: true },
            { name: 'companyId', label: 'Compañía', type: 'select', options: companyData.map(company => ({ value: company.id, label: company.name })), required: true }
          ]}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      </Modal>
    </CommonLayout>
  );
};

export default People;
