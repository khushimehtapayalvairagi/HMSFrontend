import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    relatives: [{ name: '', contactNumber: '', relationship: '' }]
  });
  const [submittedData, setSubmittedData] = useState(null);

  const printRef = useRef();

const handleChange = (e) => {
  const { name, value } = e.target;

  // Validate contact number
  if (name === 'contactNumber' && !validateContactNumber(value)) {
    toast.error('Contact number cannot exceed 10 digits.');
    return;
  }

  setForm({ ...form, [name]: value });
};


const handleRelativeChange = (index, e) => {
  const { name, value } = e.target;

  if (name === 'contactNumber' && !validateContactNumber(value)) {
    toast.error('Relative contact number cannot exceed 10 digits.');
    return;
  }

  const updatedRelatives = [...form.relatives];
  updatedRelatives[index][name] = value;
  setForm({ ...form, relatives: updatedRelatives });
};


 const addRelative = () => {
  if (form.relatives.length < 3) {
    setForm({
      ...form,
      relatives: [...form.relatives, { name: '', contactNumber: '', relationship: '' }]
    });
  } else {
    toast.warning('Maximum of 3 relatives allowed.');
  }
};
const removeRelative = (index) => {
  const updatedRelatives = form.relatives.filter((_, i) => i !== index);
  setForm({ ...form, relatives: updatedRelatives });
};

const validateContactNumber = (number) => {
  const digitsOnly = number.replace(/\D/g, ''); // Remove non-digits
  return digitsOnly.length <= 10;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    const res = await axios.post(
      'http://localhost:8000/api/receptionist/patients',
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 201) {
      toast.success('Patient registered successfully!');
      setSubmittedData(res.data.patient);
    } else {
      toast.error('Unexpected response from server.');
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Registration failed.');
  }
};



  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Patient Details</title></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Register Patient</h2>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input type="date" name="dob" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
  name="contactNumber"
  placeholder="Contact Number"
  value={form.contactNumber}
  onChange={handleChange}
  maxLength={10}
  required
/>

        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />


<h4>Relatives</h4>
{form.relatives.map((relative, index) => (
  <div key={index} style={{ marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
    <input
      name="name"
      placeholder="Relative Name"
      value={relative.name}
      onChange={(e) => handleRelativeChange(index, e)}
      required
    />
   <input
  name="contactNumber"
  placeholder="Relative Contact"
  value={relative.contactNumber}
  onChange={(e) => handleRelativeChange(index, e)}
  maxLength={10}
  required
/>

    <input
      name="relationship"
      placeholder="Relationship"
      value={relative.relationship}
      onChange={(e) => handleRelativeChange(index, e)}
      required
    />
    {form.relatives.length > 1 && (
      <button type="button" onClick={() => removeRelative(index)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px' }}>
        Remove
      </button>
    )}
  </div>
))}

        <button type="button" onClick={addRelative}>Add Relative</button>
        <br />
        <button type="submit">Register Patient</button>
      </form>

      {submittedData && (
        <div style={{ marginTop: '30px' }}>
          <button onClick={handlePrint}>Print Patient Details</button>
          <div ref={printRef} style={{ display: 'none' }}>
            <h2>Patient Registration Details</h2>
            <p><strong>Patient ID:</strong> {submittedData.patientId}</p>
            <p><strong>Name:</strong> {submittedData.fullName}</p>
            <p><strong>DOB:</strong> {new Date(submittedData.dob).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {submittedData.gender}</p>
            <p><strong>Contact Number:</strong> {submittedData.contactNumber}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Address:</strong> {submittedData.address}</p>
            <h4>Relatives:</h4>
            <ul>
              {submittedData.relatives.map((r, idx) => (
                <li key={idx}>
                  {r.name} | {r.relationship} | {r.contactNumber}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PatientForm;
