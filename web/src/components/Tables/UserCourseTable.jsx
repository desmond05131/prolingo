import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/UserCourseTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function UserCourseTable() {
  const [userCourses, setUserCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("enrollment_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUserCourse, setSelectedUserCourse] = useState(null);
  const [showUserCourseModal, setShowUserCourseModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserCourse, setEditingUserCourse] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    user: "",
    course: "",
    progress_percent: 0.0,
    status: "in-progress"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchUserCourses();
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchUserCourses = async () => {
    setLoading(true);
    setError("");
    try {
      // Use admin endpoint to fetch all user courses
      const response = await api.get("/api/courses/admin/user-courses/");
      console.log("Fetched user courses:", response.data); // Debug log
      setUserCourses(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.detail || `Failed to fetch user courses: ${err.message}`;
      setError(message);
      console.error("UserCourseTable: fetch error", err);
      console.error("Error response:", err.response); // Debug log
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // First, let's try the most common endpoint
      let response;
      
      try {
        response = await api.get("/api/users/");
        console.log("Fetched users from /api/users/:", response.data);
      } catch (firstErr) {
        console.log("Failed to fetch from /api/users/, trying /api/users/users/");
        try {
          response = await api.get("/api/users/users/");
          console.log("Fetched users from /api/users/users/:", response.data);
        } catch (secondErr) {
          console.log("Failed to fetch from /api/users/users/, trying /api/admin/users/");
          response = await api.get("/api/admin/users/");
          console.log("Fetched users from /api/admin/users/:", response.data);
        }
      }
      
      const userData = response.data;
      
      // Handle different response formats
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else if (userData && Array.isArray(userData.results)) {
        setUsers(userData.results);
      } else if (userData && Array.isArray(userData.data)) {
        setUsers(userData.data);
      } else {
        console.error("Unexpected user data format:", userData);
        setUsers([]);
      }
      
    } catch (err) {
      console.error("All user fetch attempts failed:", err);
      setUsers([]);
      
      // If all endpoints fail, let's show which endpoints we tried
      const message = `Failed to fetch users. Tried endpoints: /api/users/, /api/users/users/, /api/admin/users/. Error: ${err.message}`;
      console.error(message);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/courses/");
      console.log("Fetched courses:", response.data); // Debug log
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses for dropdown:", err);
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

  const handleViewUserCourse = (userCourse) => {
    setSelectedUserCourse(userCourse);
    setShowUserCourseModal(true);
  };

  const handleCreateUserCourse = () => {
    setFormData({
      user: "",
      course: "",
      progress_percent: 0.0,
      status: "in-progress"
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditUserCourse = (userCourse) => {
    setEditingUserCourse(userCourse);
    setFormData({
      user: userCourse.user || "",
      course: userCourse.course || "",
      progress_percent: userCourse.progress_percent || 0.0,
      status: userCourse.status || "in-progress"
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteUserCourse = async (userCourseId, username, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete enrollment of "${username}" in "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/admin/user-courses/${userCourseId}/delete/`);
      setUserCourses(userCourses.filter(uc => uc.id !== userCourseId));
      alert(`Enrollment of "${username}" in "${courseTitle}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete enrollment";
      alert(`Error: ${message}`);
      console.error("Delete user course error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new enrollment using admin endpoint
        const response = await api.post("/api/courses/admin/user-courses/create/", formData);
        setUserCourses([...userCourses, response.data]);
        setShowCreateModal(false);
        alert("User enrollment created successfully!");
      } else if (showEditModal && editingUserCourse) {
        // Update existing enrollment using admin endpoint
        const response = await api.patch(`/api/courses/admin/user-courses/${editingUserCourse.id}/update/`, formData);
        setUserCourses(userCourses.map(uc => 
          uc.id === editingUserCourse.id ? response.data : uc
        ));
        setShowEditModal(false);
        setEditingUserCourse(null);
        alert("User enrollment updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      console.error("Form submit error details:", data); // Debug log
      
      if (data.user) {
        setFormError(Array.isArray(data.user) ? data.user[0] : String(data.user));
      } else if (data.course) {
        setFormError(Array.isArray(data.course) ? data.course[0] : String(data.course));
      } else if (data.non_field_errors) {
        setFormError(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : String(data.non_field_errors));
      } else if (data.detail) {
        setFormError(data.detail);
      } else {
        setFormError("Operation failed. Please try again.");
      }
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const closeAllModals = () => {
    setShowUserCourseModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUserCourse(null);
    setEditingUserCourse(null);
    setFormData({
      user: "",
      course: "",
      progress_percent: 0.0,
      status: "in-progress"
    });
    setFormError("");
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "in-progress": return "badge badge-in-progress";
      case "completed": return "badge badge-completed";
      case "dropped": return "badge badge-dropped";
      default: return "badge badge-default";
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 100) return "progress-bar progress-completed";
    if (progress >= 75) return "progress-bar progress-high";
    if (progress >= 50) return "progress-bar progress-medium";
    if (progress >= 25) return "progress-bar progress-low";
    return "progress-bar progress-minimal";
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : "Unknown User";
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  // Filter and sort user courses
  const filteredAndSortedUserCourses = userCourses
    .filter(userCourse => {
      const username = userCourse.user_username || getUserName(userCourse.user);
      const courseTitle = userCourse.course_title || getCourseTitle(userCourse.course);
      
      const matchesSearch = 
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userCourse.status?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "" || userCourse.status === statusFilter;
      const matchesCourse = courseFilter === "" || userCourse.course?.toString() === courseFilter;
      const matchesUser = userFilter === "" || userCourse.user?.toString() === userFilter;
      
      return matchesSearch && matchesStatus && matchesCourse && matchesUser;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle date fields
      if (sortField === "enrollment_date") {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }
      
      // Handle username sorting
      if (sortField === "user_username") {
        aVal = (a.user_username || getUserName(a.user)).toLowerCase();
        bVal = (b.user_username || getUserName(b.user)).toLowerCase();
      }
      
      // Handle course title sorting
      if (sortField === "course_title") {
        aVal = (a.course_title || getCourseTitle(a.course)).toLowerCase();
        bVal = (b.course_title || getCourseTitle(b.course)).toLowerCase();
      }
      
      // Handle string fields
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || "";
      }

      // Handle numeric fields
      if (typeof aVal === "number") {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="user-course-table-container">
        <h2>User Course Enrollment Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="user-course-table-container">
      <div className="table-header">
        <h2>User Course Enrollment Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateUserCourse}>
            Create Enrollment
          </button>
          <button className="button button-primary" onClick={fetchUserCourses}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={fetchUserCourses} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}

      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username, course title, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>
        <div className="filter-container">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-container">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="table-stats">
          Total Enrollments: {filteredAndSortedUserCourses.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="user-course-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("user_username")} className="sortable">
                User {sortField === "user_username" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("course_title")} className="sortable">
                Course {sortField === "course_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("status")} className="sortable">
                Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("progress_percent")} className="sortable">
                Progress {sortField === "progress_percent" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("enrollment_date")} className="sortable">
                Enrolled {sortField === "enrollment_date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUserCourses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? "Loading..." : "No enrollments found"}
                </td>
              </tr>
            ) : (
              filteredAndSortedUserCourses.map((userCourse) => (
                <tr key={userCourse.id}>
                  <td>{userCourse.id}</td>
                  <td>
                    <span className="badge badge-user">
                      {userCourse.user_username || getUserName(userCourse.user)}
                    </span>
                  </td>
                  <td className="course-title-cell">
                    <div className="course-title-content">
                      <strong>{userCourse.course_title || getCourseTitle(userCourse.course)}</strong>
                    </div>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(userCourse.status)}>
                      {userCourse.status}
                    </span>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className={getProgressBarClass(userCourse.progress_percent)}>
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min(userCourse.progress_percent || 0, 100)}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {(userCourse.progress_percent || 0).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(userCourse.enrollment_date)}</td>
                  <td className="actions-cell">
                    <button
                      className="button button-small button-info"
                      onClick={() => handleViewUserCourse(userCourse)}
                    >
                      View
                    </button>
                    <button
                      className="button button-small button-warning"
                      onClick={() => handleEditUserCourse(userCourse)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-small button-danger"
                      onClick={() => handleDeleteUserCourse(
                        userCourse.id, 
                        userCourse.user_username || getUserName(userCourse.user),
                        userCourse.course_title || getCourseTitle(userCourse.course)
                      )}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Course Detail Modal */}
      {showUserCourseModal && selectedUserCourse && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enrollment Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-course-detail-grid">
                <div className="user-course-detail-item">
                  <label>ID:</label>
                  <span>{selectedUserCourse.id}</span>
                </div>
                <div className="user-course-detail-item">
                  <label>User:</label>
                  <span className="badge badge-user">
                    {selectedUserCourse.user_username || getUserName(selectedUserCourse.user)}
                  </span>
                </div>
                <div className="user-course-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-info">
                    {selectedUserCourse.course_title || getCourseTitle(selectedUserCourse.course)}
                  </span>
                </div>
                <div className="user-course-detail-item">
                  <label>Status:</label>
                  <span className={getStatusBadgeClass(selectedUserCourse.status)}>
                    {selectedUserCourse.status}
                  </span>
                </div>
                <div className="user-course-detail-item">
                  <label>Progress:</label>
                  <div className="progress-container">
                    <div className={getProgressBarClass(selectedUserCourse.progress_percent)}>
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(selectedUserCourse.progress_percent || 0, 100)}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {(selectedUserCourse.progress_percent || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="user-course-detail-item">
                  <label>Enrollment Date:</label>
                  <span>{formatDate(selectedUserCourse.enrollment_date)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditUserCourse(selectedUserCourse)}>
                Edit Enrollment
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit User Course Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Enrollment" : "Edit Enrollment"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="enrollment-user">User *</label>
                  <select
                    id="enrollment-user"
                    value={formData.user}
                    onChange={(e) => setFormData({...formData, user: e.target.value})}
                    required
                    disabled={formLoading || showEditModal}
                  >
                    <option value="">Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} {user.email && `(${user.email})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="enrollment-course">Course *</label>
                  <select
                    id="enrollment-course"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    required
                    disabled={formLoading || showEditModal}
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="enrollment-status">Status</label>
                  <select
                    id="enrollment-status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    disabled={formLoading}
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="enrollment-progress">Progress (%)</label>
                  <input
                    type="number"
                    id="enrollment-progress"
                    value={formData.progress_percent}
                    onChange={(e) => setFormData({...formData, progress_percent: parseFloat(e.target.value) || 0.0})}
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={formLoading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Enrollment" : "Update Enrollment")}
                </button>
                <button type="button" className="button button-secondary" onClick={closeAllModals} disabled={formLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}