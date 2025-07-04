import React, { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LabourRoomDetails = () => {
  const { procedureScheduleId, patientId } = useParams();
  const [form, setForm] = useState({
   patientId:"",
   procedureScheduleId:"",
    babyName: '',
    gender: '',
    dobBaby: '',
    timeOfBirth: '',
    weight: '',
    deliveryType: ''
  });
  useEffect(() => {
  console.log({ procedureScheduleId, patientId });
}, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
//  const handleView = () => {
//     navigate(`//receptionist-dashboard/ViewLabourRoom/${procedureScheduleId}`);
//   };
  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user'));
    const payload = {
      ...form,
      procedureScheduleId,
      patientId,
      capturedByUserId: user.id
    }

    try {
      const res = await axios.post('http://localhost:8000/api/procedures/labour-details', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Labour room details saved!');
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save labour details');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '10px' }}>
      <h2>Labour Room Details</h2>
       <p><strong>Patient ID:</strong> {patientId}</p>
    <p><strong>Schedule ID:</strong> {procedureScheduleId}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="babyName" value={form.babyName} onChange={handleChange} placeholder="Baby Name" />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" name="dobBaby" value={form.dobBaby} onChange={handleChange} required />
        <input type="time" name="timeOfBirth" value={form.timeOfBirth} onChange={handleChange} required />
        <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (e.g. 2.8 kg)" />
        <select name="deliveryType" value={form.deliveryType} onChange={handleChange} required>
          <option value="">Delivery Type</option>
          <option value="Normal">Normal</option>
          <option value="C-section">C-section</option>
        </select>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Save Labour Details
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LabourRoomDetails;
