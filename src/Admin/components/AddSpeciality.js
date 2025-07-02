import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpeciality } from '../../State/Auth/Actions';
import './AddUser.css'; // reuse styles

const AddSpeciality = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(createSpeciality({ name, description }));

    if (result.success) {
      setMessage(result.message);
      setName('');
      setDescription('');
      setErrors({});
    } else {
      setErrors({ name: result.message.includes('exists') ? result.message : null });
      setMessage(null);
    }
  };

 return (
    <div className="specialty-container">
      <div className="specialty-card">
        <h2 className="specialty-title">Add Specialty</h2>

        {message && <div className="specialty-success">{message}</div>}

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

      {/* Internal CSS */}
      <style>
        {`
          .specialty-container {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f4f6f8;
            min-height: 100vh;
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
          }

          .specialty-button:hover {
            background-color: #155a9b;
          }

          .specialty-error {
            color: red;
            font-size: 14px;
          }

          .specialty-success {
            color: green;
            margin-bottom: 15px;
            text-align: center;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default AddSpeciality;
