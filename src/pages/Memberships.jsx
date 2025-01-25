import React, { useState, useEffect } from 'react';
import { FaBuilding, FaEdit } from "react-icons/fa";
import { MdOutlineAddCircleOutline, MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import CommonLayout from '../CommonLayout';
import List from '../components/Cards/List'; // Asegúrate de importar List
import CardItem from '../components/Cards/CardItem'; // Asegúrate de importar CardItem

const Memberships = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ id: null, Duracion: '', precio: '', vehicletype: '' });

  const initialData = [
    {
        id: 1,
        Duracion: 30,
        precio: 12.56,
        vehicletype: "Car"
    },
    {
        id: 2,
        Duracion: 30,
        precio: 12.56,
        vehicletype: "Car"
    }
  ];

  const mappedData = initialData.map(item => ({
    image: item.image,
    secondary: `Duracion: ${item.Duracion} dias`,
    tertiary: `precio: ${item.precio}`,
    additional: `vehiclos: ${item.vehicletype}`
  }));

  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = data.filter(item =>
      item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleSubmit = (newData) => {
    if (isEditing) {
      setData(data.map(item => (item.id === newData.id ? newData : item)));
    } else {
      setData([...data, { ...newData, id: data.length + 1 }]);
    }
    setModalOpen(false);
    setEditData({ id: null, Duracion: '', precio: '', vehicletype: '' });
  };

  const handleEdit = (item) => {
    setEditData(item);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    const updatedData = data.filter(dataItem => dataItem.id !== item.id);
    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleAddNew = () => {
    setEditData({ id: null, Duracion: '', precio: '', vehicletype: '' });
    setIsEditing(false);
    setModalOpen(true);
  };

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
