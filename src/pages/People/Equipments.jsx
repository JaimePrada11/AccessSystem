import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../hooks/useData';
import axiosInstance from '../../Services/apiService';

export default function Equipments() {
  const { data, loading, error, postData, putData, deleteData } = useApi('/people'); 
  const { data: peopleData } = useApi('/people');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({id:'', serial: '', registrationDate: '', description: '', owner: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [cedula, setCedula] = useState('');
  const [personExists, setPersonExists] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [personId, setPersonId] = useState(null);

  useEffect(() => {
    fetchAndUpdateData();
  }, []);

  const fetchAndUpdateData = async () => {
    try {
      const response = await axiosInstance.get('/people');
      const mappedData = response.data.flatMap(person =>
        (person.equipments || []).map(item => ({
            id: item.id,
            image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            primary: item.serial,
            secondary: `Fecha de Registro: ${item.registrationDate}`,
            tertiary: `Descripción: ${item.description}`,
            additional: `Dueño: ${person.name}`
        }))
      );
      setFilteredData(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleSubmit = async (newData) => {
    const transformedData = {
      ...newData,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    if (isEditing) {
      try {
        const response = await axiosInstance.put(`/people/equipment/${editData.id}`, transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Datos actualizados con éxito:", response.data);
        fetchAndUpdateData();
      } catch (error) {
        console.error("Error al actualizar el equipo:", error.response || error.message);
      }
    } else {
      try {
        const response = await axiosInstance.post(`/people/${personId}/equipment`, transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Equipo creado con éxito:", response.data);
        fetchAndUpdateData();
      } catch (error) {
        console.error("Error al crear el equipo:", error.response || error.message);
      }
    }

    setModalOpen(false);
    setEditData({ id:'', serial: '', registrationDate: '', description: '', owner: '' });
  };

  const handleEdit = (item) => {
    setEditData({
      id: item.id || '',
      serial: item.primary || '',
      registrationDate: item.secondary.split(': ')[1] || '',
      description: item.tertiary.split(': ')[1] || '',
      owner: item.additional.split(': ')[1] || ''
    });
    setIsEditing(true);
    setPersonExists(true); // Se asegura de que no se necesite verificación de cédula al editar
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    await deleteData(item.id);
    fetchAndUpdateData();
  };

  const handleAddNew = () => {
    setCedula('');
    setPersonExists(false);
    setValidationError('');
    setEditData({ id:'', serial: '', registrationDate: '', description: '', owner: '' });
    setPersonId(null); // Reinicia el personId al agregar uno nuevo
    setModalOpen(true);
  };

  const handleCedulaSubmit = (e) => {
    e.preventDefault();
    const person = peopleData.find(p => p.cedula === cedula);
    if (person) {
      setPersonExists(true);
      setEditData({ ...editData, owner: person.name });
      setPersonId(person.id); // Almacena el id de la persona
    } else {
      setValidationError('La cédula no existe. Por favor, registre a la persona primero.');
    }
  };

  const fields = [
    { name: 'serial', label: 'Serial', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'text', required: true },
    { name: 'owner', label: 'Dueño', type: 'text', required: true }
  ];

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/2225617/pexels-photo-2225617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Search by Serial"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredData.length > 0 ? (
        <List>
          {filteredData.filter(item => 
            item.primary.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((item, index) => (
            <CardItem
              key={index}
              data={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </List>
      ) : (
        <p>No se encontraron datos</p>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {!personExists && !isEditing ? (
          <form onSubmit={handleCedulaSubmit}>
            <label>
              Cédula del dueño:
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              />
            </label>
            {validationError && <p className="text-red-500 mt-1">{validationError}</p>}
            <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
              Verificar
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(editData); }}>
            <Form fields={fields} initialData={editData} onChange={(e) => setEditData({ ...editData, [e.target.name]: e.target.value })} />
            <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
              Guardar
            </button>
          </form>
        )}
      </Modal>
    </CommonLayout>
  );
}

