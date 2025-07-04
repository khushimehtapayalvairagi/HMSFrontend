import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const IPDAdmissionList = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    if (!patientId) return;

    async function fetchAdmissions() {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/ipd/admissions/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetching admissions for:", patientId);
        setAdmissions(res.data.admissions || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load IPD admissions');
      }
    }

    fetchAdmissions();
  }, [patientId, token]);

  const handleCreateProcedure = (admissionId) => {
    navigate(`/receptionist-dashboard/ProcedureForm`, { state: { patientId, ipdAdmissionId: admissionId } });
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>IPD Admissions for Patient </h2>

      {admissions.length === 0 ? (
        <p>No admissions found for this patient.</p>
      ) : (
        admissions.map((adm) => (
          <div
            key={adm._id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <p><strong>Admission ID:</strong> {adm._id}</p>
            <p>
              <strong>Ward:</strong> {adm.wardId.name} | <strong>Bed:</strong> {adm.bedNumber} |{' '}
              <strong>Status:</strong> {adm.status}
            </p>
            <button
              onClick={() => handleCreateProcedure(adm._id)}
              style={{
                padding: '8px 16px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Create Procedure
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default IPDAdmissionList;
