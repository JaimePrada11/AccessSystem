const Form = ({ fields, initialData, onChange }) => {
  return (
    <>
      {fields.map(field => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block mb-2">{field.label}</label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={initialData[field.name]}
              onChange={onChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required={field.required}
            >
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={initialData[field.name]}
              onChange={onChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required={field.required}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default Form;
