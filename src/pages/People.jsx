import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineIdcard, AiOutlinePhone } from 'react-icons/ai';


const People = () => {

  const datas = [
    {
        name: "John Doe",
        cedula: "123456789",
        phone: "555-1234",
        tipo: "Visitante",
        companie: "ACME Corp",
        carnet: "123-456-789",
        image: "https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
    }
];

const mappedData = datas.map(item => ({
    image : item.image,
    primary: item.name,
    secondary: `CC. ${item.cedula}  Phone ${item.phone}`,
    tertiary: ` ${item.tipo},  ${item.companie}`,
    additional: `Carnet: ${item.carnet}`
}));

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

    </div>
  );
};

export default People;
