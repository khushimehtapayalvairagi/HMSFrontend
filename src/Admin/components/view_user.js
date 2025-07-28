import React, { useEffect, useState } from 'react';
import './ViewUsers.css';
import { useParams } from 'react-router-dom';
import axios from "axios";

const ViewUsers = () => {
  const { type } = useParams();

  const [userType, setUserType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const token = localStorage.getItem("jwt");
      let response;

      if (role === 'DOCTOR') {
        response = await axios.get('http://localhost:8000/api/admin/doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setFilteredUsers(response.data.doctors || []);
      } else {
        response = await axios.get('http://localhost:8000/api/admin/staff', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleSearch = () => {
    const filtered = filteredUsers.filter((user) => {
      const name = user.userId?.name || user.name || '';
      const email = user.userId?.email || user.email || '';
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  };

  return (
    <div className="view-users-container">
      <h3>📋 View {userType || 'Users'}</h3>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(); // optional: live search
          }}
          className="add-user-input-field"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredUsers.length > 0 ? (
        <>
          {userType === 'DOCTOR' ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Doctor Type</th>
                  <th>Specialty</th>
                     <th>Department</th>
                  <th>Medical License</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userId?.name || user.name || '-'}</td>
                    <td>{user.userId?.email || user.email || '-'}</td>
                    <td>{user.userId?.role || user.role || '-'}</td>
                    <td>{user.doctorType || '-'}</td>
                    <td>{user.specialty?.name || '-'}</td>
                   <td>
                      {user.department && typeof user.department.name === 'string'
                        ? user.department.name
                        : '-'}
                    </td>
                    <td>{user.medicalLicenseNumber || '-'}</td>
                    <td>
                      {Array.isArray(user.schedule) ? (
                        user.schedule.map((s, i) => (
                          <div key={i}>
                            {s.dayOfWeek}: {s.startTime || '--'} - {s.endTime || '--'}
                          </div>
                        ))
                      ) : (
                        'No schedule'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Designation</th>
                  <th>Contact</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userId?.name || user.name}</td>
                    <td>{user.userId?.email || user.email}</td>
                    <td>{user.userId?.role || user.role}</td>
                    <td>{user.designation || '-'}</td>
                    <td>{user.contactNumber || '-'}</td>
                    <td>
                      {user.department && typeof user.department.name === 'string'
                        ? user.department.name
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        userType && <p>No users found</p>
      )}
    </div>
  );
};

export default ViewUsers;
