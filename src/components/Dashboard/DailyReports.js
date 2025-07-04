import React, { useState } from 'react';
import axios from 'axios';

const DailyReports = ({ ipdAdmissionId, recordedByUserId, token }) => {
  const [vitals, setVitals] = useState({ temperature: '', pulse: '', bp: '', respiratoryRate: '' });
  const [nurseNotes, setNurseNotes] = useState('');
  const [treatments, setTreatments] = useState('');
  const [medicine, setMedicine] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/reports',
        {
          ipdAdmissionId,
          recordedByUserId,
          vitals,
          nurseNotes,
          treatmentsAdministeredText: treatments,
          medicineConsumptionText: medicine
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Report saved successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error saving report');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Daily Progress Report</h2>

      <fieldset>
        <legend>Vitals</legend>
        <label>
          Temperature:
          <input name="temperature" value={vitals.temperature} onChange={handleChange} type="number" step="0.1" />
        </label>
        <label>
          Pulse:
          <input name="pulse" value={vitals.pulse} onChange={handleChange} type="number" />
        </label>
        <label>
          BP:
          <input name="bp" value={vitals.bp} onChange={handleChange} placeholder="e.g. 120/80" />
        </label>
        <label>
          Respiratory Rate:
          <input name="respiratoryRate" value={vitals.respiratoryRate} onChange={handleChange} type="number" />
        </label>
      </fieldset>

      <label>
        Nurse Notes:
        <textarea value={nurseNotes} onChange={(e) => setNurseNotes(e.target.value)} />
      </label>

      <label>
        Treatments Administered:
        <textarea value={treatments} onChange={(e) => setTreatments(e.target.value)} />
      </label>

      <label>
        Medicine Consumption:
        <textarea value={medicine} onChange={(e) => setMedicine(e.target.value)} />
      </label>

      <button type="submit">Save Report</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DailyReports;
