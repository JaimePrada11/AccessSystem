import React, { useState } from 'react';

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    plate: "",
    tipo: ""
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
          <h2 className="text-3xl font-bold text-center text-gray-100 uppercase">Register Vehicle</h2>
          <div className="space-y-5">
            <div className="relative flex flex-col">
              <label htmlFor="plate" className="mb-2 font-semibold text-gray-300">Plate</label>
              <input
                type="text"
                name="plate"
                id="plate"
                placeholder="Enter plate number"
                className="p-3 pl-12 text-gray-900 border-b border-gray-700 bg-gray-100 bg-opacity-75 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
                value={formData.plate}
                onChange={handleChange}
              />
              {errors.plate && <span className="text-red-500 text-sm mt-1">{errors.plate}</span>}
            </div>
            <div className="relative flex flex-col">
              <label htmlFor="tipo" className="mb-2 font-semibold text-gray-300">Tipo</label>
              <select
                name="tipo"
                id="tipo"
                className="p-3 pl-12 text-gray-900 border-b border-gray-700 bg-gray-100 bg-opacity-75 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="" disabled>Select vehicle type</option>
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
              </select>
              {errors.tipo && <span className="text-red-500 text-sm mt-1">{errors.tipo}</span>}
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

export default VehicleForm;
