import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const updateRole = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/users/${selectedUserId}/role`,
        { role: selectedRole },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Role updated successfully');
      // Re-fetch users to update the list with the new roles
      const response = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating role');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel: Manage User Roles</h2>
      <div className="role-update-section">
        <select
          onChange={(e) => setSelectedUserId(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a user
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email} - Current Role: {user.role}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedRole(e.target.value)}
          defaultValue="user"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={updateRole}>Update Role</button>
      </div>
    </div>
  );
};

export default AdminPanel;
