import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineIdcard, AiOutlinePhone } from 'react-icons/ai';
import VehicleForm from '../components/VehicleForm';
import EquipmentForm from '../components/EquipmentForm';

const People = () => {
  const [formData, setFormData] = useState({
    name: "",
    cedula: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty`;
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Form submit logic here
      console.log("Form submitted successfully!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <section className="mt-6 mb-5 bg-white bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <form className="space-y-6 w-[100%]" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold text-center text-gray-100 uppercase">Register Person</h2>
          <div className="space-y-5">
            {["name", "cedula", "phone"].map((field, index) => {
              const labelText = field.charAt(0).toUpperCase() + field.slice(1);
              const Icon = field === "name" ? AiOutlineUser : field === "cedula" ? AiOutlineIdcard : AiOutlinePhone;
              const type = "text";
              
              return (
                <div key={index} className="relative flex flex-col">
                  <label htmlFor={field} className="mb-2 font-semibold text-gray-300">{labelText}</label>
                  <Icon className="absolute left-3 top-10 text-gray-400" size={24} />
                  <input
                    type={type}
                    name={field}
                    id={field}
                    placeholder={`Enter your ${labelText.toLowerCase()}`}
                    className="p-3 pl-12 text-gray-900 border-b border-gray-700 bg-gray-100 bg-opacity-75 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  {errors[field] && <span className="text-red-500 text-sm mt-1">{errors[field]}</span>}
                </div>
              );
            })}
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-500 transition duration-300 cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </section>
      <VehicleForm/>
      <EquipmentForm/>
    </div>
  );
};

export default People;
