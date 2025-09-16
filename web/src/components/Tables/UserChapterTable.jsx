import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/UserChapterTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function UserChapterTable() {
  const [userChapters, setUserChapters] = useState([]);
  const [users, setUsers] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("last_accessed");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUserChapter, setSelectedUserChapter] = useState(null);
  const [showUserChapterModal, setShowUserChapterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserChapter, setEditingUserChapter] = useState(null);
  const [completedFilter, setCompletedFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    user: "",
    chapter: "",
    completed: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchUserChapters();
    fetchUsers();
    fetchChapters();
    fetchCourses();
  }, []);

  const fetchUserChapters = async () => {
    setLoading(true);
    setError("");
    try {
      // We'll need to create a new endpoint for admin to view all user chapters
      const response = await api.get("/api/courses/admin/user-chapters/");
      console.log("Fetched user chapters:", response.data);
      setUserChapters(response.data || []);
    } catch (err) {
      // If admin endpoint doesn't exist, try to get user chapters through other means
      try {
        console.log("Admin endpoint not found, trying alternative approach...");
        // This is a fallback - you'll need to implement the admin endpoint in backend
        const response = await api.get("/api/courses/user-chapters/");
        setUserChapters(response.data || []);
      } catch (fallbackErr) {
        const message = fallbackErr?.response?.data?.detail || `Failed to fetch user chapters: ${fallbackErr.message}`;
        setError(message);
        console.error("UserChapterTable: fetch error", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      let response;
      try {
        response = await api.get("/api/users/");
      } catch (firstErr) {
        try {
          response = await api.get("/api/users/users/");
        } catch (secondErr) {
          response = await api.get("/api/admin/users/");
        }
      }
      
      const userData = response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else if (userData && Array.isArray(userData.results)) {
        setUsers(userData.results);
      } else if (userData && Array.isArray(userData.data)) {
        setUsers(userData.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await api.get("/api/courses/chapters/");
      setChapters(response.data || []);
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/courses/");
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
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

  const handleViewUserChapter = (userChapter) => {
    setSelectedUserChapter(userChapter);
    setShowUserChapterModal(true);
  };

  const handleCreateUserChapter = () => {
    setFormData({
      user: "",
      chapter: "",
      completed: false
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditUserChapter = (userChapter) => {
    setEditingUserChapter(userChapter);
    setFormData({
      user: userChapter.user || "",
      chapter: userChapter.chapter || "",
      completed: userChapter.completed || false
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteUserChapter = async (userChapterId, username, chapterTitle) => {
    if (!window.confirm(`Are you sure you want to delete chapter progress for "${username}" in "${chapterTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/admin/user-chapters/${userChapterId}/delete/`);
      setUserChapters(userChapters.filter(uc => uc.id !== userChapterId));
      alert(`Chapter progress for "${username}" in "${chapterTitle}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete user chapter progress";
      alert(`Error: ${message}`);
      console.error("Delete user chapter error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new user chapter progress
        const response = await api.post("/api/courses/admin/user-chapters/create/", formData);
        setUserChapters([...userChapters, response.data]);
        setShowCreateModal(false);
        alert("User chapter progress created successfully!");
      } else if (showEditModal && editingUserChapter) {
        // Update existing user chapter progress
        const response = await api.patch(`/api/courses/admin/user-chapters/${editingUserChapter.id}/update/`, formData);
        setUserChapters(userChapters.map(uc => 
          uc.id === editingUserChapter.id ? response.data : uc
        ));
        setShowEditModal(false);
        setEditingUserChapter(null);
        alert("User chapter progress updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      console.error("Form submit error details:", data);
      
      if (data.user) {
        setFormError(Array.isArray(data.user) ? data.user[0] : String(data.user));
      } else if (data.chapter) {
        setFormError(Array.isArray(data.chapter) ? data.chapter[0] : String(data.chapter));
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
    setShowUserChapterModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUserChapter(null);
    setEditingUserChapter(null);
    setFormData({
      user: "",
      chapter: "",
      completed: false
    });
    setFormError("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : "Unknown User";
  };

  const getChapterTitle = (chapterId) => {
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter ? chapter.title : "Unknown Chapter";
  };

  const getCourseTitle = (chapterId) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return "Unknown Course";
    const course = courses.find(c => c.id === chapter.course);
    return course ? course.title : "Unknown Course";
  };

  const getChapterContent = (chapterId) => {
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter ? chapter.content : "";
  };

  // Filter and sort user chapters
  const filteredAndSortedUserChapters = userChapters
    .filter(userChapter => {
      const username = userChapter.user_username || getUserName(userChapter.user);
      const chapterTitle = userChapter.chapter_title || getChapterTitle(userChapter.chapter);
      const courseTitle = getCourseTitle(userChapter.chapter);
      
      const matchesSearch = 
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompleted = completedFilter === "" || 
        (completedFilter === "true" && userChapter.completed) ||
        (completedFilter === "false" && !userChapter.completed);
      
      const matchesChapter = chapterFilter === "" || userChapter.chapter?.toString() === chapterFilter;
      const matchesCourse = courseFilter === "" || getCourseTitle(userChapter.chapter) === courseFilter;
      const matchesUser = userFilter === "" || userChapter.user?.toString() === userFilter;
      
      return matchesSearch && matchesCompleted && matchesChapter && matchesCourse && matchesUser;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle date fields
      if (sortField === "last_accessed") {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }
      
      // Handle username sorting
      if (sortField === "user_username") {
        aVal = (a.user_username || getUserName(a.user)).toLowerCase();
        bVal = (b.user_username || getUserName(b.user)).toLowerCase();
      }
      
      // Handle chapter title sorting
      if (sortField === "chapter_title") {
        aVal = (a.chapter_title || getChapterTitle(a.chapter)).toLowerCase();
        bVal = (b.chapter_title || getChapterTitle(b.chapter)).toLowerCase();
      }
      
      // Handle course title sorting
      if (sortField === "course_title") {
        aVal = getCourseTitle(a.chapter).toLowerCase();
        bVal = getCourseTitle(b.chapter).toLowerCase();
      }
      
      // Handle string fields
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || "";
      }

      // Handle boolean fields
      if (typeof aVal === "boolean") {
        aVal = aVal ? 1 : 0;
        bVal = bVal ? 1 : 0;
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Get filtered chapters based on course selection
  const filteredChapters = courseFilter 
    ? chapters.filter(chapter => getCourseTitle(chapter.id) === courseFilter)
    : chapters;

  if (loading) {
    return (
      <div className="user-chapter-table-container">
        <h2>User Chapter Progress Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="user-chapter-table-container">
      <div className="table-header">
        <h2>User Chapter Progress Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateUserChapter}>
            Create Progress
          </button>
          <button className="button button-primary" onClick={fetchUserChapters}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={fetchUserChapters} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}

      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username, chapter title, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={completedFilter}
            onChange={(e) => setCompletedFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="true">Completed</option>
            <option value="false">In Progress</option>
          </select>
        </div>
        <div className="filter-container">
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setChapterFilter(""); // Reset chapter filter when course changes
            }}
            className="filter-select"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-container">
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Chapters</option>
            {filteredChapters.map(chapter => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
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
          Total Progress Records: {filteredAndSortedUserChapters.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="user-chapter-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("user_username")} className="sortable">
                User {sortField === "user_username" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("chapter_title")} className="sortable">
                Chapter {sortField === "chapter_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("course_title")} className="sortable">
                Course {sortField === "course_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("completed")} className="sortable">
                Status {sortField === "completed" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("last_accessed")} className="sortable">
                Last Accessed {sortField === "last_accessed" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUserChapters.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? "Loading..." : "No chapter progress records found"}
                </td>
              </tr>
            ) : (
              filteredAndSortedUserChapters.map((userChapter) => (
                <tr key={userChapter.id}>
                  <td>{userChapter.id}</td>
                  <td>
                    <span className="badge badge-user">
                      {userChapter.user_username || getUserName(userChapter.user)}
                    </span>
                  </td>
                  <td className="chapter-title-cell">
                    <div className="chapter-title-content">
                      <strong>{userChapter.chapter_title || getChapterTitle(userChapter.chapter)}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-course">
                      {getCourseTitle(userChapter.chapter)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${userChapter.completed ? 'badge-completed' : 'badge-in-progress'}`}>
                      {userChapter.completed ? "✓ Completed" : "⏳ In Progress"}
                    </span>
                  </td>
                  <td>{formatDate(userChapter.last_accessed)}</td>
                  <td className="actions-cell">
                    <button
                      className="button button-small button-info"
                      onClick={() => handleViewUserChapter(userChapter)}
                    >
                      View
                    </button>
                    <button
                      className="button button-small button-warning"
                      onClick={() => handleEditUserChapter(userChapter)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-small button-danger"
                      onClick={() => handleDeleteUserChapter(
                        userChapter.id, 
                        userChapter.user_username || getUserName(userChapter.user),
                        userChapter.chapter_title || getChapterTitle(userChapter.chapter)
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

      {/* User Chapter Detail Modal */}
      {showUserChapterModal && selectedUserChapter && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chapter Progress Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-chapter-detail-grid">
                <div className="user-chapter-detail-item">
                  <label>ID:</label>
                  <span>{selectedUserChapter.id}</span>
                </div>
                <div className="user-chapter-detail-item">
                  <label>User:</label>
                  <span className="badge badge-user">
                    {selectedUserChapter.user_username || getUserName(selectedUserChapter.user)}
                  </span>
                </div>
                <div className="user-chapter-detail-item">
                  <label>Chapter:</label>
                  <span className="badge badge-info">
                    {selectedUserChapter.chapter_title || getChapterTitle(selectedUserChapter.chapter)}
                  </span>
                </div>
                <div className="user-chapter-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-course">
                    {getCourseTitle(selectedUserChapter.chapter)}
                  </span>
                </div>
                <div className="user-chapter-detail-item">
                  <label>Status:</label>
                  <span className={`badge ${selectedUserChapter.completed ? 'badge-completed' : 'badge-in-progress'}`}>
                    {selectedUserChapter.completed ? "✓ Completed" : "⏳ In Progress"}
                  </span>
                </div>
                <div className="user-chapter-detail-item">
                  <label>Last Accessed:</label>
                  <span>{formatDate(selectedUserChapter.last_accessed)}</span>
                </div>
                {getChapterContent(selectedUserChapter.chapter) && (
                  <div className="user-chapter-detail-item full-width">
                    <label>Chapter Content:</label>
                    <div className="chapter-content-display">
                      {getChapterContent(selectedUserChapter.chapter)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditUserChapter(selectedUserChapter)}>
                Edit Progress
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit User Chapter Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Chapter Progress" : "Edit Chapter Progress"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="user-chapter-user">User *</label>
                  <select
                    id="user-chapter-user"
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
                  <label htmlFor="user-chapter-chapter">Chapter *</label>
                  <select
                    id="user-chapter-chapter"
                    value={formData.chapter}
                    onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                    required
                    disabled={formLoading || showEditModal}
                  >
                    <option value="">Select a chapter</option>
                    {chapters.map(chapter => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.title} ({getCourseTitle(chapter.id)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="user-chapter-completed"
                      checked={formData.completed}
                      onChange={(e) => setFormData({...formData, completed: e.target.checked})}
                      disabled={formLoading}
                    />
                    <label htmlFor="user-chapter-completed">Mark as Completed</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Progress" : "Update Progress")}
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