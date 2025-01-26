// src/services/apiService.js
export const fetchUserInfo = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/people/${userId}`);
    const data = await response.json();
    return data;
  };
  
  export const fetchUserEquipments = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/people/${userId}/equipments`);
    const data = await response.json();
    return data;
  };
  
  export const fetchUserVehicles = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/people/${userId}/vehicles`);
    const data = await response.json();
    return data;
  };
  
  export const fetchUserInvoices = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/people/${userId}/invoices`);
    const data = await response.json();
    return data;
  };
  
  export const fetchUserAccess = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/people/${userId}/access`);
    const data = await response.json();
    return data;
  };
  