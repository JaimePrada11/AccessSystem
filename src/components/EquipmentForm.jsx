import React, { useState } from 'react';

const EquipmentForm = () => {
  const [formData, setFormData] = useState({
    serial: "",
    registrationDate: "",
    description: ""
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
          <h2 className="text-3xl font-bold text-center text-gray-100 uppercase">Register Equipment</h2>
          <div className="space-y-5">
            <div className="relative flex flex-col">
              <label htmlFor="serial" className="mb-2 font-semibold text-gray-300">Serial</label>
              <input
                type="text"
                name="serial"
                id="serial"
                placeholder="Enter serial number"
                className="p-3 pl-12 text-gray-900 border-b border-gray-700 bg-gray-100 bg-opacity-75 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
                value={formData.serial}
                onChange={handleChange}
              />
              {errors.serial && <span className="text-red-500 text-sm mt-1">{errors.serial}</span>}
            </div>
            <div className="relative flex flex-col">
              <label htmlFor="registrationDate" className="mb-2 font-semibold text-gray-300">Registration Date</label>
              <input
                type="date"
                name="registrationDate"
                id="registrationDate"
                className="p-3 pl-12 text-gray-900 border-b border-gray-700 bg-gray-100 bg-opacity-75 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
                value={formData.registrationDate}
                onChange={handleChange}
              />
              {errors.registrationDate && <span className="text-red-500 text-sm mt-1">{errors.registrationDate}</span>}
            </div>
            <div className="relative flex flex-col">
              <label htmlFor="description" className="mb-2 font-semibold text-gray-300">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder="Enter description"
                className="p-3 pl-12 text-gray-900 border-b border-gray-700 bg-gray-100 bg-opacity-75 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description}</span>}
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-500 transition duration-300 cursor-pointer"
          >
            Register
          </button>
        </form>
      </section>
    </div>
  );
};

export default EquipmentForm;
