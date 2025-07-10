import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NurseScheduledProcedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Scheduled');

  const fetchAllProcedures = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const res = await axios.get('http://localhost:8000/api/receptionist/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const patients = res.data.patients || [];

      const allProcedurePromises = patients.map(patient =>
        axios
          .get(`http://localhost:8000/api/procedures/schedules/${patient._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => res.data.procedures.map(proc => ({ ...proc, patient })))
          .catch(() => [])
      );

      const allProcedures = (await Promise.all(allProcedurePromises)).flat();
      setProcedures(allProcedures);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load procedures');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('jwt');
    try {
      await axios.put(
        `http://localhost:8000/api/procedures/schedules/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);

      setProcedures(prev =>
        prev.map(p => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllProcedures();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;

  const filteredProcedures = procedures.filter(p => p.status === activeTab);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Nurse Dashboard – Procedures</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {['Scheduled', 'In Progress', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === tab ? '#007BFF' : '#f0f0f0',
              color: activeTab === tab ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredProcedures.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No procedures found in "{activeTab}" tab.</p>
      ) : (
        filteredProcedures.map(proc => (
          <div key={proc._id} style={{ background: '#f9f9f9', marginBottom: '1rem', padding: '1rem', borderRadius: '8px' }}>
            <p><strong>Patient:</strong> {proc.patient?.fullName}</p>
            <p><strong>Procedure:</strong> {proc.procedureId?.name || 'N/A'}</p>
            <p><strong>Scheduled At:</strong> {new Date(proc.scheduledDateTime).toLocaleString()}</p>
            <p><strong>Room:</strong> 
              {proc.procedureType?.trim().toLowerCase() === 'ot'
                ? proc.roomId?.name || 'N/A'
                : proc.labourRoomId?.name || 'N/A'}
            </p>
            <p><strong>Type:</strong> {proc.procedureType}</p>
            <p><strong>Surgeon:</strong> {proc.surgeonId?.userId?.name || 'N/A'}</p>
            <p><strong>Status:</strong> {proc.status}</p>

            {/* Only show dropdown if status is not completed */}
            {proc.status !== 'Completed' && (
              <select onChange={e => updateStatus(proc._id, e.target.value)} defaultValue="">
                <option value="" disabled>Update Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            )}
          </div>
        ))
      )}

      <ToastContainer />
    </div>
  );
};

export default NurseScheduledProcedures;
