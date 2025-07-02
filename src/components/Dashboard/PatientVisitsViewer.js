import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PatientVisitsViewer = () => {
  const [patientId, setPatientId] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchVisits = async () => {
  if (!patientId.trim()) {
    toast.error('Please enter a patient ID');
    return;
  }

  const token = localStorage.getItem('jwt');
  if (!token) {
    toast.error('Please login again');
    return;
  }

  setLoading(true);
  try {
    const res = await axios.get(`http://localhost:8000/api/receptionist/visits/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setVisits(res.data.visits || []);
  } catch (err) {
    console.error("Fetch visits error:", err);
    toast.error(err.response?.data?.message || "Failed to fetch visits");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px' }}>
      <h2>Search Patient Visits</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button onClick={fetchVisits} style={{ marginLeft: '10px', padding: '0.5rem 1rem' }}>
          {loading ? 'Loading...' : 'Fetch Visits'}
        </button>
      </div>

      {visits.length > 0 ? (
        <div>
          <h3>Total Visits: {visits.length}</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {visits.map((visit) => (
              <li key={visit._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
                <p><strong>Visit ID:</strong> {visit._id}</p>
                <p><strong>Visit Type:</strong> {visit.visitType}</p>
                <p><strong>Doctor:</strong> {visit.assignedDoctorId?.userId?.name || 'N/A'}</p>
                <p><strong>Referred By:</strong> {visit.referredBy?.name || 'N/A'}</p>
               
                <p><strong>Date:</strong> {new Date(visit.visitDate).toLocaleString()}</p>
               <p><strong>Status:</strong> {visit.status}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No visits found for this patient.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PatientVisitsViewer;
