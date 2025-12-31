import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddUser.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// ✅ Reusable Bulk Upload Component
const BulkUpload = ({ role, BASE_URL , onUploadSuccess}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('jwt');

      const endpoint =
        role === 'DOCTOR'
          ? `${BASE_URL}/api/admin/doctors`
          : `${BASE_URL}/api/admin/staff`;

      const res = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          
        },
      });

      toast.success(res.data.message || 'Bulk upload successful!');
       if (onUploadSuccess) onUploadSuccess();
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bulk-upload-box">
      <h4>{role === 'DOCTOR' ? 'Doctor Bulk Upload' : 'Staff Bulk Upload'}</h4>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading} className="upload-btn">
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

const AddUser = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    doctorType: '',
    specialty: '',
    medicalLicenseNumber: '',
    // schedule: [],
    contactNumber: '',
    designation: '',
    department: '',
  });

  const [formVisible, setFormVisible] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedUploadRole, setSelectedUploadRole] = useState(''); // 🔹 dropdown state
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchOptions = async () => {
      const token = localStorage.getItem('jwt');
      const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
      try {
        const [spec, dept] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin/specialties`, config),
          axios.get(`${BASE_URL}/api/admin/specialties`, config),
        ]);
        setSpecialties(spec.data.specialties || []);
        setDepartments(dept.data.specialties || []);
      } catch (err) {
        console.error('Error fetching options:', err);
      }
    };
    fetchOptions();
  }, [BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

   if (name === 'name') {
  const regex = /^[A-Za-z][A-Za-z .'-]*$/;

  if (!regex.test(value)) {
    setErrors((prev) => ({ 
      ...prev, 
      name: 'Name can include letters, spaces, periods, apostrophes, and hyphens.' 
    }));
  } else {
    setErrors((prev) => ({ ...prev, name: '' }));
  }
}

    } else if (name === 'contactNumber') {
      const contactValid = /^\d{0,10}$/.test(value);
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
      } else {
        setErrors((prev) => ({ ...prev, contactNumber: '' }));
      }
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // const handleScheduleChange = (index, field, value) => {
  //   const updated = [...form.schedule];
  //   updated[index][field] = value;
  //   setForm({ ...form, schedule: updated });
  // };

  // const addScheduleRow = () => {
  //   if (form.schedule.length >= 7) {
  //     toast.error('You can only add up to 7 schedule entries (one per day).');
  //     return;
  //   }
  //   setForm({
  //     ...form,
  //     schedule: [...form.schedule, { dayOfWeek: '', startTime: '', endTime: '', isAvailable: true }],
  //   });
  // };

  // const removeScheduleRow = (index) => {
  //   const updated = [...form.schedule];
  //   updated.splice(index, 1);
  //   setForm({ ...form, schedule: updated });
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('jwt');

  // ✅ Ensure department & specialty are sent correctly
  const payload = {
    ...form,
    department: typeof form.department === 'object' ? form.department._id : form.department,
    specialty: typeof form.specialty === 'object' ? form.specialty._id : form.specialty,
  };

  try {
    const res = await axios.post(`${BASE_URL}/api/admin/users`, payload, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      withCredentials: true,
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
      contactNumber: '',
      designation: '',
      department: '',
    });
  } catch (err) {
    toast.error(err.response?.data?.message || 'Something went wrong.');
  }
};


  return (
    <div>
      {/* 🔹 Bulk Upload Card Above Register Form */}
      <div className="form-container2 bulk-upload-card">
        <h2 className="form-title">Staff/Doctor Bulk Upload</h2>
        <select
          className="bulk-dropdown"
          value={selectedUploadRole}
          onChange={(e) => setSelectedUploadRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="STAFF">Staff</option>
          <option value="DOCTOR">Doctor</option>
        </select>

        {selectedUploadRole && <BulkUpload role={selectedUploadRole} BASE_URL={BASE_URL} />}
      </div>

      {/* 🔹 Register User Form */}
      <div className="form-container2">
        <h2 className="form-title">Register User</h2>

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
              <option value="STAFF">Staff</option>
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
                    <option key={s._id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select name="department" value={form.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <input
                  name="medicalLicenseNumber"
                  value={form.medicalLicenseNumber}
                  onChange={handleChange}
                  placeholder="Medical License No."
                  required
                />

                {/* <h4>Schedule</h4> */}
                {/* {form.schedule.map((entry, index) => (
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
                ))} */}
                {/* <button type="button" onClick={addScheduleRow}>+ Add Schedule</button> */}
              </>
            )}

            {form.role === 'STAFF' && (
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
                  <option value="Lab Technician">Lab Technician</option>
                   <option value="Head Nurse">Head Nurse</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Other">Other</option>
                </select>
              {/* <select name="department" value={form.department} onChange={handleChange}>
  <option value="">Select Department</option>
  {departments.map((d) => (
    <option key={d._id} value={d.name}>
      {d.name}
    </option>
  ))}
</select> */}

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
export { BulkUpload };
export default AddUser;
