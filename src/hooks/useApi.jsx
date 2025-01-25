import { useState, useEffect } from 'react';
import { fetchData, postData, putData, deleteData } from '../Services/apiService';

const useApi = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(endpoint);
        setData(result);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [endpoint]);

  const createItem = async (newItem) => {
    try {
      const result = await postData(endpoint, newItem);
      setData([...data, result]);
    } catch (error) {
      setError('Error creating item');
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const result = await putData(`${endpoint}/${id}`, updatedItem);
      const updatedData = data.map((item) => (item.id === id ? result : item));
      setData(updatedData);
    } catch (error) {
      setError('Error updating item');
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteData(`${endpoint}/${id}`);
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    } catch (error) {
      setError('Error deleting item');
    }
  };

  return { data, loading, error, createItem, updateItem, removeItem };
};

export default useApi;
