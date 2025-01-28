import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../Context';
import Modal from '../../components/Modal';
import Form from '../../components/FormInvoice';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../hooks/useData';
import axiosInstance from '../../Services/apiService';

export default function Invoices() {
  const { user } = useContext(UserContext);
  const { data: invoiceData, loading: invoiceLoading, error: invoiceError } = useApi('/invoices');
  const { data: peopleData, loading: peopleLoading, error: peopleError } = useApi('/people');
  const { data: porterData, loading: porterLoading, error: porterError } = useApi('/porters');
  const { data: membershipData, loading: membershipLoading, error: membershipError } = useApi('/membership');

  const [membershipId, setMembershipId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editData, setEditData] = useState({ idInvoice: null, date: '', status: '' });
  const [cedula, setCedula] = useState('');
  const [personId, setPersonId] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (invoiceData.length && peopleData.length && porterData.length && membershipData.length) {
      fetchAndUpdateData();
    }
  }, [invoiceData, peopleData, porterData, membershipData]);

  const fetchAndUpdateData = async () => {
    try {
      const mappedData = invoiceData.map((invoice) => {
        const person = peopleData.find((p) => p.invoices.some((inv) => inv.idInvoice === invoice.idInvoice));
        const porters = porterData.filter((porter) =>
          porter.invoices.some((inv) => inv.idInvoice === invoice.idInvoice)
        );
        const membership = membershipData.find((m) =>
          m.invoices.some((inv) => inv.idInvoice === invoice.idInvoice)
        );

        return {
          id: invoice.idInvoice,
          image: 'https://www.invoicesimple.com/wp-content/uploads/2024/08/AdobeStock_105177264-1.jpeg',
          primary: person ? `${person.name} (CC. ${person.cedula})` : 'Persona desconocida',
          secondary: `Fecha: ${invoice.date}`,
          tertiary: `Membresía: ${membership ? `$${membership.price}` : 'No aplica'}`,
          additional: `Portero: ${porters.length > 0 ? porters.map((p) => p.name).join(', ') : 'Ninguno'}`,
        };
      });
      setFilteredData(mappedData);
    } catch (error) {
      console.error('Error al mapear los datos:', error);
    }
  };

  const handleAddNew = () => {
    setEditData({ idInvoice: null, date: '', status: '' });
    setIsEditing(false);
    setPersonId(null);
    setCedula('');
    setValidationError('');
    setModalOpen(true);
  };

  const handleCedulaSubmit = (e) => {
    e.preventDefault();
    const person = peopleData.find((p) => p.cedula === cedula);
    if (person) {
      setPersonId(person.id);
      setValidationError('');
      console.log('Persona encontrada:', person);
    } else {
      setValidationError('La persona no está registrada.');
    }
  };

  const handleSubmit = async (newData) => {

    if (!personId) {
      setValidationError('Debes verificar la cédula primero.');
      return;
    }

    if (!membershipId) {
      setValidationError('Debes seleccionar una membresía.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const dataToSubmit = {
      status: true,
      date: currentDate,
    };

    const endpoint = `invoices/${personId}/people/${user.id}/porters/${membershipId}/membership`;

    try {
      const response = await axiosInstance.post(endpoint, dataToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Factura creada con éxito:', response.data);
      fetchAndUpdateData();
    } catch (error) {
      console.error('Error al crear la factura:', error.response || error.message);
      setValidationError('Error al crear la factura.');
    }

    setModalOpen(false);
  };

  const fields = [
    {
      name: 'membership',
      label: 'Membresía',
      type: 'select',
      options:
        membershipData?.map((m) => ({
          value: m.idMembership,
          label: `Duración: ${m.duration} meses - $${m.price}`,
        })) || [],
      required: true,
    },
  ];

  return (
    <CommonLayout
      titleImage="https://images.pexels.com/photos/6927354/pexels-photo-6927354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      searchPlaceholder="Buscar por cédula o ID"
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onAddNew={handleAddNew}
    >
      <h1 className="text-3xl font-bold">Facturas</h1>

      {invoiceLoading || peopleLoading || porterLoading || membershipLoading ? (
        <p>Cargando datos...</p>
      ) : invoiceError || peopleError || porterError || membershipError ? (
        <p>Error al cargar datos</p>
      ) : filteredData.length > 0 ? (
        <List>
          {filteredData
            .filter((item) =>
              item.primary.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item, index) => (
              <CardItem key={index} data={item} hidden={true} />
            ))}
        </List>
      ) : (
        <p>No se encontraron facturas</p>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {!personId ? (
          <form onSubmit={handleCedulaSubmit}>
            <label>
              Cédula del usuario:
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
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            handleSubmit(editData); 
          }}>
            <Form
              fields={fields}
              initialData={editData}
              onChange={(e) => {
                setEditData({ ...editData, [e.target.name]: e.target.value });
                if (e.target.name === 'membership') {
                  setMembershipId(e.target.value);
                }
              }}
            />
            <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
              Crear Factura
            </button>
          </form>
        )}
      </Modal>
    </CommonLayout>
  );
}
