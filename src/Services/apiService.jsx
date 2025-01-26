const API_BASE_URL = 'http://localhost:8083/api';

export const fetchData = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  const data = await response.json();
  return data;
};

export const postData = async (endpoint, newData) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  });
  const data = await response.json();
  return data;
};

export const putData = async (endpoint, updatedData) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  const data = await response.json();
  return data;
};

export const deleteData = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
  return response.ok;
};
