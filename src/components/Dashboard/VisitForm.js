// VisitForm.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const VisitForm = () => {
  const [resData, setResData] = useState(null);
  const [slipData, setSlipData] = useState(null);
  const [doctorName, setDoctorName] = useState('');

  const [patientId, setPatientId] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);

  const [visitType, setVisitType] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [assignedDoctorId, setAssignedDoctorId] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]); // used for assigned doctor list
  const [referralPartners, setReferralPartners] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const slipRef = useRef();

  const handlePrintSlip = useReactToPrint({
    content: () => slipRef.current,
  });

  // ✅ NEW: Fetch all doctors (with specialty names)
 useEffect(() => {
  if (!specialtyId) {
    setDoctors([]);
    return;
  }

  const fetchDoctorsBySpecialty = async () => {
    setLoadingDoctors(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { specialtyId }, // send specialtyId as query param
      });
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      toast.error("Could not load doctors for selected specialty");
    } finally {
      setLoadingDoctors(false);
    }
  };

  fetchDoctorsBySpecialty();
}, [specialtyId, token, BASE_URL]);


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/receptionist/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error('Failed to fetch departments', err);
        toast.error('Failed to load departments');
      }
    };
    fetchDepartments();
  }, [BASE_URL, token]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [specRes, refRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/receptionist/specialties`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/receptionist/referral-partners`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setSpecialties(specRes.data.specialties || []);
        setReferralPartners(refRes.data.partners || []);
      } catch (err) {
        console.error('Initial fetch error:', err);
        toast.error('Failed to load specialties/referral partners');
      }
    };
    fetchInitial();
  }, [BASE_URL, token]);

  useEffect(() => {
    const doctor = doctors.find(d => d._id === assignedDoctorId);
    setDoctorName(doctor?.userId?.name || '');
  }, [assignedDoctorId, doctors]);

  useEffect(() => {
    if (!patientId) {
      setPatientDetails(null);
      return;
    }
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/receptionist/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched patient details:', res.data.patient);
        setPatientDetails(res.data.patient || null);
      } catch (err) {
        console.warn('Patient lookup failed for', patientId, err?.response?.data || err.message);
        setPatientDetails(null);
      }
    };
    fetchPatient();
  }, [patientId, BASE_URL, token]);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = [];
    if (!patientId) missing.push('patientId');
    if (!visitType) missing.push('visitType');
    if (!assignedDoctorId) missing.push('assignedDoctorId');
    if (visitType === 'OPD') {
      if (!amount || isNaN(amount) || Number(amount) <= 0) missing.push('valid amount');
      if (!isPaid) missing.push('isPaid (must be true for OPD)');
    }

    if (missing.length > 0) {
      console.log('Create visit blocked — missing:', missing);
      toast.error('Please fill required fields: ' + missing.join(', '));
      return;
    }

    try {
      const payload = {
        patientId,
        patientDbId: patientDetails?._id,
        visitType,
        assignedDoctorId,
      };

      if (visitType === 'OPD') {
        payload.payment = { amount: Number(amount), isPaid };
      }

      if (referredBy) payload.referredBy = referredBy;

      console.log('Creating visit payload:', payload);
      const res = await axios.post(`${BASE_URL}/api/receptionist/visits`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Create visit response:', res.data);
      const visitData = res.data.visit;
      setResData(visitData);
      toast.success(`${visitType} visit created successfully!`);

      localStorage.setItem('currentVisitId', visitData?._id || '');
      localStorage.setItem('currentPatientId', patientId);
    } catch (err) {
      console.error('Visit creation error:', err?.response?.data || err.message);
      toast.error(err.response?.data?.message || `Failed to create ${visitType} visit`);
    }
  };

  const handlePrintCasePaper = () => {
    if (!resData) return toast.error('No visit data to print');
    const visitDate = new Date(resData.visitDate || resData.createdAt || Date.now());
    const name = patientDetails?.fullName || resData.patientName || '';
    const html = `
      <html>
      <head><title>OPD Case Paper</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <div style="text-align:center;">
          <h3>Anjuman-I-Islam's</h3>
          <h4>Dr. M.I. Jamkhanawala Tibbia Unani Medical College & Hospital</h4>
          <h4>Haji Abdul Razzak Kalsekar Tibbia Hospital</h4>
          <h6>Anjuman-I-Islam Complex, Yari Road, Versova, Andheri(W), Mumbai 400 061.</h6>
        </div>
        <hr/>
        <table style="width:100%; font-size:14px;">
          <tr><td><b>Patient Name:</b> ${name}</td><td><b>Patient ID:</b> ${resData.patientId || ''}</td></tr>
          <tr><td><b>Age/Gender:</b> ${patientDetails?.age || ''} / ${patientDetails?.gender || ''}</td><td><b>Date:</b> ${visitDate.toLocaleString()}</td></tr>
          <tr><td><b>Doctor:</b> ${doctorName || ''}</td><td><b>Department:</b> ${departments.find(d => d._id === departmentId)?.name || '-'}</td></tr>
          <tr><td colspan="2"><b>Address:</b> ${patientDetails?.address || ''}</td></tr>
        </table>
      </body>
      </html>
    `;
    const w = window.open('', '_blank', 'width=800,height=700');
    w.document.write(html);
    w.document.close();
    w.print();
    w.close();
  };

  const handlePrintBill = () => {
    if (!resData) return toast.error('No visit data to print bill');
    const visitDate = new Date(resData.visitDate || resData.createdAt || Date.now());
    const name = patientDetails?.fullName || resData.patientName || '';
    const amountVal = (resData.payment?.amount ?? amount) || 0;
    const isPaidVal = (resData.payment?.isPaid ?? isPaid) ? true : false;

    const html = `
      <html>
      <head><title>OPD Bill</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <div style="text-align:center;">
          <h3>Anjuman-I-Islam's</h3>
          <h4>Dr. M.I. Jamkhanawala Tibbia Unani Medical College & Hospital</h4>
          <h4>Haji Abdul Razzak Kalsekar Tibbia Hospital</h4>
          <h6>Anjuman-I-Islam Complex, Yari Road, Versova, Andheri(W), Mumbai 400 061.</h6>
        </div>
        <hr/>
        <table style="width:100%; font-size:14px;">
          <tr><td><b>Patient:</b> ${name}</td><td><b>Receipt No:</b> ${resData.receiptNumber || '-'}</td></tr>
          <tr><td><b> Done by Doctor:</b> ${doctorName || ''}</td><td><b>Date:</b> ${visitDate.toLocaleDateString()}</td></tr>
          <tr><td><b>Visit Type:</b> ${resData.visitType || ''}</td><td><b>Specialty:</b> ${(specialties.find(s => s._id === specialtyId)?.name) || '-'}</td></tr>
        </table>
        <hr/>
        <h3 style="text-align:right;">Total: ₹${amountVal}</h3>
        <p><b>Paid:</b> ${isPaidVal ? amountVal : 0} &nbsp;&nbsp; <b>Balance:</b> ${isPaidVal ? 0 : amountVal}</p>
      </body>
      </html>
    `;
    const w = window.open('', '_blank', 'width=800,height=700');
    w.document.write(html);
    w.document.close();
    w.print();
    w.close();
  };

  const showReferralField = visitType === 'IPD_Referral' || visitType === 'IPD_Admission';
  const showPaymentField = visitType === 'OPD';

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Create Patient Visit</h2>
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

        {patientDetails && (
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 6, background: '#fff' }}>
            <p><strong>Name:</strong> {patientDetails.fullName}</p>
            <p><strong>Age:</strong> {patientDetails.age}</p>
            <p><strong>Gender:</strong> {patientDetails.gender}</p>
            <p><strong>Contact:</strong> {patientDetails.contactNumber || '-'}</p>
            <p><strong>Address:</strong> {patientDetails.address || '-'}</p>
          </div>
        )}

        <label>
          Visit Type:
          <select value={visitType} onChange={(e) => setVisitType(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} required>
            <option value="">Select Visit Type</option>
            <option value="OPD">OPD</option>
            <option value="IPD_Referral">IPD Referral</option>
            <option value="IPD_Admission">IPD Admission</option>
          </select>
        </label>

        <label>
          Specialty:
          <select
            value={specialtyId}
            onChange={(e) => setSpecialtyId(e.target.value)}
            required
          >
            <option value="">Select Specialty</option>
            {specialties.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Assigned Doctor:
        <select
  value={assignedDoctorId}
  onChange={(e) => setAssignedDoctorId(e.target.value)}
  style={{ width: '100%', padding: '0.5rem' }}
  required
>
  <option value="">{loadingDoctors ? 'Loading...' : 'Select Assigned Doctor'}</option>
  {doctors.map((doc) => (
    <option key={doc._id} value={doc._id}>
      {doc.userId?.name} — {doc.specialty?.name || "No Specialty"}
    </option>
  ))}
</select>

        </label>

        {showReferralField && (
          <label>
            Referral Partner:
            <select value={referredBy} onChange={(e) => setReferredBy(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} required>
              <option value="">Select Referral Partner</option>
              {referralPartners.map(ref => <option key={ref._id} value={ref._id}>{ref.name}</option>)}
            </select>
          </label>
        )}

        {showPaymentField && (
          <>
            <label>
              Payment Amount:
              <input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Payment Done
              <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
            </div>
          </>
        )}

        <button type="submit" style={{ padding: '0.7rem', background: '#007bff', color: '#fff', borderRadius: 6 }}>
          Create Visit
        </button>
      </form>

      {resData && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handlePrintCasePaper} style={{ padding: '0.5rem 1rem', background: '#ffc107', border: 'none' }}>
            📝 Print OPD Case Paper
          </button>
          <button onClick={handlePrintBill} style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', border: 'none' }}>
            🧾 Print OPD Bill
          </button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default VisitForm;
