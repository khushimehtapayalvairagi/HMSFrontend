import React, { useEffect, useState } from 'react';
import './ViewUsers.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BulkUpload } from './Add_user';

const ViewUsers = () => {
  const { type } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userType, setUserType] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (type) {
      const role = type.toUpperCase();
      setUserType(role);
      loadUsers(role);
    }
  }, [type]);

  const loadUsers = async (role) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      let response;

      if (role === 'DOCTOR') {
        response = await axios.get(`${BASE_URL}/api/admin/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setFilteredUsers(response.data.doctors || []);
      } else {
        response = await axios.get(`${BASE_URL}/api/admin/staff`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setFilteredUsers(response.data.staff || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${BASE_URL}/api/admin/users`, {
        data: { id, role: userType },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success(`${userType} deleted successfully`);
      loadUsers(userType);
    } catch (error) {
      toast.error("Failed to delete user");
    }
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  return (
    <div className="view-users-container">
      <div className="bulk-upload-card">
        <h3>Bulk Upload {userType}</h3>
        <BulkUpload role={userType} BASE_URL={BASE_URL} onUploadSuccess={() => loadUsers(userType)} />
      </div>

      <h3>📋 View {userType || 'Users'}</h3>

      {loading ? (
        <p>Loading...</p>
      ) : filteredUsers.length > 0 ? (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>

                {userType === "DOCTOR" && (
                  <>
                    <th>Role</th>
                    <th>Doctor Type</th>
                    <th>Specialty</th>
                    <th>Medical License</th>
                  </>
                )}

                {userType === "STAFF" && (
                  <>
                    <th>Designation</th>
                    <th>Contact</th>
                  </>
                )}

                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.userId?.name || user.name || '-'}</td>
                  <td>{user.userId?.email || user.email || '-'}</td>

                  {userType === "DOCTOR" && (
                    <>
                      <td>{user.userId?.role || user.role || '-'}</td>
                      <td>{user.doctorType || '-'}</td>
                      <td>{user.specialty?.name || '-'}</td>
                      <td>{user.medicalLicenseNumber || '-'}</td>
                    </>
                  )}

                  {userType === "STAFF" && (
                    <>
                      <td>{user.designation || '-'}</td>
                      <td>{user.contactNumber || '-'}</td>
                    </>
                  )}

                  <td>{user.isActive ? "Active ✅" : "Inactive ❌"}</td>
                  <td>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                      <MoreVertIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default ViewUsers;
