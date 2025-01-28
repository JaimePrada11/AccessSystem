import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import Form from '../../components/Form';
import useApi from '../../hooks/useData';

const getRandomUserImages = async () => {
  const response = await fetch('https://randomuser.me/api/?results=50');
  if (!response.ok) {
    throw new Error('Error fetching user data');
  }
  const { results } = await response.json();
  return results.map(user => user.picture.large);
};

const validatePhone = (telefono) => /^\d{7,10}$/.test(telefono);

const People = () => {
  const { data, loading, error } = useApi(`/people`);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate('/company');
  };

  useEffect(() => {
    if (data?.length) {
      getRandomUserImages()
        .then(userImages => {
          const mappedData = data.map((person, index) => ({
            id: person.id,
            image: userImages[index % userImages.length],
            primary: person.name,
            secondary: `CC. ${person.cedula} Phone ${person.telefono}`,
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
      if (data?.length) {
        getRandomUserImages()
          .then(userImages => {
            const mappedData = data.map((person, index) => ({
              id: person.id,
              image: userImages[index % userImages.length],
              primary: person.name,
              secondary: `CC. ${person.cedula} `,
              tertiary: `Phone ${person.telefono}`,
            }));
            setFilteredData(mappedData);
          })
          .catch(error => console.error('Error fetching user images:', error));
      }
    }
  }, [searchTerm, data]);

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/2225617/pexels-photo-2225617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Buscar por Cédula"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}
    >
      <h2 className='text-3xl font-bold'>People</h2>
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
              hidden={true}
              path={`/people/${item.id}`}
            />
          ))}
        </List>
      )}
    </CommonLayout>
  );
};

export default People;
