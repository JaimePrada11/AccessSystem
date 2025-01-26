
import React from 'react';
import { useUserInfo, useUserEquipments, useUserVehicles, useUserInvoices, useUserAccess } from '../hooks/useUserData';

const UserInfo = ({ userId }) => {
    const { userInfo, loading: userLoading, error: userError } = useUserInfo(userId);
    const { equipments, loading: equipmentsLoading, error: equipmentsError } = useUserEquipments(userId);
    const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useUserVehicles(userId);
    const { invoices, loading: invoicesLoading, error: invoicesError } = useUserInvoices(userId);
    const { access, loading: accessLoading, error: accessError } = useUserAccess(userId);

    if (userLoading || equipmentsLoading || vehiclesLoading || invoicesLoading || accessLoading) {
        return <p>Loading...</p>;
    }

    if (userError || equipmentsError || vehiclesError || invoicesError || accessError) {
        return <p>Error loading data</p>;
    }

    return (
        <div>
            <h1>User Info</h1>
            {userInfo && (
                <div>
                    <h2>{userInfo.name}</h2>
                    <p>Email: {userInfo.email}</p>
                </div>
            )}

            <h2>Equipments</h2>
            <ul>
                {equipments.map(equipment => (
                    <li key={equipment.id}>{equipment.description}</li>
                ))}
            </ul>

            <h2>Vehicles</h2>

        </div>
    );
};

export default UserInfo;
