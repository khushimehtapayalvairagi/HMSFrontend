import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ProcedureForm = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [ipdAdmissions, setIpdAdmissions] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    ipdAdmissionId: '',
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
          patientRes, ipdRes, procedureRes, doctorRes, roomRes
        ] = await Promise.all([
          axios.get('http://localhost:8000/api/receptionist/patients', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/ipd/admissions', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/receptionist/procedures', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/receptionist/doctors', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/receptionist/operation-theaters', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setPatients(patientRes.data.patients || []);
        setIpdAdmissions(ipdRes.data.admissions || []);
        setProcedures(procedureRes.data.procedures || []);
        setDoctors(doctorRes.data.doctors || []);
        setRooms(roomRes.data.theaters || []);
      } catch (error) {
        toast.error('Failed to load initial data');
      }
    };

    fetchInitialData();
  }, []);

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
        navigate(`/labour-room/${procedureScheduleId}/${formData.patientId}`);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Scheduling failed');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '10px' }}>
      <h2>Schedule Procedure</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* [All existing fields except Labour Room detail fields] */}
        {/* ... patientId, ipdAdmissionId, procedureType, etc ... */}
        {/* submit button */}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Schedule Procedure
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProcedureForm;
