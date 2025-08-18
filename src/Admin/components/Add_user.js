import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddUser.css'; // 👈 add this
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddUser = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    doctorType: '',
    specialty: '',
    medicalLicenseNumber: '',
    schedule: [],
    contactNumber: '',
    designation: '',
    department: ''
  });

  const [message, setMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [departments, setDepartments] = useState([]);
const [errors, setErrors] = useState({});
const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log('BASE_URL:', BASE_URL);


  useEffect(() => {
    const fetchOptions = async () => {
      const token = localStorage.getItem('jwt');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      };

      try {
      const [spec, dept] = await Promise.all([
  axios.get(`${BASE_URL}/api/admin/specialties`, config),
  axios.get(`${BASE_URL}/api/admin/departments`, config)
]);

        const specialtiesArray = Array.isArray(spec.data)
          ? spec.data
          : spec.data.specialties || [];

        setSpecialties(specialtiesArray);
        setDepartments(Array.isArray(dept.data) ? dept.data : dept.data.departments || []);
      } catch (err) {
        console.error('Error fetching options:', err);
      }
    };

    fetchOptions();
  }, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
  setMessage('');

  if (name === 'name') {
    const startsWithLetter = /^[A-Za-z]/.test(value);
    const containsInvalidChar = /[^A-Za-z\s]/.test(value);
    if (!startsWithLetter) {
      setErrors((prev) => ({ ...prev, name: 'Name must start with a letter.' }));
    } else if (containsInvalidChar) {
      setErrors((prev) => ({ ...prev, name: 'Name must contain only letters and spaces.' }));
    } else {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  } else if (name === 'contactNumber') {
    const contactValid = /^\d{0,10}$/.test(value); // allows only digits, up to 10
    if (!contactValid) {
      setErrors((prev) => ({
        ...prev,
        contactNumber: 'Contact number must be numeric and up to 10 digits only.',
      }));
    } else if (value.length !== 10) {
    setErrors((prev) => ({
      ...prev,
      contactNumber: 'Contact number must be exactly 10 digits.',
    }));
  }
     else {
      setErrors((prev) => ({ ...prev, contactNumber: '' }));
    }
  } else {
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }
};

  

  const handleScheduleChange = (index, field, value) => {
    const updated = [...form.schedule];
    updated[index][field] = value;
    setForm({ ...form, schedule: updated });
  };

 const addScheduleRow = () => {
  if (form.schedule.length >= 7) {
    toast.error('You can only add up to 7 schedule entries (one per day).');
    return;
  }

  setForm({
    ...form,
    schedule: [...form.schedule, { dayOfWeek: '', startTime: '', endTime: '', isAvailable: true }]
  });
};


  const removeScheduleRow = (index) => {
    const updated = [...form.schedule];
    updated.splice(index, 1);
    setForm({ ...form, schedule: updated });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
     const payload = { ...form };

  if (form.role !== 'DOCTOR') {
    const selectedDept = departments.find((d) => d._id === form.department);
    if (selectedDept) {
      payload.department = selectedDept.name;
    } else {
      toast.error('Invalid department selected for staff.');
      return;
    }
  }
    try {
    const res = await axios.post(`${BASE_URL}/api/admin/users`, payload, {
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  withCredentials: true
});
    toast.success(res.data.message || 'User registered successfully!');


      setFormVisible(false);
      setForm({
        name: '',
        email: '',
        password: '',
        role: '',
        doctorType: '',
        specialty: '',
        medicalLicenseNumber: '',
        schedule: [],
        contactNumber: '',
        designation: '',
        department: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');

    }
  };

  return (
    <div className="form-container2">
      <div>
        <h2 className="form-title">Register User</h2>

        {message && (
          <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        {!formVisible ? (
          <button className="toggle-btn" onClick={() => setFormVisible(true)}>
            + Register Another User
          </button>
        ) : (
          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            {errors.name && <div className="error-text">{errors.name}</div>}

            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" required />
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="DOCTOR">Doctor</option>
              <option value="STAFF">STAFF</option>
             
            </select>

            {form.role === 'DOCTOR' && (
              <>
                <select name="doctorType" value={form.doctorType} onChange={handleChange} required>
                  <option value="">Select Doctor Type</option>
                  <option value="Consultant">Consultant</option>
                  <option value="On-roll">On-roll</option>
                </select>
                <select name="specialty" value={form.specialty} onChange={handleChange} required>
                  <option value="">Select Specialty</option>
                  {specialties.map((s) => (
                    <option key={s._id} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <select name="department" value={form.department} onChange={handleChange} required>
  <option value="">Select Department</option>
  {departments.map((d) => (
    <option key={d._id} value={d._id}>{d.name}</option>
  ))}
</select>

                <input name="medicalLicenseNumber" value={form.medicalLicenseNumber} onChange={handleChange} placeholder="Medical License No." required />

                <h4>Schedule</h4>
                {form.schedule.map((entry, index) => (
                  <div key={index} className="schedule-row">
                  <select
  value={entry.dayOfWeek}
  onChange={(e) => handleScheduleChange(index, 'dayOfWeek', e.target.value)}
  required
>
  <option value="">Day</option>
  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
    <option key={d} value={d} disabled={form.schedule.some((s, i) => s.dayOfWeek === d && i !== index)}>
      {d}
    </option>
  ))}
</select>

                    <input type="time" value={entry.startTime} onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} required />
                    <input type="time" value={entry.endTime} onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)} required />
                    <input type="checkbox" checked={entry.isAvailable} onChange={(e) => handleScheduleChange(index, 'isAvailable', e.target.checked)} />
                    <button type="button" onClick={() => removeScheduleRow(index)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addScheduleRow}>+ Add Schedule</button>
              </>
            )}

            {form.role !== 'DOCTOR' && (
              <>
      <input
  name="contactNumber"
  value={form.contactNumber}
  onChange={handleChange}
  placeholder="Contact Number"
  required
  maxLength={10}
/>
{errors.contactNumber && <div className="error-text">{errors.contactNumber}</div>}

                <select name="designation" value={form.designation} onChange={handleChange} required>
                  <option value="">Select Designation</option>
                  <option value="Head Nurse">Head Nurse</option>
                  <option value="Assistant Doctor">Assistant Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Other">Other</option>
                </select>
                <select name="department" value={form.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </>
            )}

            <button type="submit" className="submit-btn">Register</button>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default AddUser;
