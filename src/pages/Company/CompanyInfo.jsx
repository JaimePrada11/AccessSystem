import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import Form from '../../components/Form';
import useApi from '../../hooks/useData';
import axiosInstance from '../../Services/apiService';

const getRandomUserImages = async () => {
  const response = await fetch('https://randomuser.me/api/?results=50');
  if (!response.ok) {
    throw new Error('Error fetching user data');
  }
  const { results } = await response.json();
  return results.map(user => user.picture.large);
};

const validatePhone = (telefono) => /^\d{7,10}$/.test(telefono);

const CompanyInfo = () => {
  const { id } = useParams();
  const { data, loading, error, createItem, removeItem } = useApi(`/company/${id}`);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', cedula: '', telefono: '', type: 'visitante' });
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (data?.peopleList?.length) {
      getRandomUserImages()
        .then(userImages => {
          const mappedData = data.peopleList.map((person, index) => ({
            id: person.id,
            image: userImages[index % userImages.length],
            primary: person.name,
            secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
            tertiary: `${person.personType ? 'Empleado' : 'Visitante'}, Compañía: ${data.name}`,
          }));
          setFilteredData(mappedData);
        })
        .catch(error => console.error('Error fetching user images:', error));
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filteredData.filter(person =>
        person.primary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.secondary.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      if (data?.peopleList?.length) {
        getRandomUserImages()
          .then(userImages => {
            const mappedData = data.peopleList.map((person, index) => ({
              id: person.id,
              image: userImages[index % userImages.length],
              primary: person.name,
              secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
              tertiary: `${person.personType ? 'Empleado' : 'Visitante'}, Compañía: ${data.name}`,
            }));
            setFilteredData(mappedData);
          })
          .catch(error => console.error('Error fetching user images:', error));
      }
    }
  }, [searchTerm, data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Datos del formulario:", editData);

    if (!validatePhone(editData.telefono)) {
      setPhoneError('Número de teléfono no válido');
      return;
    }

    setPhoneError('');
    const personType = editData.type === 'empleado';

    try {
      if (isEditing) {
        console.log("Actualizando persona con id:", editData.id);  
        await axiosInstance.put(`/people/${editData.id}`, { 
          ...editData, 
          personType 
        }, {
          headers: {
            "Content-Type": "application/json",  
          },
        })
        .then((response) => {
          console.log("Datos actualizados con éxito:", response.data);
          fetchAndUpdateData();
        })
        .catch(error => console.error("Error al actualizar la persona:", error));
      } else {
        console.log("Creando persona con id:", editData.id);
        await axiosInstance.post(`/company/${id}`, { 
          ...editData, 
          personType 
        }, {
          headers: {
            "Content-Type": "application/json",  
          },
        })
        .then((response) => {
          console.log("Datos creados con éxito:", response.data);
          fetchAndUpdateData();
        })
        .catch(error => console.error("Error al crear la persona:", error));
      }

      setEditData({ name: '', cedula: '', telefono: '', type: 'visitante', id: null });
      setIsEditing(false);
      setModalOpen(false);
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  };

  const fetchAndUpdateData = async () => {
    try {
      const response = await axiosInstance.get(`/company/${id}`);
      const userImages = await getRandomUserImages();
      const mappedData = response.data.peopleList.map((person, index) => ({
        id: person.id,
        image: userImages[index % userImages.length],
        primary: person.name,
        secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
        tertiary: `${person.personType ? 'Empleado' : 'Visitante'}, Compañía: ${response.data.name}`,
      }));
      setFilteredData(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleEdit = (item) => {
    console.log("Editando persona:", item); 

    const [primary, cedula, telefono] = item.secondary.split(' ');
    const type = item.tertiary.includes('Empleado') ? 'empleado' : 'visitante';

    setEditData({
      id: item.id,
      name: item.primary,
      cedula: cedula.slice(3),
      telefono: telefono ? telefono.slice(6) : '',  
      type,
    });

    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/people/${id}`)
        .then((response) => {
          console.log("Datos eliminados con éxito:", response.data);
          fetchAndUpdateData();
        });
    } catch (error) {
      console.error("Error al eliminar la persona:", error);
    }
  };

  const handleAddNew = () => {
    setEditData({ name: '', cedula: '', telefono: '', type: 'visitante' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/417192/pexels-photo-417192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Search by name or Cédula"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}
    >
      <h2 className='text-3xl font-bold'> Company: {data.name}</h2>
      <h2>Employees</h2>
      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <List>
          {filteredData.map((item) => (
            <CardItem
              key={item.id}
              data={item}
              onEdit={handleEdit}
              onDelete={() => handleDelete(item.id)}
              path={`/people/${item.id}`}
            />
          ))}
        </List>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <Form
            fields={[
              { name: 'name', label: 'Nombre', type: 'text', required: true },
              { name: 'cedula', label: 'Cédula', type: 'text', required: true },
              { name: 'telefono', label: 'telefono', type: 'text', required: true },
              { name: 'type', label: 'Tipo', type: 'select', options: ['visitante', 'empleado'], required: true },
            ]}
            initialData={editData}
            onChange={handleChange}
          />
          {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
          <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </CommonLayout>
  );
};

export default CompanyInfo;
