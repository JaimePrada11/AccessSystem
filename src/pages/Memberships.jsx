import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import CommonLayout from '../CommonLayout';
import List from '../components/Cards/List';
import CardItem from '../components/Cards/CardItem';
import useApi from '../hooks/useApi';

const Memberships = () => {
  const { data, loading, error, createItem, updateItem, removeItem } = useApi('/membership'); 
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ id: null, Duracion: '', precio: '', vehicletype: '' });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFilteredData(data); 
    }
  }, [data]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = data.filter(item =>
        item.idMembership && item.idMembership.toString().toLowerCase().includes(searchTerm.toLowerCase()) 
      );
      setFilteredData(filtered); 
    }
  }, [searchTerm, data]);

  const mappedData = filteredData.map(item => ({
    image: item.image || 'default_image_url',  
    secondary: `Duracion: ${item.duration} días`, 
    tertiary: `Precio: ${item.price}`, 
    additional: `Vehículos: ${item.vehicleType ? 'Carro' : 'Moto'}`,  
  }));

  const handleSubmit = async (newData) => {
    try {
      if (isEditing) {
        await updateItem(newData.id, newData); 
      } else {
        await createItem(newData);  
      }
      setModalOpen(false);
      setEditData({ id: null, Duracion: '', precio: '', vehicletype: '' });
    } catch (err) {
      console.error('Error al guardar datos:', err);
    }
  };

  const handleEdit = (item) => {
    setEditData(item); 
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    try {
      await removeItem(item.id); 
      setFilteredData(filteredData.filter(dataItem => dataItem.id !== item.id));
    } catch (err) {
      console.error('Error al eliminar el item:', err);
    }
  };

  const handleAddNew = () => {
    setEditData({ id: null, Duracion: '', precio: '', vehicletype: '' });  
    setIsEditing(false); 
    setModalOpen(true); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message || 'Error al cargar los datos'}`}</p>;

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Search by ID"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}
    >
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
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(editData); }}>
          <div>
            <label>Duracion:</label>
            <input
              type="text"
              value={editData.Duracion}
              onChange={(e) => setEditData({ ...editData, Duracion: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Precio:</label>
            <input
              type="text"
              value={editData.precio}
              onChange={(e) => setEditData({ ...editData, precio: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Tipo de vehiculo:</label>
            <input
              type="text"
              value={editData.vehicletype}
              onChange={(e) => setEditData({ ...editData, vehicletype: e.target.value })}
              required
            />
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>
    </CommonLayout>
  );
};

export default Memberships;