import React, { useState, useEffect } from 'react';
import { FaBuilding } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircle } from "react-icons/io";
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

const Companies = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({ name: '' });

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

    /*
    fetch('http://localhost:8080/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCompany)
    })
      .then(response => response.json())
      .then(data => {
        setData([...data, data]);
        setFilteredData([...data, data]);
        setEditData({ name: '' });
        setModalOpen(false);
      })
      .catch(error => {
        setError('Error adding company');
      });
    */

    const updatedData = [...data, { id: data.length + 1, name: newCompany.name }];
    setData(updatedData);
    setFilteredData(updatedData);
    setEditData({ name: '' });
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="w-full">
        <img
          src="https://images.pexels.com/photos/417192/pexels-photo-417192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className="shadow-xl w-full h-64 object-cover rounded-lg"
          alt="Building"
        />
      </div>
      <div className="w-full flex flex-row justify-between items-center gap-4 p-4">
        <div className="relative flex items-center w-full max-w-md">
          <CiSearch className="absolute left-3 text-gray-500" size={24} />
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 h-10 pl-10 pr-4 py-2 bg-white text-gray-800 placeholder-gray-500 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="w-full max-w-md flex justify-end">
          <button 
            onClick={() => setModalOpen(true)}
            className="w-32 h-10 bg-blue-600 text-white px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform transform hover:scale-105">
            <IoMdAddCircle className="text-xl" /> Add New
          </button>
        </div>
      </div>
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
            <Link to={`/company/${item.id}`} key={index} className="bg-white/10 backdrop-blur-lg p-6 transform transition-transform duration-300 hover:scale-105 rounded-xl flex flex-col items-center shadow-lg">
              <FaBuilding size={50} className="text-gray-800 mt-4" />
              <div className="text-center mt-4">
                <div className="font-bold text-lg text-gray-800 uppercase tracking-wide">
                  {item.name}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex justify-center flex-col items-center w-full">
            <MdOutlineAddCircleOutline size={100} className="text-gray-500" />
            Add new Company
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">New Company</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ name: e.target.value })}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </label>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Save</button>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;
