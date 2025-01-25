import React, { useState, useEffect } from 'react';
import { FaBuilding, FaEdit } from "react-icons/fa";
import { MdOutlineAddCircleOutline, MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import CommonLayout from '../CommonLayout';

const Companies = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ id: null, name: '' });

  const initialData = [
    {
      id: 1,
      name: "prueba"
    }
  ];

  //  GET 
  const fetchCompanies = () => {
    /*
    fetch('http://localhost:8080/api/companies')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        setLoading(false);
      });
    */

    setData(initialData);
    setFilteredData(initialData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = data.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // POST
  const handleSubmit = (event) => {
    event.preventDefault();
    const newCompany = { name: editData.name };

    if (editMode) {
      const updatedData = data.map(company =>
        company.id === editData.id ? { ...company, name: newCompany.name } : company
      );
      setData(updatedData);
      setFilteredData(updatedData);
    } else {
      const updatedData = [...data, { id: data.length + 1, name: newCompany.name }];
      setData(updatedData);
      setFilteredData(updatedData);
    }

    setEditData({ id: null, name: '' });
    setEditMode(false);
    setModalOpen(false);
  };

  const handleEdit = (company) => {
    setEditData(company);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(company => company.id !== id);
    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleAddNew = () => {
    setEditData({ id: null, name: '' });
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
        ) : filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl flex flex-col items-center shadow-lg">
             <Link to={`/company/${item.id}`}>
             <FaBuilding size={50} className="text-gray-800 mt-4" />
             </Link>
              
              
              <div className="text-center mt-4">
                <div className="font-bold text-lg text-gray-800 uppercase tracking-wide">
                  {item.name}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                        className="px-3 py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                        onClick={() => handleEdit(item)}
                >
                  <FaEdit  className="text-blue-500 text-xl"  /> 
                </button>
                <button
                  className="px-3 py-1 rounded-md flex items-center transition-transform duration-300 hover:scale-105"
                  onClick={() => handleDelete(item.id)}
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
          </label>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;
