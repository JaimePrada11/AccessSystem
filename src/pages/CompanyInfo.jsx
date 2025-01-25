import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import Table from '../components/Table';
import { IoMdAddCircle } from "react-icons/io";
import Modal from '../components/Modal';
import Form from '../components/Form';
import CommonLayout from '../CommonLayout';

const CompanyInfo = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', cedula: '', phone: '', type: 'visitante' });
    const [filterType, setFilterType] = useState(null);

    const initialData = [
        {
            id: 1,
            name: "Jaime",
            cedula: "123",
            phone: "1234",
            type: false
        }
    ];

    useEffect(() => {
        setData(initialData);
        setFilteredData(initialData);
    }, []);

    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== null) {
            filtered = filtered.filter(item =>
                (filterType === 'empleado' && item.type === true) ||
                (filterType === 'visitante' && item.type === false)
            );
        }

        setFilteredData(filtered);
    }, [searchTerm, data, filterType]);

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Cedula', accessor: 'cedula' },
        { Header: 'Phone', accessor: 'phone' },
        {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ value }) => (value ? 'Empleado' : 'Visitante')
        },
    ];

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
            extraButtons={[
                {
                    label: 'Empleado',
                    onClick: () => handleFilterClick('empleado'),
                    className: filterType === 'empleado' ? 'bg-blue-600' : 'bg-gray-200'
                },
                {
                    label: 'Visitante',
                    onClick: () => handleFilterClick('visitante'),
                    className: filterType === 'visitante' ? 'bg-blue-600' : 'bg-gray-200'
                }
            ]}
        >
            <Table columns={columns} data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />
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