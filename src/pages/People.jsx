import React, { useState, useEffect } from 'react';
import List from '../components/Cards/List';
import CardItem from '../components/Cards/CardItem';
import Modal from '../components/Modal';
import Form from '../components/Form';
import CommonLayout from '../CommonLayout';

const People = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante' });
  const [filterType, setFilterType] = useState(null);

  const datas = [
      {
          name: "John Doe",
          cedula: "123456789",
          phone: "555-1234",
          tipo: "Visitante",
          companie: "ACME Corp",
          carnet: "123-456-789",
          image: "https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
      },
      {
        name: "John Doe",
        cedula: "123456789",
        phone: "555-1234",
        tipo: "Visitante",
        companie: "ACME Corp",
        carnet: "123-456-789",
        image: "https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
    },
    {
      name: "John Doe",
      cedula: "123456789",
      phone: "555-1234",
      tipo: "Visitante",
      companie: "ACME Corp",
      carnet: "123-456-789",
      image: "https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
  }
  ];
  
  const mappedData = datas.map(item => ({
      image : item.image,
      primary: item.name,
      secondary: `CC. ${item.cedula}  Phone ${item.phone}`,
      tertiary: ` ${item.tipo},  ${item.companie}`,
      additional: `Carnet: ${item.carnet}`
  }));

  useEffect(() => {
      setData(mappedData);
      setFilteredData(mappedData);
  }, []);

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

export default People;
