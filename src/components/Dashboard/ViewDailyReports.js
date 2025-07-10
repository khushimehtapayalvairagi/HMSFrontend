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
    if (ipdAdmissionId) {
      // ✅ Mode 1: Show reports for specific admission
      const fetchSingleAdmissionReports = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/ipd/reports/${ipdAdmissionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSingleAdmissionReports(res.data.reports || []);
        } catch (err) {
          console.error('Error fetching single admission reports:', err);
          toast.error('Failed to load report');
        }
      };

      fetchSingleAdmissionReports();
    } else {
      // ✅ Mode 2: Show reports for all admitted patients
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
          console.error('Error fetching patient reports', err);
          toast.error('Failed to load daily reports');
        }
      };

      fetchAllReports();
    }
  }, [ipdAdmissionId, token]);

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto' }}>
      <ToastContainer />
      <h2>{ipdAdmissionId ? 'Daily Reports for Admission' : 'All Daily Reports for Admitted Patients'}</h2>

      {ipdAdmissionId ? (
        // ✅ Render reports for one admission
        singleAdmissionReports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          singleAdmissionReports.map((report, index) => (
            <div
              key={report._id}
              style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}
            >
              <p><strong>Report #{singleAdmissionReports.length - index}</strong></p>
              <p><strong>Date:</strong> {new Date(report.reportDateTime).toLocaleString()}</p>
              <p><strong>Recorded By:</strong> {report.recordedByUserId?.name} ({report.recordedByUserId?.role})</p>
              <ul>
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
        // ✅ Render all reports grouped by patient and admission
        patientsWithReports.length === 0 ? (
          <p>No admitted patients with reports found.</p>
        ) : (
          patientsWithReports.map(({ patient, admissions }) => (
            <div key={patient._id} style={{ borderBottom: '2px solid #ccc', marginBottom: '2rem' }}>
              <h3>{patient.fullName}</h3>
              {admissions.map((adm, index) => (
                <div key={adm._id} style={{ marginBottom: '1.5rem' }}>
                  <h4>Admission #{index + 1} (Ward: {adm.wardId?.name}, Bed: {adm.bedNumber})</h4>
                  {adm.reports.length === 0 ? (
                    <p>No reports yet for this admission.</p>
                  ) : (
                    adm.reports.map((report, rIndex) => (
                      <div
                        key={report._id}
                        style={{
                          border: '1px solid #ddd',
                          padding: '1rem',
                          borderRadius: '6px',
                          marginBottom: '1rem',
                        }}
                      >
                        <p><strong>Report #{adm.reports.length - rIndex}</strong> - {new Date(report.reportDateTime).toLocaleString()}</p>
                        <p><strong>Recorded By:</strong> {report.recordedByUserId?.name} ({report.recordedByUserId?.role})</p>
                        <ul>
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
