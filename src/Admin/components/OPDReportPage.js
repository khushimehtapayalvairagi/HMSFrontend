import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OPDReportPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OPDReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [centralData, setCentralData] = useState([]);
  const [departmentWiseData, setDepartmentWiseData] = useState({});
  const [newVsOldData, setNewVsOldData] = useState(null);
  const [doctorWiseData, setDoctorWiseData] = useState([]);
  const [reportType, setReportType] = useState('central'); // NEW
const [hasFetched, setHasFetched] = useState(false);

  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/departments', { headers });
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };
    fetchDepartments();
  }, []);

const handleFetchReports = async () => {
   if (!startDate || !endDate) {
    toast.warning('Please select start and end dates');
    return;
  }

  const params = { startDate, endDate };
  if (departmentId) params.departmentId = departmentId;

  try {
    setHasFetched(false); // Reset flag while fetching

    if (reportType === 'central') {
      const res = await axios.get('http://localhost:8000/api/reports/opd-register', { params, headers });
      setCentralData(res.data.consultations || []);
    }

    if (reportType === 'department') {
      const res = await axios.get('http://localhost:8000/api/reports/opd-register/department-wise', { params, headers });
      setDepartmentWiseData(res.data.departmentWiseRegister || {});
    }

    if (reportType === 'doctor') {
      const res = await axios.get('http://localhost:8000/api/reports/opd-register/doctor-wise', { params, headers });
      setDoctorWiseData(res.data || []);
    }

    if (reportType === 'newold') {
      const res = await axios.get('http://localhost:8000/api/reports/opd-register/new-vs-old', { params, headers });
      setNewVsOldData(res.data || null);
    }

    setHasFetched(true); // Set flag after successful fetch

  } catch (error) {
    console.error('Error fetching reports:', error);
     toast.error('Error fetching data. Check console.');
  }
};



  return (
    
<div className="opd-report-container">

  <h2 style={{
    fontSize: '28px',
    marginBottom: '20px',
    color: '#2c3e50',
    borderBottom: '2px solid #4caf50',
    paddingBottom: '10px'
  }}>📋 OPD Report Dashboard</h2>

  
 <div className="opd-form-grid">
   <label className="opd-form-label">
    Start Date:
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
       className="opd-form-input"
    />
  </label>

   <label className="opd-form-label">
    End Date:
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="opd-form-input"
    />
  </label>

  <label className="opd-form-label">
    Department:
    <select
      value={departmentId}
      onChange={(e) => setDepartmentId(e.target.value)}
       className="opd-form-input"
    >
      <option value="">--All--</option>
      {departments.map((dep) => (
        <option key={dep._id} value={dep._id}>
          {dep.name}
        </option>
      ))}
    </select>
  </label>

    <label className="opd-form-label">
    Report Type:
    <select
      value={reportType}
      onChange={(e) => setReportType(e.target.value)}
      className="opd-form-input"
    >
      <option value="central">Central OPD</option>
      <option value="department">Department-wise</option>
      <option value="doctor">Doctor-wise</option>
      <option value="newold">New vs Old</option>
    </select>
  </label>

   <div className="opd-button-wrapper">
    <button onClick={handleFetchReports} className="opd-fetch-button">
      Fetch Reports
    </button>
  </div>
</div>


      {/* 1. Central OPD */}
      {reportType === 'central' &&hasFetched && (
        <>
          <h3> Central OPD Register</h3>
 <table className="opd-table">
            <thead>
              <tr>
               <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Patient</th>
                <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Doctor</th>
                <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Department</th>
               <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {centralData.length === 0 ? (
                <tr><td colSpan="5">No data found.</td></tr>
              ) : (
                centralData.map((c, i) => (
                  <tr key={i}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(c.consultationDateTime).toLocaleString()}</td>
                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.patientId?.fullName || c.patientId?.name || 'N/A'}</td>
                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.doctorId?.userId?.name || 'N/A'}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.doctorId?.departments?.name || 'N/A'}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.diagnosis || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* 2. Department-wise OPD */}
      {reportType === 'department' &&hasFetched && (
        <>
          <h3>Department-wise OPD Register</h3>
          {Object.keys(departmentWiseData).length === 0 ? (
            <p>No department-wise data available.</p>
          ) : (
            Object.keys(departmentWiseData).map((dept, index) => (
              <div key={index} style={{ marginBottom: '30px' }}>
                <h4>{dept}</h4>
    <table className="opd-table">
                  <thead>
                    <tr>
                      <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Date</th>
                      <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Patient</th>
                      <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Doctor</th>
                       <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Diagnosis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentWiseData[dept].map((c, i) => (
                      <tr key={i}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(c.consultationDateTime).toLocaleString()}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.patientId?.fullName || c.patientId?.name || 'N/A'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.doctorId?.userId?.name || 'N/A'}</td>
                       <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.diagnosis || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </>
      )}

      {/* 3. New vs Old */}
      {reportType === 'newold' && hasFetched &&(
        <>
          <h3> New vs Old OPD Patients</h3>
          {newVsOldData ? (
            <ul>
              <li><strong>Total Consultations:</strong> {newVsOldData.totalConsultations}</li>
              <li><strong>Unique Patients:</strong> {newVsOldData.uniquePatients}</li>
              <li><strong>New Patients:</strong> {newVsOldData.newPatients}</li>
              <li><strong>Old Patients:</strong> {newVsOldData.oldPatients}</li>
            </ul>
          ) : (
            <p>No New vs Old patient data available.</p>
          )}
        </>
      )}

      {/* 4. Doctor-wise */}
      {reportType === 'doctor' && hasFetched &&(
        <>
          <h3> Doctor-wise OPD Register</h3>
          {doctorWiseData.length === 0 ? (
            <p>No doctor-wise data available.</p>
          ) : (
            doctorWiseData.map((entry, index) => (
              <div key={index} style={{ marginBottom: '30px' }}>
                <h4>Dr. {entry.doctor.name} ({entry.doctor.specialty}) – Dept: {entry.doctor.department}</h4>
                <p><strong>Total Consultations:</strong> {entry.totalConsultations}</p>
    <table className="opd-table">
                  <thead>
                    <tr>
                     <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Patient</th>
                    <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>chiefComplaint</th>
                   <th style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>Diagnosis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.consultations.map((c, i) => (
                      <tr key={i}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(c.consultationDateTime).toLocaleString()}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.patientId?.fullName || 'N/A'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.chiefComplaint || 'N/A'}</td>
                       <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.diagnosis || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default OPDReportPage;
