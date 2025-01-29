import { useState, useEffect } from 'react';
import axiosInstance from '../Services/apiService';

const useApi = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const postData = async (newData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(endpoint, newData);
      setData((prevData) => [...prevData, response.data]);
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  const putData = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`${endpoint}/${id}`, updatedData);
      setData((prevData) => prevData.map((item) => (item.id === id ? response.data : item)));
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  const deleteData = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { data, loading, error, postData, putData, deleteData };
};

export default useApi;
