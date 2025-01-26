import React, { useState, useEffect } from 'react';
import { FaBuilding, FaEdit } from "react-icons/fa";
import { MdOutlineAddCircleOutline, MdDelete } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import CommonLayout from '../CommonLayout';
import List from '../components/Cards/List';
import CardItem from '../components/Cards/CardItem';
import Form from '../components/Form';

const getRandomUserImages = async () => {
  const response = await fetch('https://randomuser.me/api/?results=5');
  if (!response.ok) {
    throw new Error('Error fetching user data');
  }
  return response.json().then(data => data.results.map(user => user.picture.large));
};

const CompanyInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante' });
  const [filterType, setFilterType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`http://localhost:8083/api/company/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const companyData = await response.json();
      const userImages = await getRandomUserImages();
      const mappedData = companyData.peopleList.map((person, index) => ({
        image: userImages[index % userImages.length], // Asigna imágenes aleatorias a cada persona
        primary: person.name,
        secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
        tertiary: `Tipo: ${person.personType ? 'Empleado' : 'Visitante'}, Compañía: ${companyData.name}`,
        additional: `Carnet: ${person.carnet.code} (Estado: ${person.carnet.status ? 'Activo' : 'Inactivo'})`
      }));
      setData(mappedData);
      setFilteredData(mappedData);
      setLoading(false);
    } catch (error) {
      setError('Error fetching data: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompanies();
    }
  }, [id]);

  useEffect(() => {
    const filtered = data.filter(person =>
      person.primary.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEditData({ name: '', cedula: '', phone: '', type: 'visitante' });
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
    setEditData({ name: '', cedula: '', phone: '', type: 'visitante' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleFilterClick = (type) => {
    setFilterType(filterType === type ? null : type);
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
            { name: 'type', label: 'Type', type: 'select', options: ['visitante', 'empleado'], required: true },
          ]}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      </Modal>
    </CommonLayout>
  );
};

export default CompanyInfo;
