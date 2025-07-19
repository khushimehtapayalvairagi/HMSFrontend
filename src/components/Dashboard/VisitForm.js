import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const VisitForm = () => {

  const [patientId, setPatientId] = useState('');
  const [visitType, setVisitType] = useState('');
  const [assignedDoctorId, setAssignedDoctorId] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaid, setIsPaid] = useState(false);
const [specialties, setSpecialties] = useState([]);
const [specialtyName, setSpecialtyName] = useState('');
const [dayOfWeek, setDayOfWeek] = useState('');
const [loadingDoctors, setLoadingDoctors] = useState(false);

  const printRef = useRef();

  const [doctors, setDoctors] = useState([]);
  const [referralPartners, setReferralPartners] = useState([]);
 const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token) {
      toast.error("Please log in again");
        return;
      }

      try {
      const [docRes, refRes, specRes] = await Promise.all([
  axios.get('http://localhost:8000/api/receptionist/doctors', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  axios.get('http://localhost:8000/api/receptionist/referral-partners', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  axios.get('http://localhost:8000/api/receptionist/specialties', {
    headers: { Authorization: `Bearer ${token}` },
  }),
]);  console.log({
        docs: docRes.data,
        refs: refRes.data,
        specs: specRes.data,
      });

       setDoctors([]); // initially empty
setReferralPartners(refRes.data.partners || []);
setSpecialties(specRes.data.specialties || []);
      } catch (error) {
        console.error("Error fetching data", error);
        alert("Failed to load doctor or referral data");
      }
    };

    fetchData();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');

    if (!patientId || !visitType || !assignedDoctorId) {
      toast.error("Please fill required fields.");
      return;
    }

    if (visitType === "OPD" && (!amount || isNaN(amount) || Number(amount) <= 0 || !isPaid)) {
       toast.error("Enter valid payment for OPD and ensure payment is marked as paid.");
      return;
    }

    try {
      const payload = {
        patientId,
        visitType,
        assignedDoctorId,
      };

      if (visitType === "OPD") {
        payload.payment = { amount: Number(amount), isPaid };
      }

      if (referredBy) {
        payload.referredBy = referredBy;
      }

      const res = await axios.post("http://localhost:8000/api/receptionist/visits", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

   if (visitType === 'IPD_Admission') {
  navigate('/receptionist-dashboard/IPDAdmissionForm', {
    state: { visit: res.data.visit, patient: res.data.visit.patientDbId }
  });
} else {
  toast.success("Visit created successfully!");
}
localStorage.setItem('currentPatientId', patientId);

      localStorage.setItem('currentPatientId', patientId);
      console.log(res.data);
    } catch (err) {
      console.error("Visit creation error:", err);
      toast.error(err.response?.data?.message || "Failed to create visit");

    }
  };

  const showReferralField = visitType === "IPD_Referral" || visitType === "IPD_Admission";
  const showPaymentField = visitType === "OPD";

  return (
    <div ref={printRef} style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ccc',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Patient Visit</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Patient ID:
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </label>

        <label>
          Visit Type:
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          >
            <option value="">Select Visit Type</option>
            <option value="OPD">OPD</option>
            <option value="IPD_Referral">IPD Referral</option>
            <option value="IPD_Admission">IPD Admission</option>
          </select>
        </label>
<label>
  Specialty:
  <select
    value={specialtyName}
    onChange={(e) => setSpecialtyName(e.target.value)}
    style={{ width: '100%', padding: '0.5rem' }}
    required
  >
    <option value="">Select Specialty</option>
    {specialties.map((s) => (
      <option key={s._id} value={s.name}>
        {s.name}
      </option>
    ))}
  </select>
</label>

<label>
  Day of the Week:
  <select
    value={dayOfWeek}
    onChange={(e) => setDayOfWeek(e.target.value)}
    style={{ width: '100%', padding: '0.5rem' }}
    required
  >
    <option value="">Select Day</option>
    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
      <option key={day} value={day}>{day}</option>
    ))}
  </select>
</label>

<button
  type="button"
  disabled={loadingDoctors}
  onClick={async () => {
    if (!specialtyName || !dayOfWeek) {
      toast.error("Please select  specialty ");
      return;
    }
    try {
      setLoadingDoctors(true);
      const token = localStorage.getItem('jwt');
      const res = await axios.post(
        'http://localhost:8000/api/receptionist/doctors',
        { specialtyName, dayOfWeek },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctors(res.data.doctors || []);
      if (res.data.doctors.length === 0) {
        toast.info("No doctors available for this time.");
      }
    } catch (err) {
      console.error('Doctor availability fetch error:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch available doctors.');
    } finally {
      setLoadingDoctors(false);
    }
  }}
  style={{
    padding: '0.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '1rem'
  }}
>
  {loadingDoctors ? 'Checking...' : 'Check Available Doctors'}
</button>

        <label>
  Assigned Doctor:
  <select
    value={assignedDoctorId}
    onChange={(e) => setAssignedDoctorId(e.target.value)}
    style={{ width: '100%', padding: '0.5rem' }}
    required
  >
    <option value="">Select Assigned Doctor</option>
    {doctors.map((doc) => (
      <option key={doc._id} value={doc._id}>
        {doc.userId?.name} ({doc.doctorType})
      </option>
    ))}
  </select>
</label>


        {showReferralField && (
          <label>
            Referral Partner:
            <select
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
              required
            >
              <option value="">Select Referral Partner</option>
              {referralPartners.map((ref) => (
                <option key={ref._id} value={ref.name}>{ref.name}</option>
              ))}
            </select>
          </label>
        )}

        {showPaymentField && (
          <>
            <label>
              Payment Amount:
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Payment Done
  <input
    type="checkbox"
    checked={isPaid}
    onChange={(e) => setIsPaid(e.target.checked)}
  />
    
</div>


          </>
        )}

        <button type="submit" style={{
          padding: '0.7rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Create Visit
        </button>

      
      </form>
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default VisitForm;
