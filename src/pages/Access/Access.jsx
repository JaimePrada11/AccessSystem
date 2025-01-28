import React, { useState, useEffect, useContext } from 'react';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import Form from '../../components/Form';
import useApi from '../../hooks/useData';
import UserContext from '../../Context';
import axiosInstance from '../../Services/apiService';

const Access = () => {
  const { user } = useContext(UserContext);
  const { data: accessData, loading, error, postData, putData, deleteData } = useApi('/access');
  const { data: peopleData, loading: peopleLoading, error: peopleError } = useApi('/people');
  const { data: porterData, loading: porterLoading, error: porterError } = useApi('/porters');
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ idAccess: '', entryAccess: '', exitAccess: '', accessType: true, notes: '', porters: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [cedula, setCedula] = useState('');
  const [personExists, setPersonExists] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [personId, setPersonId] = useState(null);

  useEffect(() => {
    fetchAndUpdateData();
  }, [accessData, peopleData, porterData]);

  const fetchAndUpdateData = async () => {
    try {
      const response = await axiosInstance.get('/access');
      const mappedData = response.data.flatMap(access => {
        const person = peopleData.find(p => p.id === access.people);
        const porters = access.porters.map(porterId => {
          const porter = porterData.find(p => p.id === porterId);
          return porter ? porter.name : 'Unknown';
        });

        return {
          image: 'https://definicion.de/wp-content/uploads/2009/08/puerta.jpg',
          id: access.idAccess,
          primary: `${person ? person.name : 'Unknown'} (CC. ${person ? person.cedula : 'N/A'})`,
          secondary: `Entrada: ${access.entryAccess}, Salida: ${access.exitAccess || 'No disponible'}`,
          tertiary: `Tipo: ${access.accessType ? 'Autorizado' : 'No Autorizado'}, Porters: ${porters.join(', ')}`,
          additional: `Notas: ${access.accessNotes.map(note => note.note).join(', ')}`,
        };
      });
      setFilteredData(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleSubmit = async () => {
    if (!personId) {
      console.error('No se pudo encontrar el ID de la persona');
      return;
    }

    const transformedData = {
      entryAccess: new Date().toISOString().split('T')[0], 
      exitAccess: null, 
      accessType: true,
      people: personId,
      porters: [user.id],
      accessNotes: [], // Omitir las notas
    };

    if (isEditing) {
      try {
        const response = await axiosInstance.put(`/access/${editData.idAccess}`, transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Acceso actualizado con éxito:", response.data);
        fetchAndUpdateData();
      } catch (error) {
        console.error("Error al actualizar el acceso:", error.response || error.message);
      }
    } else {
      try {
        const response = await axiosInstance.post('/access', transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Acceso creado con éxito:", response.data);
        fetchAndUpdateData();
      } catch (error) {
        console.error("Error al crear el acceso:", error.response || error.message);
      }
    }

    setModalOpen(false);
    setEditData({ idAccess: '', entryAccess: '', exitAccess: '', accessType: true, notes: '', porters: [] });
    setPersonExists(false);
    setPersonId(null);
  };

  const handleEdit = (item) => {
    const secondarySplit = item.secondary.split(', ');
    const entryAccess = secondarySplit[0].split(': ')[1];
    const exitAccess = secondarySplit[1].split(': ')[1];

    setEditData({
      idAccess: item.id,
      entryAccess: entryAccess,
      exitAccess: exitAccess,
      accessType: item.tertiary.includes('Autorizado'),
      porters: item.porters.split(', ')
    });
    setIsEditing(true);
    setPersonExists(true);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    await deleteData(item.idAccess);
    fetchAndUpdateData();
  };

  const handleAddNew = () => {
    setCedula('');
    setPersonExists(false);
    setValidationError('');
    setEditData({ idAccess: '', entryAccess: '', exitAccess: '', accessType: true, notes: '', porters: [] });
    setPersonId(null);
    setModalOpen(true);
  };

  const handleCedulaSubmit = (e) => {
    e.preventDefault();
    const person = peopleData.find(p => p.cedula === cedula);
    if (person) {
      console.log('Persona encontrada:', person);
      setPersonExists(true);
      setEditData({ ...editData, owner: person.name });
      setPersonId(person.id);
    } else {
      setValidationError('La cédula no existe. Por favor, registre a la persona primero.');
    }
  };

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/2225617/pexels-photo-2225617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Buscar por Cédula"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}>
        <h1 className='text-3xl font-bold'>Access</h1>
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
              Cédula de la persona:
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
          <div>
            <p>Registrando acceso para la cédula: {cedula}</p>
            <button onClick={handleSubmit} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
              Registrar Entrada
            </button>
          </div>
        )}
      </Modal>
    </CommonLayout>
  );
};

export default Access;