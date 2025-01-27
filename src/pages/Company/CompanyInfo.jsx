import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
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

const validatePhone = (phone) => {
  const phoneRegex = /^\d{7,10}$/; 
  return phoneRegex.test(phone);
};

const CompanyInfo = () => {
  const { id } = useParams();
  const { data, loading, error, createItem, updateItem, removeItem } = useApi(`/company/${id}`);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante' });
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (data && data.peopleList && data.peopleList.length > 0) {
      getRandomUserImages().then(userImages => {
        const mappedData = data.peopleList.map((person, index) => ({
          id: person.id, // Aseguramos que el id esté presente aquí
          image: userImages[index % userImages.length],
          primary: person.name,
          secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
          tertiary: `Tipo: ${person.personType ? 'Empleado' : 'Visitante'}, Compañía: ${data.name}`,
          additional: person.carnet ? `Carnet: ${person.carnet.code} (Estado: ${person.carnet.status ? 'Activo' : 'Inactivo'})` : 'Carnet: No disponible'
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
    if (!validatePhone(newData.phone)) {
      setPhoneError('Número de teléfono no válido');
      return;
    }
    setPhoneError('');

    const personType = newData.type === 'empleado';

    try {
      let createdItem;
      if (isEditing) {
        createdItem = await updateItem(newData.id, { ...newData, personType }); 
      } else {
        createdItem = await createItem({ ...newData, personType }); // Creamos el nuevo elemento
      }

      // Actualizamos el estado de la aplicación con el nuevo elemento creado
      if (createdItem) {
        setFilteredData(prevData => [...prevData, { ...createdItem, id: createdItem.id }]);
      }

      setModalOpen(false);
      setIsEditing(false)
      setEditData({ name: '', cedula: '', phone: '', type: 'visitante' });
    } catch (error) {
      console.error('Error al crear el item:', error);
    }
  };

  const handleEdit = (item) => {
    const secondarySplit = item.secondary ? item.secondary.split(' ') : [];
    const primary = item.primary || '';
    const cedula = secondarySplit.length > 1 ? secondarySplit[1] : '';
    const phone = secondarySplit.length > 3 ? secondarySplit[3] : '';
    const type = item.tertiary && item.tertiary.includes('Empleado') ? 'empleado' : 'visitante';

    setEditData({
      id: item.id, // Aseguramos que el id esté presente aquí
      name: primary,
      cedula: cedula,
      phone: phone,
      type: type
    });

    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    try {
      await removeItem(item.id); // Utilizamos el id del elemento a eliminar

    } catch (error) {
      console.error('Error al eliminar el item:', error);
    }
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
              />
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
        {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
      </Modal>
    </CommonLayout>
  );
};

export default CompanyInfo;
