import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const NurseIPDAdmissionList = () => {
  const [patientsWithAdmissions, setPatientsWithAdmissions] = useState([]);
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [patientName, setPatientName] = useState('');
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();

  // 🔄 Fetch patients and their active IPD admissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await axios.get('http://localhost:8000/api/receptionist/patients', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPatients = patientRes.data.patients || [];

        const admittedPatients = [];

        // 🔁 For each patient, fetch their IPD admissions
        for (const patient of allPatients) {
          const ipdRes = await axios.get(
            `http://localhost:8000/api/ipd/admissions/${patient._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const admissions = ipdRes.data.admissions || [];
          const admittedAdmissions = admissions.filter(a => a.status === 'Admitted');

          if (admittedAdmissions.length > 0) {
            admittedPatients.push({
              patient,
              admissions: admittedAdmissions,
            });
          }
        }

        setPatientsWithAdmissions(admittedPatients);
      
      
      
      
      
      
      } 
      
      
      
      
      
      catch (err) {
        console.error("Error fetching data", err);
        toast.error("Failed to load admitted patients");
      }
    };

    fetchData();
  }, [token]);

  const handleToggle = (patientId) => {
    setExpandedPatientId(prev => (prev === patientId ? null : patientId));
  };

  const handleDailyReport = (admission) => {
    navigate('/nurse-dashboard/DailyReports', {
      state: {
        ipdAdmissionId: admission._id,
        patientId: admission.patientId,
      },
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <ToastContainer />
      <h2>Nurse - Admitted Patients</h2>

      {patientsWithAdmissions.length === 0 ? (
        <p>No patients with admitted IPD admissions.</p>
      ) : (
        patientsWithAdmissions.map(({ patient, admissions }) => (
          <div key={patient._id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
            <p><strong>Name:</strong> {patient.fullName}</p>
            <button
              onClick={() => handleToggle(patient._id)}
              style={{
                background: expandedPatientId === patient._id ? 'gray' : 'blue',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
              }}
            >
              {expandedPatientId === patient._id ? 'Hide Admissions' : 'View IPD Admissions'}
            </button>

            {expandedPatientId === patient._id && (
              <div style={{ marginTop: '1rem' }}>
                <h4>IPD Admissions for {patient.firstName} {patient.lastName}</h4>
                {admissions.map(adm => (
                  <div
                    key={adm._id}
                    style={{
                      border: '1px solid #ccc',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}
                  >
                    <p><strong>Ward:</strong> {adm.wardId?.name} | <strong>Bed:</strong> {adm.bedNumber}</p>
                    <p><strong>Status:</strong> {adm.status}</p>
                    <button
                      onClick={() => handleDailyReport(adm)}
                      style={{
                        padding: '8px 16px',
                        background: 'green',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                    >
                      Daily Report
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NurseIPDAdmissionList;
