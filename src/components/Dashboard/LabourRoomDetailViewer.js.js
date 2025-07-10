import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LabourRoomDetailViewer = () => {
  const { procedureScheduleId } = useParams();
  const [detail, setDetail] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [labourDetailsList, setLabourDetailsList] = useState([]);
const [patientsMap, setPatientsMap] = useState({});
const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('jwt');

  // Fetch single detail by procedureScheduleId
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/procedures/labour-details/${procedureScheduleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDetail(res.data.detail);

        // Fetch patient name
        try {
          const patientRes = await axios.get(
            `http://localhost:8000/api/receptionist/patients/${res.data.detail.patientId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPatientName(patientRes.data.patient.fullName);
        } catch (err) {
          console.warn("Failed to fetch patient name");
        }
      } catch (err) {
        console.error("Error fetching labour room detail:", err);
        toast.error(err.response?.data?.message || "Failed to fetch labour details");
      }
    };

    if (procedureScheduleId) fetchDetail();
  }, [procedureScheduleId, token]);

  // Fetch all Labour Room Details
 useEffect(() => {
  const fetchLabourRoomDetailsForAll = async () => {
    try {
      const patientRes = await axios.get('http://localhost:8000/api/receptionist/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const patients = patientRes.data.patients;
 const patientMapObj = {};
      patients.forEach(p => {
        patientMapObj[p._id] = p.fullName;
      });
      setPatientsMap(patientMapObj);
      let details = [];

      await Promise.all(
        patients.map(async (p) => {
          try {
            const scheduleRes = await axios.get(`http://localhost:8000/api/procedures/schedules/${p._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const labourProcedures = scheduleRes.data.procedures?.filter(proc => proc.procedureType === 'Labour Room');

            await Promise.all(
              labourProcedures.map(async (lp) => {
                try {
                  const detailRes = await axios.get(`http://localhost:8000/api/procedures/labour-details/${lp._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });

                  if (detailRes.data.detail) {
                    details.push(detailRes.data.detail);
                  }
                } catch (err) {
                  // No detail found, skip
                }
              })
            );
          } catch (err) {
            // Skip patient if schedules fail
            console.warn(`Error fetching schedule for patient ${p._id}`);
          }
        })
      );

      setLabourDetailsList(details);
    } catch (err) {
      console.error('Error fetching Labour Room records:', err);
      toast.error('Failed to load Labour Room records');
    }
  };

  fetchLabourRoomDetailsForAll();
}, [token]);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Single Record */}
      {procedureScheduleId && detail ? (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '1rem', marginBottom: '2rem' }}>
          <h2>Labour Room Detail (Single)</h2>
          <p><strong>Patient:</strong> {patientName || detail.patientId}</p>
          <p><strong>Baby Name:</strong> {detail.babyName || 'N/A'}</p>
          <p><strong>Gender:</strong> {detail.gender}</p>
          <p><strong>Date of Birth:</strong> {new Date(detail.dobBaby).toLocaleDateString()}</p>
          <p><strong>Time of Birth:</strong> {detail.timeOfBirth}</p>
          <p><strong>Weight:</strong> {detail.weight || 'N/A'}</p>
          <p><strong>Delivery Type:</strong> {detail.deliveryType}</p>
          <p><strong>Captured By:</strong> {detail.capturedByUserId?.name} ({detail.capturedByUserId?.email})</p>
        </div>
      ) : procedureScheduleId ? (
        <p>Loading labour room detail...</p>
      ) : null}

      {/* All Records */}
      <div>
        <input
  type="text"
  placeholder="Search by patient name..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  style={{ padding: '8px', marginBottom: '1rem', width: '100%' }}
/>

        <h3>All Labour Room Records</h3>
        {labourDetailsList.length === 0 ? (
          <p>No Labour Room records found.</p>
        ) : (
         labourDetailsList
  .filter((d) => {
    const name = patientsMap[d.patientId?._id || d.patientId] || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  })
  .map((d, i) => (
    <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <p><strong>Patient:</strong> {patientsMap[d.patientId?._id || d.patientId] || d.patientId}</p>
      <p><strong>Baby Name:</strong> {d.babyName || 'N/A'}</p>
      <p><strong>Gender:</strong> {d.gender}</p>
      <p><strong>DOB:</strong> {new Date(d.dobBaby).toLocaleDateString()}</p>
      <p><strong>Time of Birth:</strong> {d.timeOfBirth}</p>
      <p><strong>Weight:</strong> {d.weight || 'N/A'}</p>
      <p><strong>Delivery Type:</strong> {d.deliveryType}</p>
      <p><strong>Captured By:</strong> {d.capturedByUserId?.name} ({d.capturedByUserId?.email})</p>
    </div>
  ))

        )}
      </div>
    </div>
  );
};

export default LabourRoomDetailViewer;
