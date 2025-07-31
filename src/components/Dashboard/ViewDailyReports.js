import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewDailyReports = () => {
  const location = useLocation();
  const token = localStorage.getItem('jwt');
  const { ipdAdmissionId } = location.state || {};

  const [patientsWithReports, setPatientsWithReports] = useState([]);
  const [singleAdmissionReports, setSingleAdmissionReports] = useState([]);

  useEffect(() => {
    const fetchSingleAdmissionReports = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/ipd/reports/${ipdAdmissionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSingleAdmissionReports(res.data.reports || []);
      } catch (err) {
        toast.error('Failed to load report');
      }
    };

    const fetchAllReports = async () => {
      try {
        const patientRes = await axios.get('http://localhost:8000/api/receptionist/patients', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPatients = patientRes.data.patients || [];
        const admittedPatientsWithReports = [];

        for (const patient of allPatients) {
          const ipdRes = await axios.get(`http://localhost:8000/api/ipd/admissions/${patient._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const admittedAdmissions = (ipdRes.data.admissions || []).filter(adm => adm.status === 'Admitted');

          const enrichedAdmissions = [];

          for (const admission of admittedAdmissions) {
            const reportRes = await axios.get(`http://localhost:8000/api/ipd/reports/${admission._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            enrichedAdmissions.push({
              ...admission,
              reports: reportRes.data.reports || [],
            });
          }

          if (enrichedAdmissions.length > 0) {
            admittedPatientsWithReports.push({
              patient,
              admissions: enrichedAdmissions,
            });
          }
        }

        setPatientsWithReports(admittedPatientsWithReports);
      } catch (err) {
        toast.error('Failed to load daily reports');
      }
    };

    if (ipdAdmissionId) {
      fetchSingleAdmissionReports();
    } else {
      fetchAllReports();
    }
  }, [ipdAdmissionId, token]);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        {ipdAdmissionId ? 'Daily Reports for Admission' : 'All Daily Reports for Admitted Patients'}
      </h2>

      {ipdAdmissionId ? (
        singleAdmissionReports.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No reports found.</p>
        ) : (
          singleAdmissionReports.map((report, index) => (
            <div
              key={report._id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#fff',
              }}
            >
              <h4 style={{ marginBottom: '1rem', color: '#007BFF' }}>
                Report #{singleAdmissionReports.length - index}
              </h4>
              <p><strong>Date:</strong> {new Date(report.reportDateTime).toLocaleString()}</p>
              <p><strong>Recorded By:</strong> {report.recordedByUserId?.name} ({report.recordedByUserId?.role})</p>
              <ul style={{ paddingLeft: '1.2rem' }}>
                <li><strong>Temperature:</strong> {report.vitals?.temperature}</li>
                <li><strong>Pulse:</strong> {report.vitals?.pulse}</li>
                <li><strong>BP:</strong> {report.vitals?.bp}</li>
                <li><strong>Respiratory Rate:</strong> {report.vitals?.respiratoryRate}</li>
              </ul>
              <p><strong>Nurse Notes:</strong> {report.nurseNotes}</p>
              <p><strong>Treatments:</strong> {report.treatmentsAdministeredText}</p>
              <p><strong>Medicines:</strong> {report.medicineConsumptionText}</p>
            </div>
          ))
        )
      ) : (
        patientsWithReports.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No admitted patients with reports found.</p>
        ) : (
          patientsWithReports.map(({ patient, admissions }) => (
            <div key={patient._id} style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ borderBottom: '2px solid #007BFF', paddingBottom: '6px', marginBottom: '1.5rem' }}>
                👤 {patient.fullName}
              </h3>
              {admissions.map((adm, index) => (
                <div key={adm._id} style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#28a745', marginBottom: '0.5rem' }}>
                    Admission  — Ward: {adm.wardId?.name}, Bed: {adm.bedNumber}
                  </h4>
                  {adm.reports.length === 0 ? (
                    <p style={{ color: '#999' }}>No reports yet for this admission.</p>
                  ) : (
                    adm.reports.map((report, rIndex) => (
                      <div
                        key={report._id}
                        style={{
                          border: '1px solid #ddd',
                          padding: '1.2rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          backgroundColor: '#f9f9f9',
                        }}
                      >
                        <p style={{ marginBottom: '0.5rem' }}>
                          <strong>Report {adm.reports.length - rIndex}</strong> — {new Date(report.reportDateTime).toLocaleString()}
                        </p>
                        <p><strong>Recorded By:</strong> {report.recordedByUserId?.name} ({report.recordedByUserId?.role})</p>
                        <ul style={{ paddingLeft: '1.2rem' }}>
                          <li><strong>Temperature:</strong> {report.vitals?.temperature}</li>
                          <li><strong>Pulse:</strong> {report.vitals?.pulse}</li>
                          <li><strong>BP:</strong> {report.vitals?.bp}</li>
                          <li><strong>Respiratory Rate:</strong> {report.vitals?.respiratoryRate}</li>
                        </ul>
                        <p><strong>Nurse Notes:</strong> {report.nurseNotes}</p>
                        <p><strong>Treatments:</strong> {report.treatmentsAdministeredText}</p>
                        <p><strong>Medicines:</strong> {report.medicineConsumptionText}</p>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          ))
        )
      )}
    </div>
  );
};

export default ViewDailyReports;
