import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../hooks/useData';
import axiosInstance from '../../Services/apiService';
import Form from '../../components/Form';

const Memberships = () => {
  const { data, loading, error } = useApi('/membership');
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, Duracion: '', precio: '', vehicletype: '' });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = data.filter(item =>
        (item.duration && item.duration.toString().includes(searchTerm.toLowerCase())) ||
        (item.price && item.price.toString().includes(searchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const mappedData = filteredData.map(item => ({
    image: 'https://images.pexels.com/photos/47344/dollar-currency-money-us-dollar-47344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    secondary: `Duración: ${item.duration} días`,
    tertiary: `Precio: ${item.price}, Vehículos: ${item.vehicleType ? 'Carro' : 'Moto'}`,
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { Duracion, precio, vehicletype } = editData;
    try {
      await axiosInstance.post('/membership', { 
        duration: Duracion, 
        price: precio, 
        vehicleType: vehicletype === 'Carro' 
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response => {
        console.log("Membresía creada con éxito:", response.data);
        setFilteredData(prevData => [response.data, ...prevData]);
      })
      .catch(error => console.error("Error al crear la membresía:", error));
    } catch (err) {
      console.error('Error al guardar datos:', err);
    }
  };

  const handleAddNew = () => {
    setEditData({ id: null, Duracion: '', precio: '', vehicletype: '' });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message || 'Error al cargar los datos'}`}</p>;

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Search by ID or price"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}
    >
      <List>
        {mappedData.map((item, index) => (
          <CardItem
            key={index}
            data={item}
            hidden={true}
          />
        ))}
      </List>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <Form
            fields={[
              { name: 'Duracion', label: 'Duración', type: 'number', required: true },
              { name: 'precio', label: 'Precio', type: 'number', required: true },
              { name: 'vehicletype', label: 'Tipo de vehículo', type: 'select', options: ['Moto', 'Carro'], required: true },
            ]}
            initialData={editData}
            onChange={handleChange}
          />
          <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </CommonLayout>
  );
};

export default Memberships;