import React, { useState } from 'react';

const Form = ({ fields, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field) => (
                <label key={field.name} className="block mb-2">
                    {field.label}:
                    {field.type === 'select' ? (
                        <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded"
                            required={field.required}
                        >
                            {field.options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded"
                            required={field.required}
                        />
                    )}
                </label>
            ))}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Save</button>
        </form>
    );
};

export default Form;
