import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSpeciality = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/specialties`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Specialty created successfully ✅");
      setName('');
      setDescription('');
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg.includes("exists")) {
        toast.error("Specialty already exists ❌");
        setErrors({ name: msg });
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className="specialty-container">
      <div className="specialty-card">
        <h2 className="specialty-title">Add Specialty</h2>

        <form onSubmit={handleSubmit} className="specialty-form">
          <input
            name="name"
            placeholder="Specialty Name"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            className="specialty-input"
          />
          {errors.name && <div className="specialty-error">{errors.name}</div>}

          <textarea
            name="description"
            placeholder="Description"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: undefined }));
            }}
            className="specialty-textarea"
          />
          {errors.description && (
            <div className="specialty-error">{errors.description}</div>
          )}

          <button type="submit" className="specialty-button">Create</button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Internal CSS for styling & responsiveness */}
      <style>
        {`
          .specialty-container {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f4f6f8;
            min-height: 100vh;
            padding: 20px;
          }

          .specialty-card {
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 100%;
            max-width: 500px;
          }

          .specialty-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
          }

          .specialty-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .specialty-input,
          .specialty-textarea {
            padding: 12px;
            font-size: 16px;
            border-radius: 6px;
            border: 1px solid #ccc;
            width: 100%;
            box-sizing: border-box;
          }

          .specialty-textarea {
            min-height: 100px;
            resize: vertical;
          }

          .specialty-button {
            padding: 12px;
            background-color: #1976d2;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .specialty-button:hover {
            background-color: #155a9b;
          }

          .specialty-error {
            color: red;
            font-size: 14px;
          }

          /* ✅ Mobile responsive styles */
          @media (max-width: 600px) {
            .specialty-card {
              padding: 20px;
              border-radius: 8px;
            }

            .specialty-title {
              font-size: 20px;
            }

            .specialty-input,
            .specialty-textarea {
              font-size: 14px;
              padding: 10px;
            }

            .specialty-button {
              font-size: 14px;
              padding: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AddSpeciality;
