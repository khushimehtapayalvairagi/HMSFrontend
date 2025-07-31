import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DischargePatient = () => {
  const [admissions, setAdmissions] = useState([]);
  const token = localStorage.getItem('jwt');

 const fetchAdmittedPatients = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const patientRes = await axios.get('http://localhost:8000/api/receptionist/patients', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const admittedAdmissions = [];

    for (const patient of patientRes.data.patients) {
      const res = await axios.get(`http://localhost:8000/api/ipd/admissions/${patient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const admissions = res.data.admissions || [];
      const admitted = admissions.filter(adm => adm.status === 'Admitted');

      // Collect admissions not just patient
      admittedAdmissions.push(...admitted);
    }

    setAdmissions(admittedAdmissions);
  } catch (err) {
    toast.error('Failed to fetch admitted patients');
  }
};


  const handleDischarge = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/ipd/admissions/${id}/discharge`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Patient discharged');
      // Remove from current list
      setAdmissions(prev => prev.filter(adm => adm._id !== id));
    } catch (err) {
      toast.error('Unpaid bills');
    }
  };

  useEffect(() => {
    fetchAdmittedPatients();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Currently Admitted Patients</h2>
      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Ward</th>
            <th>Bed</th>
            <th>Admitted On</th>
            <th>Expected Discharge</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admissions.length === 0 ? (
            <tr><td colSpan="6">No admitted patients</td></tr>
          ) : (
            admissions.map(adm => (
              <tr key={adm._id}>
                <td>{adm.patientId?.fullName || 'N/A'}</td>
                <td>{adm.wardId?.name || 'N/A'}</td>
                <td>{adm.bedNumber}</td>
                <td>{new Date(adm.createdAt).toLocaleString()}</td>
                <td>{new Date(adm.expectedDischargeDate).toLocaleDateString()}</td>
                <td><button onClick={() => handleDischarge(adm._id)}>Discharge</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default DischargePatient;
