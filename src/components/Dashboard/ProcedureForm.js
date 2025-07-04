import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const ProcedureForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
   const { patientId: initialPatientId, ipdAdmissionId: initialAdmissionId } = location.state || {};
  const [patients, setPatients] = useState([]);
  const [ipdAdmissions, setIpdAdmissions] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [labourRooms, setLabourRooms] = useState([]);
  const [formData, setFormData] = useState({
     patientId: initialPatientId || '',
    ipdAdmissionId: initialAdmissionId || '',
    procedureType: '',
    roomId: '',
    scheduledDateTime: '',
    procedureId: '',
    surgeonId: '',
    assistantIds: [],
    anestheticId: ''
  });

 useEffect(() => {
  const fetchInitialData = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const [
        patientRes,
        
        procedureRes,
        doctorRes,
        roomRes,
        lrRes
      ] = await Promise.all([
        axios.get('http://localhost:8000/api/receptionist/patients', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/receptionist/procedures', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/receptionist/doctors', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/receptionist/operation-theaters', { headers: { Authorization: `Bearer ${token}` } }),
     axios.get('http://localhost:8000/api/receptionist/labour-rooms', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      
      setPatients(patientRes.data.patients);
      // setIpdAdmissions(ipdRes.data.admissions);
      setProcedures(procedureRes.data.procedures);
      setDoctors(doctorRes.data.doctors);
      setRooms(roomRes.data.theaters);
      setLabourRooms(lrRes.data.labourRooms);
    } catch (error) {
      console.error("Error loading initial dropdown data:", error.response?.data || error.message);
      toast.error('Failed to load initial form data');
    }
  };

  fetchInitialData();
}, []);
 useEffect(() => {
    if (!formData.patientId) return;
    const token = localStorage.getItem('jwt');
    axios
      .get(`http://localhost:8000/api/ipd/admissions/${formData.patientId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setIpdAdmissions(res.data.admissions))
      .catch(() => toast.error('Failed to load admissions'));
  }, [formData.patientId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = e => {
    const selectedOptions = Array.from(e.target.selectedOptions, opt => opt.value);
    setFormData(prev => ({ ...prev, assistantIds: selectedOptions }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    try {
      const res = await axios.post(
        'http://localhost:8000/api/procedures/schedules',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Procedure scheduled successfully!');
      const procedureScheduleId = res.data.procedure._id;

      if (formData.procedureType === 'Labour Room') {
        // redirect to LabourRoomForm with procedureScheduleId and patientId
       navigate(`/receptionist-dashboard/LabourRoom/${procedureScheduleId}/${formData.patientId}`);

      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Scheduling failed');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '10px' }}>
      <h2>Schedule Procedure</h2>
      <form onSubmit={handleSubmit} >
  <select name="patientId" value={formData.patientId} onChange={handleChange}>
    <option value="">Select Patient</option>
{patients?.map(p => (
  <option key={p._id} value={p._id}>{p.fullName}</option>
))}
  </select>

  {formData.patientId && (
    <select name="ipdAdmissionId" value={formData.ipdAdmissionId} onChange={handleChange}>
      <option value="">Select Admission</option>
      {ipdAdmissions?.map(a => (
        <option key={a._id} value={a._id}>
          {a._id} — {a.wardId.name}
        </option>
      ))}
    </select>
  )}

  <select name="procedureType" value={formData.procedureType} onChange={handleChange}>
    <option value="">Select Type</option>
    <option value="OT">OT</option>
    <option value="Labour Room">Labour Room</option>
  </select>
{formData.procedureType === 'OT' && (
  <select name="roomId" value={formData.roomId} onChange={handleChange}>
    <option value="">Select Room</option>
    {rooms?.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
  </select>
)}
{formData.procedureType === 'Labour Room' && (
  <select name="roomId" value={formData.roomId} onChange={handleChange} required>
    <option value="">Select Labour Room</option>
    {labourRooms.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
  </select>
)}

  <select name="procedureId" value={formData.procedureId} onChange={handleChange}>
    <option value="">Select Procedure</option>
    {procedures?.map(pr => <option key={pr._id} value={pr._id}>{pr.name}</option>)}
  </select>

  <select name="surgeonId" value={formData.surgeonId} onChange={handleChange}>
    <option value="">Select Surgeon</option>
    {doctors?.map(d => <option key={d._id} value={d._id}>{d.userId?.name}</option>)}
  </select>

  {/* <select multiple name="assistantIds" value={formData.assistantIds} onChange={handleMultiSelectChange}>
    {doctors?.map(d => <option key={d._id} value={d._id}>{d.userId.name}</option>)}
  </select> */}

  <select name="anestheticId" value={formData.anestheticId} onChange={handleChange}>
    <option value="">Select Anesthetist</option>
    {doctors?.map(d => <option key={d._id} value={d._id}>{d.userId?.name}</option>)}
  </select>

  <input
    type="datetime-local"
    name="scheduledDateTime"
    value={formData.scheduledDateTime}
    onChange={handleChange}
    required
  />

  <button type="submit">Schedule Procedure</button>
</form>

      <ToastContainer />
    </div>
  );
};

export default ProcedureForm;
