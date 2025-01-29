import React, { useState, useEffect, useContext } from 'react';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../hooks/useData';
import UserContext from '../../Context';
import axiosInstance from '../../Services/apiService';

const Access = () => {
  const { user } = useContext(UserContext);
  const { data: accessData, loading, error } = useApi('/access');
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
    if (accessData.length && peopleData.length && porterData.length) {
      fetchAndUpdateData();
    }
  }, [accessData, peopleData, porterData]);

  const fetchAndUpdateData = async () => {
    try {
      const response = await axiosInstance.get('/access');
      const newAccessData = response.data;
      const mappedData = newAccessData.flatMap(access => {
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
      accessNotes: [],
    };

    try {
      if (isEditing) {
        const response = await axiosInstance.put(`/access/${editData.idAccess}`, transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        const response = await axiosInstance.post(`/access/people/${personId}`, transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const newAccessId = response.data.idAccess;

        await axiosInstance.put(`/access/${newAccessId}/porters/${user.id}`, transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      await fetchAndUpdateData();
    } catch (error) {
      console.error("Error al crear o actualizar el acceso:", error.response || error.message);
    }

    resetForm();
  };

  const handleExit = async (idAccess) => {
    const transformedData = {
      exitAccess: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await axiosInstance.put(`/access/${idAccess}`, transformedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchAndUpdateData();
    } catch (error) {
      console.error("Error al registrar la salida:", error.response || error.message);
    }
  };

  const resetForm = () => {
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
      accessType: item.tertiary.includes('Autorizado')
    });
    setIsEditing(true);
    setPersonExists(true);
    setModalOpen(true);
  };
  

  const handleDelete = async (item) => {
    console.log('Item a eliminar:', item);

    if (!item.id) {
      console.error('ID de acceso indefinido para el item:', item);
      return;
    }

    try {
      const response = await axiosInstance.delete(`/access/${item.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Acceso eliminado con éxito:", response.data);
      await fetchAndUpdateData();
    } catch (error) {
      console.error("Error al eliminar el acceso:", error.response || error.message);
    }
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
      setPersonExists(true);
      setEditData({ ...editData, owner: person.name });
      setPersonId(person.id);
    } else {
      setValidationError('La cédula no existe. Por favor, registre a la persona primero.');
    }
  };

  const filteredResults = filteredData.filter(item =>
    item.primary.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      ) : filteredResults.length > 0 ? (
        <List>
          {filteredResults.map((item, index) => (
            <CardItem
              key={index}
              data={item}
              onEdit={() => handleExit(item.id)}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </List>
      ) : (
        <p>No se encontraron datos</p>
      )}

      <Modal isOpen={modalOpen} onClose={resetForm}>
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
            <p>Registrando acceso para: {editData.owner || cedula}</p>
            <button onClick={handleSubmit} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
              Registrar Entrada
            </button>
            {isEditing && !editData.exitAccess && (
              <button onClick={() => handleExit(editData.idAccess)} className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
                Registrar Salida
              </button>
            )}
          </div>
        )}
      </Modal>
    </CommonLayout>
  );
};

export default Access;
