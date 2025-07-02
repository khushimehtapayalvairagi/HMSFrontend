import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:8000', { withCredentials: true });

const UpdateVisitStatusPage = () => {
const [activeTab, setActiveTab] = useState('Registered'); // Default to show the Registered tab

  const [registeredVisits, setRegisteredVisits] = useState([]);
  const [waitingVisits, setWaitingVisits] = useState([]);
  const [declineReasons, setDeclineReasons] = useState({});

  const token = localStorage.getItem('jwt');
  const patientId = localStorage.getItem('currentPatientId'); // ⚠️ You must store this during visit creation or login

  const fetchVisits = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/receptionist/visits/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const visits = res.data.visits;
      setRegisteredVisits(visits.filter(v => v.status === 'Registered'));
      setWaitingVisits(visits.filter(v => v.status === 'Waiting'));
    } catch (err) {
      console.error(err);
    toast.error("Failed to fetch patient visits");

    }
  };

  const updateStatus = async (visitId, newStatus, declineReason = '') => {
    try {
      const payload = { newStatus };
      if (newStatus === 'Declined') {
        payload.declineReason = declineReason;
      }

      await axios.put(`http://localhost:8000/api/receptionist/visits/status/${visitId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchVisits(); // Refresh after status update
    } catch (err) {
    toast.error(err.response?.data?.message || 'Status update failed');

    }
  };

  useEffect(() => {
    fetchVisits();

    socket.on('visitCompleted', (visitId) => {
      setWaitingVisits(prev => prev.filter(v => v._id !== visitId));
    });

    return () => socket.off('visitCompleted');
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '2rem' }}>
      <h2>Update Visit Status</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('Registered')} style={{ fontWeight: activeTab === 'Registered' ? 'bold' : 'normal' }}>
          Registered
        </button>
        <button onClick={() => setActiveTab('Waiting')} style={{ fontWeight: activeTab === 'Waiting' ? 'bold' : 'normal' }}>
          Waiting
        </button>
      </div>

      {activeTab === 'Registered' && (
        <div>
          <h3>Registered Patients</h3>
          {registeredVisits.length === 0 && <p>No registered visits.</p>}
          {registeredVisits.map(visit => (
            <div key={visit._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>Patient ID:</strong> {visit.patientId}</p>
              <p><strong>Visit Type:</strong> {visit.visitType}</p>
              <button onClick={() => updateStatus(visit._id, 'Waiting')}>Mark as Waiting</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Waiting' && (
        <div>
          <h3>Waiting Patients</h3>
          {waitingVisits.length === 0 && <p>No waiting visits.</p>}
          {waitingVisits.map(visit => (
            <div key={visit._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>Patient ID:</strong> {visit.patientId}</p>
              <p><strong>Visit Type:</strong> {visit.visitType}</p>
              <input
                type="text"
                placeholder="Enter Decline Reason"
                value={declineReasons[visit._id] || ''}
                onChange={(e) => setDeclineReasons({ ...declineReasons, [visit._id]: e.target.value })}
              />
              <button
                style={{ marginLeft: '0.5rem' }}
                onClick={() => {
                  const reason = declineReasons[visit._id];
                  if (!reason || reason.trim() === '') {
                    alert("Please provide a decline reason");
                    return;
                  }
                  updateStatus(visit._id, 'Declined', reason.trim());
                }}
              >
                Mark as Declined
              </button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default UpdateVisitStatusPage;
