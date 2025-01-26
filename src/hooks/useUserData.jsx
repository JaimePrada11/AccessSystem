import { useState, useEffect } from 'react';
import { fetchUserInfo, fetchUserEquipments, 
    fetchUserVehicles, fetchUserInvoices, fetchUserAccess } from '../Services/userService';

export const useUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo(userId);
        setUserInfo(data);
      } catch (error) {
        setError('Error fetching user info');
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, [userId]);

  return { userInfo, loading, error };
};

export const useUserEquipments = (userId) => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserEquipments = async () => {
      try {
        const data = await fetchUserEquipments(userId);
        setEquipments(data);
      } catch (error) {
        setError('Error fetching user equipments');
      } finally {
        setLoading(false);
      }
    };

    getUserEquipments();
  }, [userId]);

  return { equipments, loading, error };
};

export const useUserVehicles = (userId) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserVehicles = async () => {
      try {
        const data = await fetchUserVehicles(userId);
        setVehicles(data);
      } catch (error) {
        setError('Error fetching user vehicles');
      } finally {
        setLoading(false);
      }
    };

    getUserVehicles();
  }, [userId]);

  return { vehicles, loading, error };
};

export const useUserInvoices = (userId) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserInvoices = async () => {
      try {
        const data = await fetchUserInvoices(userId);
        setInvoices(data);
      } catch (error) {
        setError('Error fetching user invoices');
      } finally {
        setLoading(false);
      }
    };

    getUserInvoices();
  }, [userId]);

  return { invoices, loading, error };
};

export const useUserAccess = (userId) => {
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserAccess = async () => {
      try {
        const data = await fetchUserAccess(userId);
        setAccess(data);
      } catch (error) {
        setError('Error fetching user access');
      } finally {
        setLoading(false);
      }
    };

    getUserAccess();
  }, [userId]);

  return { access, loading, error };
};
