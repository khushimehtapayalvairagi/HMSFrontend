// 👇 Full version of CreateBillForm with clear details for receptionist
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateBillForm = () => {
  const location = useLocation();
  const { patientId: passedPatientId, ipdAdmissionId: passedAdmissionId } = location.state || {};
const [anesthesiaRecords, setAnesthesiaRecords] = useState([]);
const BASE_URL = process.env.REACT_APP_BASE_URL;

const [dailyReports, setDailyReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [items, setItems] = useState([{ item_type: '', item_source_id: '', description: '', quantity: 1, unit_price: '' }]);

  const [visitId, setVisitId] = useState('');
  const [patientId, setPatientId] = useState(passedPatientId || '');
  const [ipdAdmissionId, setIpdAdmissionId] = useState(passedAdmissionId || '');
  const [userId, setUserId] = useState('');
  useEffect(() => {
  const fetchAnesthesiaRecords = async () => {
    if (!patientId) return;
    const token = localStorage.getItem('jwt');

    try {
      // Step 1: Get all procedures for this patient
      const procRes = await axios.get(`${BASE_URL}/api/procedures/schedules/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const procedures = procRes.data.procedures || [];

      // Step 2: For each, fetch anesthesia record
      const records = await Promise.all(
        procedures
          .filter(p => p.status === 'Scheduled' || p.status === 'Completed') // Optional filter
          .map(p =>
            axios
              .get(`${BASE_URL}/api/procedures/anesthesia-records/${p._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then(res => ({
                ...res.data.record,
                procedureName: p.procedureId?.name || '',
              }))
              .catch(() => null)
          )
      );

      setAnesthesiaRecords(records.filter(Boolean));
    } catch (error) {
      toast.error('Failed to load anesthesia records');
    }
  };

  fetchAnesthesiaRecords();
}, [patientId]);

useEffect(() => {
  if (!ipdAdmissionId) return;
  const token = localStorage.getItem('jwt');
console.log("Calling reports API for", ipdAdmissionId);

  axios.get(`${BASE_URL}/api/ipd/reports/${ipdAdmissionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setDailyReports(res.data.reports || []))
  .catch(() => toast.error('Failed to load daily reports'));
}, [ipdAdmissionId]);
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user'));
    setUserId(user?.id);

    axios.get(`${BASE_URL}/api/billing/manual-charge-items`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setManualItems(res.data.items))
      .catch(() => toast.error('Failed to load manual charge items'));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!patientId) return;

    axios.get(`${BASE_URL}/api/procedures/schedules/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const filtered = (res.data.procedures || []).filter(p => p.status === 'Completed' && !p.isBilled);
      setSchedules(filtered);
      
    }).catch(() => toast.error('Failed to load procedures'));
  }, [patientId]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    const fetchAdmittedPatients = async () => {
      try {
        const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const allPatients = patientRes.data.patients;
        const admittedPatients = [];

        for (const patient of allPatients) {
          const res = await axios.get(`${BASE_URL}/api/ipd/admissions/${patient._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const admissions = res.data.admissions || [];
          if (admissions.some(adm => adm.status === 'Admitted')) {
            admittedPatients.push(patient);
          }
        }

        setPatients(admittedPatients);
      } catch (error) {
        toast.error('Failed to load admitted patients');
      }
    };

    fetchAdmittedPatients();
  }, []);

  useEffect(() => {
    if (!patientId) return;
    const token = localStorage.getItem('jwt');
    axios.get(`${BASE_URL}/api/ipd/admissions/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const admitted = res.data.admissions.filter(a => a.status === 'Admitted');
      setAdmissions(admitted);
    }).catch(() => toast.error('Failed to load admissions'));
  }, [patientId]);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'item_source_id') {
      const type = updated[index].item_type;

      if (type === 'Manual') {
        const selected = manualItems.find(m => m._id === value);
        updated[index].unit_price = selected?.defaultPrice || '';
        updated[index].description = selected?.itemName || '';
      }

      if (type === 'ProcedureSchedule') {
        const selected = schedules.find(s => s._id === value);
        updated[index].unit_price = selected?.procedureId?.cost || '';
        updated[index].description = `${selected?.procedureType} - ${selected?.procedureId?.name}` || '';
      }
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { item_type: '', item_source_id: '', description: '', quantity: 1, unit_price: '' }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("🔎 Validation before creating bill:");
  console.log("patientId:", patientId || "❌ MISSING");
  console.log("visitId:", visitId || "❌ MISSING");
  console.log("ipdAdmissionId:", ipdAdmissionId || "❌ MISSING");
  console.log("userId:", userId || "❌ MISSING");

    if (!patientId || !ipdAdmissionId || !userId) {
      toast.error('Required patient/admission/visit/user info missing');
      return;
    }

    const cleanedItems = items.map(it => {
      const copy = { ...it };
      if (!copy.item_source_id) delete copy.item_source_id;
      copy.quantity = Number(copy.quantity);
      if (copy.unit_price) copy.unit_price = Number(copy.unit_price);
      return copy;
    });

    const payload = {
      patient_id_ref: patientId,
      // visit_id_ref: visitId,
      ipd_admission_id_ref: ipdAdmissionId,
      generated_by_user_id: userId,
      items: cleanedItems
    };

   try {
  const token = localStorage.getItem('jwt');
  await axios.post(`${BASE_URL}/api/billing/bills`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  toast.success('Bill created successfully!');
} catch (err) {
 const errorMessage = err.response?.data?.message;
if (errorMessage === 'This procedure has already been billed.') {
  toast.error('⚠️ This procedure has already been billed.');
} else if (errorMessage === 'No daily report record found.') {
  toast.error('📋 No daily report record found.');
} else {
  toast.error(errorMessage || 'Error creating bill');
}
}

  };

 return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#fafafa', borderRadius: '10px', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Patient Bill</h2>
      <form onSubmit={handleSubmit}>
        {/* Patient Select */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Select Patient</label>
          <select value={patientId} onChange={e => setPatientId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">-- Select Patient --</option>
            {patients.map(p => (
            <option value={p._id}>
  {p.patientId} – {p.fullName}
</option>

            ))}
          </select>
        </div>

        {/* Admission Select */}
        {admissions.length > 0 && (
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Select Admission</label>
            <select value={ipdAdmissionId} onChange={e => {
              setIpdAdmissionId(e.target.value);
              const adm = admissions.find(a => a._id === e.target.value);
              setVisitId(adm?.visitId?._id || '');
            }} required style={{ width: '100%', padding: '8px' }}>
              <option value="">-- Select Admission --</option>
              {admissions.map(a => (
                <option key={a._id} value={a._id}>
                  {a.wardId?.name} (Bed {a.bedNumber})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Doctor + Room */}
        {ipdAdmissionId && (
          <div style={{ background: '#f2f2f2', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem', lineHeight: '1.6' }}>
            {(() => {
              const adm = admissions.find(a => a._id === ipdAdmissionId);
              return adm && (
                <>
                  <p><strong>Doctor:</strong> {adm.admittingDoctorId?.userId?.name || 'N/A'
}</p>
                  <p><strong>Room Category:</strong> {adm.roomCategoryId?.name || 'N/A'}</p>
                </>
              );
            })()}
          </div>
        )}

        {/* Daily Reports */}
        {dailyReports.length > 0 && (
          <div style={{ background: '#e0f7fa', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '10px' }}>Latest Progress Report</h4>
            <p><strong>Date:</strong> {new Date(dailyReports[0].reportDateTime).toLocaleString()}</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Temperature: {dailyReports[0].vitals?.temperature || 'N/A'}</li>
              <li>Pulse: {dailyReports[0].vitals?.pulse || 'N/A'}</li>
              <li>BP: {dailyReports[0].vitals?.bp || 'N/A'}</li>
              <li>Respiratory Rate: {dailyReports[0].vitals?.respiratoryRate || 'N/A'}</li>
            </ul>
          </div>
        )}

        {ipdAdmissionId && dailyReports.length === 0 && (
          <div style={{ background: '#fff3cd', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
            No progress reports found for this admission.
          </div>
        )}

        {/* Anesthesia Records */}
        {anesthesiaRecords.length > 0 && (
          <div style={{ background: '#e8f5e9', padding: '10px 15px', borderRadius: '6px', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '10px' }}>Anesthesia Records</h4>
            {anesthesiaRecords.map((rec, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <p><strong>Procedure:</strong> {rec.procedureName || 'N/A'}</p>
                <p><strong>Anesthetist:</strong> {rec.anestheticId?.userId?.name || 'N/A'}</p>
                <p><strong>Anesthesia:</strong> {rec.anesthesiaName} ({rec.anesthesiaType})</p>
                <p><strong>Medicines Used:</strong> {rec.medicinesUsedText || 'N/A'}</p>
                <hr />
              </div>
            ))}
          </div>
        )}

        {/* Bill Items */}
        <h3 style={{ marginTop: '2rem' }}>Billing Items</h3>
        {items.map((item, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px', background: '#fff' }}>
            <div style={{ marginBottom: '0.8rem' }}>
              <label>Type</label>
              <select value={item.item_type} onChange={e => handleChange(index, 'item_type', e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                <option value="">Select Type</option>
                <option value="ProcedureSchedule">Procedure Schedule</option>
                <option value="Manual">Manual Charge</option>
                <option value="Open">Open Charge</option>
              </select>
            </div>

            {(item.item_type === 'Manual') && (
              <div style={{ marginBottom: '0.8rem' }}>
                <label>Select Item</label>
                <select value={item.item_source_id} onChange={e => handleChange(index, 'item_source_id', e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                  <option value="">Select Manual Item</option>
                  {manualItems.map(mi => (
                    <option key={mi._id} value={mi._id}>{mi.itemName} – ₹{mi.defaultPrice}</option>
                  ))}
                </select>
              </div>
            )}

            {(item.item_type === 'ProcedureSchedule') && (
              <div style={{ marginBottom: '0.8rem' }}>
                <label>Select Procedure</label>
                <select value={item.item_source_id} onChange={e => handleChange(index, 'item_source_id', e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                  <option value="">Select Procedure</option>
                  {schedules.map(s => (
                    <option key={s._id} value={s._id}>
                        {s.procedureId?.name} - Rs. {s.procedureId?.cost} ({s.surgeonId?.userId?.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {item.item_type === 'Open' && (
              <>
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={e => handleChange(index, 'description', e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={e => handleChange(index, 'unit_price', e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
                />
              </>
            )}

            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={e => handleChange(index, 'quantity', e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '0.8rem' }}
            />
            <button type="button" onClick={() => removeItem(index)} style={{ padding: '6px 12px', background: '#ff6961', color: '#fff', border: 'none', borderRadius: '4px' }}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addItem} style={{ padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', marginRight: '10px' }}>
          + Add Item
        </button>

        <button type="submit" style={{ padding: '10px 15px', background: 'green', color: '#fff', border: 'none', borderRadius: '6px' }}>
          Create Bill
        </button>
      </form>
       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateBillForm;
