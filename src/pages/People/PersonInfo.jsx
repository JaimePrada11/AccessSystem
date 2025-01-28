import React from 'react';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../hooks/useData';
import { useParams } from 'react-router-dom';

const UserInfo = () => {
    const { id } = useParams();
    const { data: personData, loading, error } = useApi(`/people/${id}`);
    const { data: dataAccess, loading: accessLoading, error: accessError } = useApi(`/access`);

    const mapEquipmentsData = (person) =>
        person.equipments.map((item) => ({
            id: item.id,
            image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            primary: item.serial,
            secondary: `Fecha de Registro: ${item.registrationDate}`,
            tertiary: `Descripción: ${item.description}`,
        }));

    const mapVehiclesData = (person) =>
        person.vehicles.map((item) => ({
            id: item.idVehicle,
            image: item.vehicleType
            ? "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            : "https://images.pexels.com/photos/5803320/pexels-photo-5803320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          
            primary: item.plate,
            secondary: `Tipo: ${item.vehicleType ? 'Moto' : 'Carro'}`,
        }));

    const mapInvoicesData = (person) =>
        person.invoices.map((item) => ({
            id: item.idVehicle,
            image: 'https://images.pexels.com/photos/47344/dollar-currency-money-us-dollar-47344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            primary: item.date,
            secondary: `Estado: ${item.status ? 'Pagado' : 'Pendiente'}`,
        }));

    const mapAccessData = (access) =>
        access
            .filter(item => item.people === parseInt(id)) 
            .map((item) => ({
                id: item.idAccess,
                image: 'https://definicion.de/wp-content/uploads/2009/08/puerta.jpg',
                secondary: `Entrada: ${item.entryAccess}, Salida: ${item.exitAccess}`,
                tertiary: `Tipo: ${item.accessType ? 'Autorizado' : 'No Autorizado'}`,
                additional: `Notas: ${item.accessNotes.map(note => note.note).join(', ')}`,
            }));

    if (loading || accessLoading) return <p>Cargando datos...</p>;
    if (error || accessError) return <p>{`Error: ${error?.message || 'Error al cargar los datos'}`}</p>;
    if (!personData || !personData.name) return <p>No hay datos del usuario disponibles</p>;

    const { name, cedula, telefono, personType, equipments, vehicles, invoices } = personData;
    const mappedEquipmentsData = mapEquipmentsData(personData);
    const mappedVehiclesData = mapVehiclesData(personData);
    const mappedInvoicesData = mapInvoicesData(personData);
    const mappedAccessData = mapAccessData(dataAccess);

    const handleEdit = (id) => {
        console.log(`Edit user or item with ID: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Delete user or item with ID: ${id}`);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex flex-col items-center justify-center mb-8 bg-white shadow-md rounded-lg p-4">
                <h1 className="text-4xl font-semibold mb-4">{name}</h1>
                <p className="text-lg">Cédula: {cedula}</p>
                <p className="text-lg">Teléfono: {telefono}</p>
                <p className="text-lg">Tipo: {personType ? 'Empleado' : 'Visitante'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Equipos</h2>
                    {equipments?.length > 0 ? (
                        <List>
                            {mappedEquipmentsData.map((item) => (
                                <CardItem
                                    key={item.id}
                                    data={item}
                                    hidden={true}
                                    onEdit={() => handleEdit(item.id)}
                                    onDelete={() => handleDelete(item.id)}
                                />
                            ))}
                        </List>
                    ) : (
                        <p className="text-center text-gray-600">No hay equipos disponibles</p>
                    )}
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Vehículos</h2>
                    {vehicles?.length > 0 ? (
                        <List>
                            {mappedVehiclesData.map((item) => (
                                <CardItem
                                    key={item.id}
                                    data={item}
                                    hidden={true}
                                    onEdit={() => handleEdit(item.id)}
                                    onDelete={() => handleDelete(item.id)}
                                />
                            ))}
                        </List>
                    ) : (
                        <p className="text-center text-gray-600">No hay vehículos disponibles</p>
                    )}
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Facturas</h2>
                    {invoices?.length > 0 ? (
                        <List>
                            {mappedInvoicesData.map((item) => (
                                <CardItem
                                    key={item.id}
                                    data={item}
                                    hidden={true}
                                    onEdit={() => handleEdit(item.id)}
                                    onDelete={() => handleDelete(item.id)}
                                />
                            ))}
                        </List>
                    ) : (
                        <p className="text-center text-gray-600">No hay facturas disponibles</p>
                    )}
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Accesos</h2>
                    {mappedAccessData?.length > 0 ? (
                        <List>
                            {mappedAccessData.map((item) => (
                                <CardItem
                                    key={item.id}
                                    data={item}
                                    hidden={true}
                                    onEdit={() => handleEdit(item.id)}
                                    onDelete={() => handleDelete(item.id)}
                                />
                            ))}
                        </List>
                    ) : (
                        <p className="text-center flex items-center justify-center text-gray-600">No hay accesos disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
