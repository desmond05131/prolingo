import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/CourseTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/courses/courses/");
      setCourses(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to fetch courses";
      setError(message);
      console.error("CourseTable: fetch error", err);
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

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleCreateCourse = () => {
    setFormData({ title: "", description: "", status: "draft" });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      status: course.status || "draft"
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/courses/${courseId}/delete/`);
      setCourses(courses.filter(course => course.id !== courseId));
      alert(`Course "${title}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete course";
      alert(`Error: ${message}`);
      console.error("Delete course error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new course
        const response = await api.post("/api/courses/courses/create/", formData);
        setCourses([response.data, ...courses]);
        setShowCreateModal(false);
        alert("Course created successfully!");
      } else if (showEditModal && editingCourse) {
        // Update existing course
        const response = await api.patch(`/api/courses/courses/${editingCourse.id}/update/`, formData);
        setCourses(courses.map(course => 
          course.id === editingCourse.id ? response.data : course
        ));
        setShowEditModal(false);
        setEditingCourse(null);
        alert("Course updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      if (data.title) {
        setFormError(Array.isArray(data.title) ? data.title[0] : String(data.title));
      } else if (data.description) {
        setFormError(Array.isArray(data.description) ? data.description[0] : String(data.description));
      } else {
        setFormError("Operation failed. Please try again.");
      }
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const closeAllModals = () => {
    setShowCourseModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedCourse(null);
    setEditingCourse(null);
    setFormData({ title: "", description: "", status: "draft" });
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
      case "active": return "badge badge-active";
      case "archived": return "badge badge-archived";
      case "draft": return "badge badge-draft";
      default: return "badge badge-default";
    }
  };

  // Filter and sort courses
  const filteredAndSortedCourses = courses
    .filter(course =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.created_by_username?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle date fields
      if (sortField === "created_date") {
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
      <div className="course-table-container">
        <h2>Course Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="course-table-container">
      <div className="table-header">
        <h2>Course Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateCourse}>
            Create Course
          </button>
          <button className="button button-primary" onClick={fetchCourses}>
            Refresh
          </button>
        </div>
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
            placeholder="Search courses by title, description, status, or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="table-stats">
          Total Courses: {filteredAndSortedCourses.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("title")} className="sortable">
                Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("status")} className="sortable">
                Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("created_by_username")} className="sortable">
                Creator {sortField === "created_by_username" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("created_date")} className="sortable">
                Created {sortField === "created_date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Chapters</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td className="title-cell">
                  <div className="title-content">
                    <strong>{course.title}</strong>
                    {course.description && (
                      <div className="description-preview">
                        {course.description.length > 100 
                          ? `${course.description.substring(0, 100)}...` 
                          : course.description}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={getStatusBadgeClass(course.status)}>
                    {course.status}
                  </span>
                </td>
                <td>{course.created_by_username || "Unknown"}</td>
                <td>{formatDate(course.created_date)}</td>
                <td>
                  <span className="badge badge-info">
                    {course.chapters?.length || 0} chapters
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="button button-small button-info"
                    onClick={() => handleViewCourse(course)}
                  >
                    View
                  </button>
                  <button
                    className="button button-small button-warning"
                    onClick={() => handleEditCourse(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedCourses.length === 0 && !loading && (
        <div className="no-data">
          {searchTerm ? "No courses found matching your search." : "No courses found."}
        </div>
      )}

      {/* Course Detail Modal */}
      {showCourseModal && selectedCourse && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Course Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="course-detail-grid">
                <div className="course-detail-item">
                  <label>ID:</label>
                  <span>{selectedCourse.id}</span>
                </div>
                <div className="course-detail-item">
                  <label>Title:</label>
                  <span>{selectedCourse.title}</span>
                </div>
                <div className="course-detail-item">
                  <label>Status:</label>
                  <span className={getStatusBadgeClass(selectedCourse.status)}>
                    {selectedCourse.status}
                  </span>
                </div>
                <div className="course-detail-item">
                  <label>Creator:</label>
                  <span>{selectedCourse.created_by_username}</span>
                </div>
                <div className="course-detail-item">
                  <label>Created Date:</label>
                  <span>{formatDate(selectedCourse.created_date)}</span>
                </div>
                <div className="course-detail-item">
                  <label>Chapters:</label>
                  <span>{selectedCourse.chapters?.length || 0}</span>
                </div>
                <div className="course-detail-item full-width">
                  <label>Description:</label>
                  <div className="description-content">
                    {selectedCourse.description || "No description provided"}
                  </div>
                </div>
                {selectedCourse.chapters && selectedCourse.chapters.length > 0 && (
                  <div className="course-detail-item full-width">
                    <label>Chapter List:</label>
                    <div className="chapters-list">
                      {selectedCourse.chapters.map((chapter, index) => (
                        <div key={chapter.id} className="chapter-item">
                          <strong>{index + 1}. {chapter.title}</strong>
                          {chapter.tests && chapter.tests.length > 0 && (
                            <span className="badge badge-secondary ml-2">
                              {chapter.tests.length} test(s)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditCourse(selectedCourse)}>
                Edit Course
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Course Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Course" : "Edit Course"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="course-title">Title *</label>
                  <input
                    type="text"
                    id="course-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="course-description">Description</label>
                  <textarea
                    id="course-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="course-status">Status</label>
                  <select
                    id="course-status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    disabled={formLoading}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Course" : "Update Course")}
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