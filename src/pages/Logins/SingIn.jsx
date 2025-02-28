import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineIdcard, AiOutlinePhone } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { BiLock, BiUser } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import axiosInstance, { axiosInstanceLogin } from '../../Services/apiService';
import { useNavigate } from "react-router";

const SignIn = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    cedula: "",
    phone: "",
    employmentDate: "",
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [cedulaExists, setCedulaExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateStep1 = async () => {
    const formErrors = {};

    ["name", "cedula", "phone", "employmentDate"].forEach(field => {
      if (!formData[field]) formErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`;
    });

    if (formData.cedula && !/^\d{7,}$/.test(formData.cedula)) {
      formErrors.cedula = "Cedula must be a number with at least 7 digits";
    }

    if (formData.phone && !/^\d{7,}$/.test(formData.phone)) {
      formErrors.phone = "Phone number must be a number with at least 7 digits";
    }


    if (formData.employmentDate) {
      const dateParts = formData.employmentDate.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      const date = new Date(formData.employmentDate);
      const currentYear = new Date().getFullYear();
    
      if (isNaN(date.getTime()) || dateParts.length !== 3) {
        formErrors.employmentDate = "Invalid date, please enter a valid date (YYYY-MM-DD)";
      } else if (year < 1950 || year > currentYear) {
        formErrors.employmentDate = "Date out of range, please enter a date between 1900 and the current year";
      } else if (month < 1 || month > 12) {
        formErrors.employmentDate = "Invalid month, please enter a month between 1 and 12";
      } else if (day < 1 || day > 31) {
        formErrors.employmentDate = "Invalid day, please enter a day between 1 and 31";
      }
    }
    
    setErrors(formErrors);

    try {
      const cedulaResponse = await axiosInstance.get(`/porters`);
      const cedulaInUse = cedulaResponse.data.some(porter => porter.cedula === formData.cedula);

      if (cedulaInUse) {
        setCedulaExists(true);
        formErrors.cedula = "Cédula ya está en uso";
      } else {
        setCedulaExists(false);
      }
    } catch (error) {
      console.error("Error verifying cedula:", error);
      setCedulaExists(false);
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0 && !cedulaExists;
  };


  const validateStep2 = async () => {
    const formErrors = {};
    if (!formData.username) formErrors.username = "Username cannot be empty";
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!formData.password) {
      formErrors.password = "Password cannot be empty";
    } else if (!passwordRegex.test(formData.password)) {
      formErrors.password = "Password must have at least 8 characters, 1 uppercase, 1 number, and 1 special character (!@#$%^&*)";
    }

    try {
      const usernameResponse = await axiosInstance.get(`/user`);
      const usernameInUse = usernameResponse.data.some(user => user.userName === formData.username);

      if (usernameInUse) {
        setUsernameExists(true);
      } else {
        setUsernameExists(false);
      }
    } catch (error) {
      console.error("Error verifying username:", error);
      setUsernameExists(false);
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0 && !usernameExists;
  };

  const handleNext = async () => {
    if (await validateStep1()) setStep(2);
  };


  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!(await validateStep2())) return;

    const transformedData = {
      name: formData.name,
      cedula: formData.cedula,
      telefono: formData.phone,
      employmentDate: formData.employmentDate,
      userName: formData.username,
      password: formData.password
    };

    try {
      const responseUser = await axiosInstanceLogin.post(`/register`, transformedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert('User created successfully')
      navigate("/");

    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-blue-900">
      <section className="m-5 bg-white/10 backdrop-blur-md bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-3xl text-white font-bold text-center uppercase">Sign Up</h2>

          {step === 1 ? (
            <>
              {/* Datos Personales */}
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
                        className="p-3 pl-12 text-white border-b border-gray-700 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-blue-400"
                        value={formData[field]}
                        autoComplete='off'
                        onChange={handleChange}
                      />
                      {errors[field] && <span className="text-red-500 text-sm mt-1">{errors[field]}</span>}
                      {cedulaExists && field === "cedula" && <span className="text-red-500 text-sm mt-1">Cédula ya está en uso</span>}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full px-4 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
              >
                Next
              </button>
            </>
          ) : (
            <>
              {/* Credenciales */}
              <div className="space-y-5">
                {["username", "password"].map((field, index) => {
                  const labelText = field.charAt(0).toUpperCase() + field.slice(1);
                  const Icon = field === "username" ? BiUser : BiLock;
                  const type = field === "password" ? "password" : "text";

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
                      {usernameExists && field === "username" && <span className="text-red-500 text-sm mt-1">Username is already taken</span>}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition duration-300 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          <div className="flex flex-row items-center justify-center mt-4 text-gray-200">
            <p className="mr-2">Already have an account?</p>
            <Link to="/" className="text-blue-400 font-semibold hover:text-blue-700 transition duration-300 cursor-pointer">
              Login
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignIn;
