import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/UserTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("registration_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/users/account/viewall/");
      setUsers(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to fetch users";
      setError(message);
      console.error("UserTable: fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/users/account/delete/${userId}/`);
      setUsers(users.filter(user => user.id !== userId));
      alert(`User "${username}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete user";
      alert(`Error: ${message}`);
      console.error("Delete user error:", err);
    }
  };

  const handleEditUser = (userId) => {
    setShowUserModal(false);
    // Navigate to edit form with user ID as query param
    navigate(`/admin/edit-user/${userId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin": return "badge badge-admin";
      case "lecturer": return "badge badge-lecturer";
      case "student": return "badge badge-student";
      default: return "badge badge-default";
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle date fields
      if (sortField === "registration_date" || sortField === "last_login") {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }
      
      // Handle string fields
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || "";
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="user-table-container">
        <h2>User Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="user-table-container">
      <div className="table-header">
        <h2>User Management</h2>
        <button className="button button-primary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users by username, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="table-stats">
          Total Users: {filteredAndSortedUsers.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("username")} className="sortable">
                Username {sortField === "username" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("email")} className="sortable">
                Email {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("role")} className="sortable">
                Role {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("is_premium")} className="sortable">
                Premium {sortField === "is_premium" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("registration_date")} className="sortable">
                Registered {sortField === "registration_date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("last_login")} className="sortable">
                Last Login {sortField === "last_login" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className="username-cell">
                  {user.profile_icon && (
                    <img
                      src={user.profile_icon}
                      alt=""
                      className="profile-icon-small"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  {user.username}
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.is_premium ? 'badge-premium' : 'badge-free'}`}>
                    {user.is_premium ? "Premium" : "Free"}
                  </span>
                </td>
                <td>{formatDate(user.registration_date)}</td>
                <td>{formatDate(user.last_login)}</td>
                <td className="actions-cell">
                  <button
                    className="button button-small button-info"
                    onClick={() => handleViewUser(user)}
                  >
                    View
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    disabled={user.role === "admin"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedUsers.length === 0 && !loading && (
        <div className="no-data">
          {searchTerm ? "No users found matching your search." : "No users found."}
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowUserModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-grid">
                <div className="user-detail-item">
                  <label>ID:</label>
                  <span>{selectedUser.id}</span>
                </div>
                <div className="user-detail-item">
                  <label>Username:</label>
                  <span>{selectedUser.username}</span>
                </div>
                <div className="user-detail-item">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="user-detail-item">
                  <label>Role:</label>
                  <span className={getRoleBadgeClass(selectedUser.role)}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="user-detail-item">
                  <label>Premium Status:</label>
                  <span className={`badge ${selectedUser.is_premium ? 'badge-premium' : 'badge-free'}`}>
                    {selectedUser.is_premium ? "Premium" : "Free"}
                  </span>
                </div>
                <div className="user-detail-item">
                  <label>Registration Date:</label>
                  <span>{formatDate(selectedUser.registration_date)}</span>
                </div>
                <div className="user-detail-item">
                  <label>Last Login:</label>
                  <span>{formatDate(selectedUser.last_login)}</span>
                </div>
                <div className="user-detail-item">
                  <label>Active:</label>
                  <span className={`badge ${selectedUser.is_active ? 'badge-active' : 'badge-inactive'}`}>
                    {selectedUser.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                {selectedUser.profile_icon && (
                  <div className="user-detail-item full-width">
                    <label>Profile Icon:</label>
                    <img
                      src={selectedUser.profile_icon}
                      alt="Profile"
                      className="profile-icon-large"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span style={{ display: 'none' }}>Image failed to load</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="button button-primary"
                onClick={() => handleEditUser(selectedUser.id)}
              >
                Edit User
              </button>
              <button
                className="button button-secondary"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}