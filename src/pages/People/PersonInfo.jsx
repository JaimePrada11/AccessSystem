import React from 'react';
import CommonLayout from '../../components/CommonLayout';
import List from '../../components/Cards/List';
import CardItem from '../../components/Cards/CardItem';
import useApi from '../../hooks/useData';
import { useParams } from 'react-router-dom';

const UserInfo = () => {
    const { id } = useParams();
    const { data, loading, error } = useApi(`/people/${id}`);

    const mapEquipmentsData = (person) =>
        person.equipments.map((item) => ({
            id: item.id,
            image: item.image || '',
            primary: item.serial,
            secondary: `Fecha de Registro: ${item.registrationDate}`,
            tertiary: `Descripción: ${item.description}`
        }));

    const mapVehiclesData = (person) =>
        person.vehicles.map((item) => ({
            id: item.idVehicle,
            image: item.image || '',
            primary: item.plate,
            secondary: `Tipo: ${item.vehicleType ? 'Moto' : 'Carro'}`
        }));

        const invoicesData = (person) =>
            person.invoices.map((item) => ({
                id: item.idVehicle,
                image: item.image || '',
                primary: item.date,
                secondary: `Tipo: ${item.status ? 'Moto' : 'Carro'}`
            }));

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{`Error: ${error.message || 'Error al cargar los datos'}`}</p>;
    if (!data || !data.name) return <p>No user data available</p>;

    const { name, cedula, telefono, personType, equipments, vehicles, invoices } = data;
    const mappedEquipmentsData = mapEquipmentsData(data);
    const mappedVehiclesData = mapVehiclesData(data);
    const mappedInvoice = invoicesData(data);

    const handleEdit = (id) => {
        console.log(`Edit user or item with ID: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Delete user or item with ID: ${id}`);
    };

    return (
        <>
            <div className="p-6">
                <div className="flex flex-col items-center justify-center mb-8">
                    <h1 className="text-3xl font-semibold mb-4">{name}</h1>
                    <p className="text-lg">Cedula: {cedula}</p>
                    <p className="text-lg">Telefono: {telefono}</p>
                    <p className="text-lg">Tipo: {personType ? 'Empleado' : 'Visitante'}</p>
                </div>
                <div className="flex flex-wrap justify-center">
                    <div className="w-full px-2 flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 px-2">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Equipments</h2>
                            {equipments?.length > 0 ? (
                                <List>
                                    {mappedEquipmentsData.map((item) => (
                                        <CardItem
                                            key={item.id}
                                            data={item}
                                            onEdit={() => handleEdit(item.id)}
                                            onDelete={() => handleDelete(item.id)}
                                        />
                                    ))}
                                </List>
                            ) : (
                                <p>No equipment available</p>
                            )}
                        </div>
                        <div className="w-full md:w-1/2 px-2">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Vehicles</h2>
                            {vehicles?.length > 0 ? (
                                <List>
                                    {mappedVehiclesData.map((item) => (
                                        <CardItem
                                            key={item.id}
                                            data={item}
                                            onEdit={() => handleEdit(item.id)}
                                            onDelete={() => handleDelete(item.id)}
                                        />
                                    ))}
                                </List>
                            ) : (
                                <p>No vehicles available</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full px-2">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Invoices</h2>
                        {invoices?.length > 0 ? (
                             <List>
                             {mappedInvoice.map((item) => (
                                 <CardItem
                                     key={item.id}
                                     data={item}
                                     onEdit={() => handleEdit(item.id)}
                                     onDelete={() => handleDelete(item.id)}
                                 />
                             ))}
                         </List>
                        ) : (
                            <p>No invoices available</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserInfo;
