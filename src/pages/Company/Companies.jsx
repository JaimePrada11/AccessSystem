import React, { useState, useEffect } from 'react';
import { FaBuilding, FaEdit } from "react-icons/fa";
import { MdOutlineAddCircleOutline, MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import CommonLayout from '../../components/CommonLayout';
import useApi from '../../hooks/useData';

const Companies = () => {
  const { data, loading, error, createItem, updateItem, removeItem } = useApi('/company');
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ id_company: null, name: '' });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (Array.isArray(data)) {
      const filtered = data.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, data]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editData.name.trim() === '') {
      setValidationError('El nombre no puede estar vacío o contener solo espacios en blanco');
      return;
    }

    const newCompany = { name: editData.name.trim() };

    if (editMode) {
      await updateItem(editData.id_company, newCompany);
    } else {
      await createItem(newCompany);
    }

    setEditData({ id_company: null, name: '' });
    setEditMode(false);
    setModalOpen(false);
    setValidationError('');
  };

  const handleEdit = (company) => {
    setEditData(company);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await removeItem(id);
  };

  const handleAddNew = () => {
    setEditData({ id_company: null, name: '' });
    setEditMode(false);
    setModalOpen(true);
  };

  return (
    <div>
      <CommonLayout
        titleImage="https://images.pexels.com/photos/162539/architecture-building-amsterdam-blue-sky-162539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        searchPlaceholder="Search by Name"
        searchValue={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAddNew={handleAddNew}
      />

      <div className="w-full flex flex-wrap justify-center gap-6 mt-6">
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <p>Cargando datos...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center w-full">
            <p>{error}</p>
          </div>
        ) : Array.isArray(filteredData) && filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id_company} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl flex flex-col items-center shadow-lg">
              <Link to={`/company/${item.id_company}`}>
                <FaBuilding size={50} className="text-gray-800 mt-4" />
              </Link>
              <div className="text-center mt-4">
                <div className="font-bold text-lg text-gray-800 uppercase tracking-wide">
                  {item.name}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="px-3 cursor-pointer py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                  onClick={() => handleEdit(item)}
                >
                  <FaEdit className="text-blue-500 text-xl" /> 
                </button>
                <button
                  className="px-3 cursor-pointer py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                  onClick={() => handleDelete(item.id_company)}
                >
                  <MdDelete className="text-red-500 text-xl" /> 
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center flex-col items-center w-full">
            <MdOutlineAddCircleOutline size={100} className="text-gray-500" />
            Add new Company
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Company" : "New Company"}</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
            {validationError && <p className="text-red-500 mt-1">{validationError}</p>}
          </label>
          <button type="submit" className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mt-4">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;
