import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaBed,
  FaChevronDown,
  FaChevronUp,
  FaHospital,
  FaClipboardList,
  FaUserMd,
  FaPlus
} from 'react-icons/fa';

const NurseIPDAdmissionList = () => {
  const [patientsWithAdmissions, setPatientsWithAdmissions] = useState([]);
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPatients = patientRes.data.patients || [];
        const admittedPatients = [];

        for (const patient of allPatients) {
          const ipdRes = await axios.get(
            `${BASE_URL}/api/ipd/admissions/${patient._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const admissions = ipdRes.data.admissions || [];
          const admittedAdmissions = admissions.filter(a => a.status === 'Admitted');

          if (admittedAdmissions.length > 0) {
            // Fetch procedure schedules for this patient
            const procedureRes = await axios.get(
              `${BASE_URL}/api/procedures/schedules/${patient._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const procedures = procedureRes.data.procedures || [];

            // Check if there's at least one non-completed procedure
            const hasNonCompletedProcedure = procedures.some(
              (p) => p.status !== 'Completed'
            );

            if (hasNonCompletedProcedure) {
              admittedPatients.push({
                patient,
                admissions: admittedAdmissions,
              });
            }
          }
        }

        setPatientsWithAdmissions(admittedPatients);
      } catch (err) {
        console.error("Error fetching data", err);
        toast.error("Failed to load admitted patients");
      }
    };

    fetchData();
  }, [token, BASE_URL]);

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
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '1rem' }}>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <FaUserMd style={{ marginRight: '10px' }} />
        Nurse - IPD Admitted Patients
      </h2>

      {patientsWithAdmissions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6c757d' }}>
          No admitted patients found.
        </p>
      ) : (
        patientsWithAdmissions.map(({ patient, admissions }) => (
          <div
            key={patient._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div
              onClick={() => handleToggle(patient._id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                <FaUserMd style={{ marginRight: '8px' }} />
                {patient.fullName}
              </p>
              <span style={{ color: '#007bff', fontWeight: 500 }}>
                {expandedPatientId === patient._id ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {expandedPatientId === patient._id && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>
                  <FaClipboardList style={{ marginRight: '6px' }} />
                  Admissions for {patient.fullName}
                </h4>
                {admissions.map(adm => (
                  <div
                    key={adm._id}
                    style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}
                  >
                    <p>
                      <FaHospital style={{ marginRight: '6px' }} />
                      <strong>Ward:</strong> {adm.wardId?.name}
                    </p>
                    <p>
                      <FaBed style={{ marginRight: '6px' }} />
                      <strong>Bed:</strong> {adm.bedNumber}
                    </p>
                    <p><strong>Status:</strong> {adm.status}</p>
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDailyReport(adm)}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '8px 14px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          marginTop: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <FaPlus /> Daily Report
                      </button>
                    </div>
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
