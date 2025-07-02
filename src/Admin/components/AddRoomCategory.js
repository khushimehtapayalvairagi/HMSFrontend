import React, { useState } from "react";
import axios from "axios";

const RoomCategory = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formVisible, setFormVisible] = useState(true); // 🔹 Toggle form visibility

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.post(
        "http://localhost:8000/api/admin/room-categories",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setMessage("Room category created successfully.");
      setForm({ name: "", description: "" });
      setErrors({});
      setFormVisible(false); // 🔹 Hide form
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong";

      if (errMsg === "Room category already exists.") {
        setErrors({ name: errMsg });
      } else if (errMsg === "name and description is required") {
        setErrors({ name: "Name is required", description: "Description is required" });
      } else {
        setMessage(errMsg);
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Create Room Category</h2>

      {!formVisible ? (
        <>
          <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
          <button onClick={() => setFormVisible(true)} style={{ padding: "10px 20px", marginTop: "10px" }}>
            Create Another
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.name && (
              <div style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
                {errors.name}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Description:</label><br />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors.description && (
              <div style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
                {errors.description}
              </div>
            )}
          </div>

          <button type="submit" style={{ padding: "10px 20px" }}>Submit</button>
        </form>
      )}
    </div>
  );
};

export default RoomCategory;
