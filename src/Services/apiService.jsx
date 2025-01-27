import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8083/api/",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

export const fetchData = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const postData = async (endpoint, newData) => {
  try {
    const response = await axiosInstance.post(endpoint, newData);
    return response.data;
  } catch (error) {
    console.error('Error posting data', error);
    throw error;
  }
};

export const putData = async (endpoint, updatedData) => {
  try {
    const response = await axiosInstance.put(endpoint, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error putting data', error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting data', error);
    throw error;
  }
};
