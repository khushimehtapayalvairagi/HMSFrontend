import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LabourRoom= () => {
  const [labourProcedures, setLabourProcedures] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
 const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    babyName: '',
    gender: '',
    dobBaby: '',
    timeOfBirth: '',
    weight: '',
    deliveryType: ''
  });

  const token = localStorage.getItem('jwt');

  // Fetch Labour Room procedures
useEffect(() => {
  const fetchAllLabourProcedures = async () => {
    const token = localStorage.getItem('jwt');
    try {
      // Step 1: Fetch all patients (or a filtered list, if needed)
      const patientRes = await axios.get('http://localhost:8000/api/receptionist/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const patients = patientRes.data.patients;
      setPatients(patients);
 console.log("Fetched patients:", patients)
      let allLabour = [];

      // Step 2: For each patient, get their procedure schedules
      await Promise.all(
        patients.map(async (p) => {
          try {
            const res = await axios.get(
              `http://localhost:8000/api/procedures/schedules/${p._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
               console.log(`Schedules for patient ${p._id}:`, res.data.schedules);
          const labourOnly = res.data.procedures?.filter(proc => proc.procedureType === 'Labour Room');

          console.log(`Labour Room procedures for ${p._id}:`, labourOnly);
            if (labourOnly.length > 0) {
              allLabour = allLabour.concat(labourOnly);
            }
          } catch (err) {
            // ignore individual patient errors
             console.warn(`Error for patient ${p._id}:`, err.message);
          }
        })
      );
 console.log("Final Labour Room procedures list:", allLabour);
      setLabourProcedures(allLabour);
    } catch (err) {
      toast.error('Failed to fetch Labour Room procedures');
    }
  };

  fetchAllLabourProcedures();
}, []);


  // Load existing Labour Room detail if selected
  useEffect(() => {
    const fetchLabourDetail = async () => {
      if (!selectedProcedure) return;
      try {
        const res = await axios.get(`http://localhost:8000/api/procedures/labour-details/${selectedProcedure._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.detail) {
          setForm(res.data.detail);
        } else {
          setForm({
            babyName: '',
            gender: '',
            dobBaby: '',
            timeOfBirth: '',
            weight: '',
            deliveryType: ''
          });
        }
      } catch (err) {
        // No existing detail found — start fresh
        setForm({
          babyName: '',
          gender: '',
          dobBaby: '',
          timeOfBirth: '',
          weight: '',
          deliveryType: ''
        });
      }
    };

    fetchLabourDetail();
  }, [selectedProcedure]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async e => {
  e.preventDefault();
  if (!selectedProcedure) return;
  const user = JSON.parse(localStorage.getItem('user'));
  const payload = {
    ...form,
    procedureScheduleId: selectedProcedure._id,
    patientId: selectedProcedure.patientId,
    capturedByUserId: user.id
  };

  try {
    await axios.post('http://localhost:8000/api/procedures/labour-details', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Labour room details saved!');

    // ✅ REMOVE the saved procedure from the list
    setLabourProcedures(prev =>
      prev.filter(proc => proc._id !== selectedProcedure._id)
    );

    setSelectedProcedure(null); // Optional: close the form
    setForm({
      babyName: '',
      gender: '',
      dobBaby: '',
      timeOfBirth: '',
      weight: '',
      deliveryType: ''
    });
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save labour details');
  }
};


  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '2rem' }}>
      <h2>Labour Room Scheduled Patients</h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          {labourProcedures.length === 0 ? (
            <p>No patients scheduled for Labour Room.</p>
          ) : (
            labourProcedures.map(p => (
              <div key={p._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
<p><strong>Patient:</strong> {patients.find(pt => pt._id === p.patientId)?.fullName || p.patientId}</p>
                <p><strong>Scheduled Date:</strong> {new Date(p.scheduledDateTime).toLocaleString()}</p>
                <button onClick={() => setSelectedProcedure(p)}>Update</button>
              </div>
            ))
          )}
        </div>

        {selectedProcedure && (
         <div style={{
  flex: 1,
  background: '#f5f5f5',
  maxWidth: '600px',
  maxHeight:"550px",
  padding: '0.75rem',
  borderRadius: '6px',
  fontSize: '14px',
  lineHeight: '1.2'
}}>

            <h3>Labour Room Details</h3>
         <p><strong>Patient:</strong> {patients.find(pt => pt._id === selectedProcedure.patientId)?.fullName}</p>


          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

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

              <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white' }}>
                Save Labour Details
              </button>
            </form>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default LabourRoom;
