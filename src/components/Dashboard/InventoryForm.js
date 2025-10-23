import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InventoryForm() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [form, setForm] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    unitOfMeasurement: '',
    minStockLevel: '',
    maxStockLevel: '',
    supplierInfo: { name: '', contact: '' },
    currentStock: '',
  });
    const [file, setFile] = useState(null);

  // ✅ Existing code for single item form remains unchanged

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload");

    const token = localStorage.getItem("jwt");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/bulk-upload/item`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      toast.success(data.message);
      if (data.failedRows?.length)
        toast.warn(`Some rows failed: ${data.failedRows.join(", ")}`);

      setFile(null);
      document.getElementById("bulkFile").value = "";
    } catch (err) {
      toast.error(err.message || "Error uploading file");
    }
  };

  // const styles = {
  //   bulkContainer: {
  //     maxWidth: "550px",
  //     margin: "30px auto",
  //     padding: "20px",
  //     borderRadius: "12px",
  //     backgroundColor: "#f1f5f9",
  //     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  //     fontFamily: "Poppins, sans-serif",
  //   },
  //   fileInput: {
  //     padding: "10px",
  //     background: "#fff",
  //     borderRadius: "8px",
  //     border: "1px solid #ccc",
  //     width: "100%",
  //     marginBottom: "10px",
  //   },
  //   uploadBtn: {
  //     background: "#28a745",
  //     color: "#fff",
  //     fontWeight: "600",
  //     border: "none",
  //     padding: "10px 15px",
  //     borderRadius: "8px",
  //     cursor: "pointer",
  //   },
  // };


  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('supplierInfo.')) {
      setForm(prev => ({
        ...prev,
        supplierInfo: { ...prev.supplierInfo, [name.split('.')[1]]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (
      !form.itemName ||
      !form.itemCode ||
      !form.category ||
      !form.unitOfMeasurement ||
      form.minStockLevel === '' ||
      form.maxStockLevel === '' ||
      !form.supplierInfo.name ||
      !form.supplierInfo.contact
    ) {
      toast.error('Please fill in all required fields.');
      return false;
    }

    const contact = form.supplierInfo.contact;
    if (!/^\d{10}$/.test(contact)) {
      toast.error('Supplier contact must be exactly 10 digits.');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem('jwt');
    const body = {
      ...form,
      minStockLevel: Number(form.minStockLevel),
      maxStockLevel: Number(form.maxStockLevel),
      currentStock: form.currentStock ? Number(form.currentStock) : undefined,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/inventory/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      toast.success(`Item created: ${data.item.itemName}`);
      setForm({
        itemName: '',
        itemCode: '',
        category: '',
        unitOfMeasurement: '',
        minStockLevel: '',
        maxStockLevel: '',
        supplierInfo: { name: '', contact: '' },
        currentStock: '',
      });
    } catch (err) {
      if (err.message.includes('duplicate key')) {
        toast.error('Item code already exists. Please use a different code.');
      } else {
        toast.error('Error creating item. Please try again.');
      }
    }
  };

  // ✅ Internal CSS styles
  
     const styles = {
    bulkContainer: {
      maxWidth: "550px",
      margin: "30px auto",
      padding: "20px",
      borderRadius: "12px",
      backgroundColor: "#f1f5f9",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      fontFamily: "Poppins, sans-serif",
    },
    fileInput: {
      padding: "10px",
      background: "#fff",
      borderRadius: "8px",
      border: "1px solid #ccc",
      width: "100%",
      marginBottom: "10px",
    },
    uploadBtn: {
      background: "#28a745",
      color: "#fff",
      fontWeight: "600",
      border: "none",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
    },
  
    container: {
      maxWidth: '550px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '12px',
      backgroundColor: '#f9fafc',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
    },
    heading: {
      textAlign: 'center',
      fontSize: '1.6rem',
      fontWeight: '600',
      color: '#2a3f54',
      marginBottom: '25px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    input: {
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    select: {
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      backgroundColor: '#fff',
    },
    button: {
      marginTop: '10px',
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.heading}>Add Inventory Item</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
            placeholder="Item Name*"
            required
            style={styles.input}
          />
          <input
            name="itemCode"
            value={form.itemCode}
            onChange={handleChange}
            placeholder="Item Code*"
            required
            style={styles.input}
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Category*</option>
            <option value="Surgical Consumable">Surgical Consumable</option>
            <option value="Equipment">Equipment</option>
            <option value="Office Supplies">Office Supplies</option>
          </select>
          <input
            name="unitOfMeasurement"
            value={form.unitOfMeasurement}
            onChange={handleChange}
            placeholder="Unit of Measurement*"
            required
            style={styles.input}
          />
          <input
            name="minStockLevel"
            type="number"
            value={form.minStockLevel}
            onChange={handleChange}
            placeholder="Min Stock Level*"
            required
            style={styles.input}
          />
          <input
            name="maxStockLevel"
            type="number"
            value={form.maxStockLevel}
            onChange={handleChange}
            placeholder="Max Stock Level*"
            required
            style={styles.input}
          />
          <input
            name="supplierInfo.name"
            value={form.supplierInfo.name}
            onChange={handleChange}
            placeholder="Supplier Name*"
            required
            style={styles.input}
          />
          <input
            name="supplierInfo.contact"
            value={form.supplierInfo.contact}
            onChange={handleChange}
            placeholder="Supplier Contact (10 digits)*"
            required
            style={styles.input}
          />
          <input
            name="currentStock"
            type="number"
            value={form.currentStock}
            onChange={handleChange}
            placeholder="Current Stock"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Create Item
          </button>
        </form>
          <div style={styles.bulkContainer}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Bulk Upload Inventory
        </h3>
        <form onSubmit={handleBulkUpload}>
          <input
            type="file"
            id="bulkFile"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <button type="submit" style={styles.uploadBtn}>
            Upload File
          </button>
        </form>
        <p style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
          <strong>Note:</strong> File should include columns:
          <br />
          <em>
            itemName, itemCode, category, unitOfMeasurement, minStockLevel,
            maxStockLevel, supplierName, supplierContact, currentStock
          </em>
        </p>
      </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default InventoryForm;
