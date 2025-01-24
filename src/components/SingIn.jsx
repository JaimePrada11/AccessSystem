import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineIdcard, AiOutlinePhone } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    cedula: "",
    phone: "",
    employmentDate: ""
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
    <div className="flex items-center  justify-center min-h-screen bg-gradient-to-br from-black to-blue-900">
      <section className="bg-white/10 mt-6 backdrop-blur-md bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form className="space-y-6 " onSubmit={handleSubmit}>
          <h2 className="text-3xl text-white font-bold text-center text-gray-800 uppercase">Sign Up</h2>
          <div className="space-y-5">
            {["name", "cedula", "phone", "employmentDate"].map((field, index) => {
              const labelText = field.charAt(0).toUpperCase() + field.slice(1);
              const Icon = field === "name" ? AiOutlineUser : field === "cedula" ? AiOutlineIdcard : field === "phone" ? AiOutlinePhone : FaRegCalendarAlt;
              const type = field === "employmentDate" ? "date" : "text";
              
              return (
                <div key={index} className="relative flex flex-col">
                  <label htmlFor={field} className="mb-2 font-semibold text-gray-200">{labelText}</label>
                  <Icon className="absolute left-3 top-10 text-white" size={24} />
                  <input
                    type={type}
                    name={field}
                    id={field}
                    placeholder={`Enter your ${labelText.toLowerCase()}`}
                    className="p-3 pl-12 text-white border-b border-gray-700 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full px-4 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
          >
            Sign Up
          </button>
          <div className="flex flex-row items-center justify-center mt-4 text-gray-200">
            <p className="mr-2">Already have an account?</p>
            <button 
              type="button" 
              className="text-blue-400 font-semibold hover:text-blue-700 transition duration-300 cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignIn;
