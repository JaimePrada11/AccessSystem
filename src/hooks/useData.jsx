import { useState, useEffect } from 'react';
import axiosInstance from '../Services/apiService';

const useApi = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(endpoint);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  const postData = async (newData) => {
    try {
      const response = await axiosInstance.post(endpoint, newData);
      setData((prevData) => [...prevData, response.data]);
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const putData = async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${endpoint}/${id}`, updatedData);
      setData((prevData) => prevData.map((item) => (item.id === id ? response.data : item)));
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const deleteData = async (id) => {
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  return { data, loading, error, postData, putData, deleteData };
};

export default useApi;
