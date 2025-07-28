import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OPDReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [centralData, setCentralData] = useState([]);
  const [departmentWiseData, setDepartmentWiseData] = useState({});
  const [newVsOldData, setNewVsOldData] = useState(null);
const [doctorWiseData, setDoctorWiseData] = useState([]);

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
    if (!startDate || !endDate) return alert('Please select start and end dates');

    const params = { startDate, endDate };
    if (departmentId) params.departmentId = departmentId;

    try {
      // Fetch Central OPD
      const centralRes = await axios.get('http://localhost:8000/api/reports/opd-register', {
        params,
        headers,
      });
      setCentralData(centralRes.data.consultations || []);

      // Fetch Department-wise OPD
      const deptWiseRes = await axios.get('http://localhost:8000/api/reports/opd-register/department-wise', {
        params,
        headers,
      });
     

      setDepartmentWiseData(deptWiseRes.data.departmentWiseRegister || {});
// Fetch Doctor-wise OPD
const doctorWiseRes = await axios.get('http://localhost:8000/api/reports/opd-register/doctor-wise', {
  params,
  headers,
});
setDoctorWiseData(doctorWiseRes.data || []);

      // Fetch New vs Old OPD
      const newOldRes = await axios.get('http://localhost:8000/api/reports/opd-register/new-vs-old', {
        params,
        headers,
      });
      setNewVsOldData(newOldRes.data || null);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Error fetching data. Check console.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>OPD Report Dashboard</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
        <label> End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
        <label> Department:
          <select value={departmentId} onChange={e => setDepartmentId(e.target.value)}>
            <option value="">--All--</option>
            {departments.map(dep => (
              <option key={dep._id} value={dep._id}>{dep.name}</option>
            ))}
          </select>
        </label>
        <button onClick={handleFetchReports}>Fetch Reports</button>
      </div>

      {/* Central OPD Table */}
      <h3>1. Central OPD Register</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Department</th>
            <th>Diagnosis</th>
          </tr>
        </thead>
        <tbody>
          {centralData.length === 0 ? (
            <tr><td colSpan="5">No data found.</td></tr>
          ) : (
            centralData.map((c, i) => (
              <tr key={i}>
                <td>{new Date(c.consultationDateTime).toLocaleString()}</td>
                <td>{c.patientId?.fullName || c.patientId?.name || 'N/A'}</td>
                <td>{c.doctorId?.userId?.name || 'N/A'}</td>
                <td>{c.doctorId?.departments?.name || 'N/A'}</td>
                <td>{c.diagnosis || 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Department-wise OPD */}
      <h3>2. Department-wise OPD Register</h3>
      {Object.keys(departmentWiseData).length === 0 ? (
        <p>No department-wise data available.</p>
      ) : (
        Object.keys(departmentWiseData).map((dept, index) => (
          <div key={index}>
            <h4>{dept}</h4>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {departmentWiseData[dept].map((c, i) => (
                  <tr key={i}>
                    <td>{new Date(c.consultationDateTime).toLocaleString()}</td>
                    <td>{c.patientId?.fullName || c.patientId?.name || 'N/A'}</td>
                    <td>{c.doctorId?.userId?.name || 'N/A'}</td>
                    <td>{c.diagnosis || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* New vs Old Patients */}
      <h3>3. New vs Old OPD Patients</h3>
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
      {/* Doctor-wise OPD Register */}
<h3>3. Doctor-wise OPD Register</h3>
{doctorWiseData.length === 0 ? (
  <p>No doctor-wise data available.</p>
) : (
  doctorWiseData.map((entry, index) => (
    <div key={index} style={{ marginBottom: '20px' }}>
      <h4>Dr. {entry.doctor.name} ({entry.doctor.specialty}) – Dept: {entry.doctor.department}</h4>
      <p>Total Consultations: {entry.totalConsultations}</p>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Chief Complaint</th>
            <th>Diagnosis</th>
          </tr>
        </thead>
        <tbody>
          {entry.consultations.map((c, i) => (
            <tr key={i}>
              <td>{new Date(c.consultationDateTime).toLocaleString()}</td>
              <td>{c.patientId?.fullName || 'N/A'}</td>
              <td>{c.chiefComplaint || 'N/A'}</td>
              <td>{c.diagnosis || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))
)}

    </div>
  );
};

export default OPDReportPage;
