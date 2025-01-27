import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import Form from '../../components/Form';
import useApi from '../../hooks/useData';

const getRandomUserImages = async () => {
  const response = await fetch('https://randomuser.me/api/?results=25');
  if (!response.ok) {
    throw new Error('Error fetching user data');
  }
  return response.json().then(data => data.results.map(user => user.picture.large));
};

const People = () => {
  const { data: peopleData, loading: peopleLoading, error: peopleError, removeItem } = useApi('/people');
  const { data: companyData, loading: companyLoading, error: companyError } = useApi('/company');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante', companyId: '' });
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    getRandomUserImages().then(setUserImages).catch(error => {
      console.error('Error fetching user images:', error);
    });
  }, []);

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
      const mappedData = allPeople.map((person, index) => ({
        image: userImages[index % userImages.length],
        primary: person.name,
        secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
        tertiary: `Tipo: ${person.personType ? 'Empleado' : 'Visitante'}, Compañía: ${person.companyName}`,
        id: person.id,
        name: person.name,
        cedula: person.cedula,
        telefono: person.telefono,
        personType: person.personType,
        companyId: person.companyId,
      }));
      setFilteredData(mappedData);
    }
  }, [peopleData, companyData, userImages]);

  useEffect(() => {
    const filtered = peopleData && searchTerm
      ? filteredData.filter(person =>
        person.primary && person.primary.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : filteredData;

    setFilteredData(filtered);
  }, [searchTerm]);

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (newData) => {
    const { companyId, ...peopleData } = newData;
    const endpoint = isEditing ? `/people/${newData.id}` : `/company/${companyId}/people`;

    try {
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(peopleData)
      });

      if (!response.ok) {
        throw new Error('Error saving data');
      }

      setModalOpen(false);
      setEditData({ name: '', cedula: '', phone: '', type: 'visitante', companyId: '' });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleEdit = (item) => {
    setEditData({
      id: item.id,
      name: item.primary || '',
      cedula: item.secondary?.split(' ')[1] || '',
      phone: item.secondary?.split(' ')[3] || '',
      type: item.tertiary?.includes('Empleado') ? 'empleado' : 'visitante',
      companyId: companyData.find(company => company.name === item.companyName)?.id || '',
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    try {
      await removeItem(item.id);
      setFilteredData((prev) => prev.filter(data => data.id !== item.id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
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
              onDelete={() => handleDelete(item)}
            >
              <div className="company-name">{item.companyName}</div>
            </CardItem>
          ))}
        </List>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(editData);
        }}>
          <Form
            fields={[
              { name: 'name', label: 'Nombre', type: 'text', required: true },
              { name: 'cedula', label: 'Cédula', type: 'text', required: true },
              { name: 'phone', label: 'Teléfono', type: 'text', required: true },
              { name: 'type', label: 'Tipo', type: 'select', options: ['visitante', 'empleado'], required: true },
            ]}
            initialData={editData}
            onChange={handleChange}
          />
          <label>
            Compañía:
            <select
              name="companyId"
              value={editData.companyId}
              onChange={(e) => handleChange('companyId', e.target.value)}
              required
            >
              {companyData && companyData.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Guardar</button>
        </form>
      </Modal>
    </CommonLayout>
  );
};

export default People;
