import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/ChapterTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function ChapterTable() {
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("order_index");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [courseFilter, setCourseFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    course: "",
    title: "",
    content: "",
    order_index: 0
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchChapters();
    fetchCourses();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/courses/chapters/");
      setChapters(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to fetch chapters";
      setError(message);
      console.error("ChapterTable: fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/courses/");
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

  const handleViewChapter = (chapter) => {
    setSelectedChapter(chapter);
    setShowChapterModal(true);
  };

  const handleCreateChapter = () => {
    setFormData({ 
      course: "", 
      title: "", 
      content: "", 
      order_index: 0 
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setFormData({
      course: chapter.course || "",
      title: chapter.title || "",
      content: chapter.content || "",
      order_index: chapter.order_index || 0
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteChapter = async (chapterId, title) => {
    if (!window.confirm(`Are you sure you want to delete chapter "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/chapters/${chapterId}/delete/`);
      setChapters(chapters.filter(chapter => chapter.id !== chapterId));
      alert(`Chapter "${title}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete chapter";
      alert(`Error: ${message}`);
      console.error("Delete chapter error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new chapter
        const response = await api.post("/api/courses/chapters/create/", formData);
        setChapters([...chapters, response.data]);
        setShowCreateModal(false);
        alert("Chapter created successfully!");
      } else if (showEditModal && editingChapter) {
        // Update existing chapter
        const response = await api.patch(`/api/courses/chapters/${editingChapter.id}/update/`, formData);
        setChapters(chapters.map(chapter => 
          chapter.id === editingChapter.id ? response.data : chapter
        ));
        setShowEditModal(false);
        setEditingChapter(null);
        alert("Chapter updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      if (data.title) {
        setFormError(Array.isArray(data.title) ? data.title[0] : String(data.title));
      } else if (data.course) {
        setFormError(Array.isArray(data.course) ? data.course[0] : String(data.course));
      } else if (data.order_index) {
        setFormError(Array.isArray(data.order_index) ? data.order_index[0] : String(data.order_index));
      } else {
        setFormError("Operation failed. Please try again.");
      }
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const closeAllModals = () => {
    setShowChapterModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedChapter(null);
    setEditingChapter(null);
    setFormData({ course: "", title: "", content: "", order_index: 0 });
    setFormError("");
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  // Filter and sort chapters
  const filteredAndSortedChapters = chapters
    .filter(chapter => {
      const matchesSearch = 
        chapter.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCourseTitle(chapter.course).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = courseFilter === "" || chapter.course?.toString() === courseFilter;
      
      return matchesSearch && matchesCourse;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle course title sorting
      if (sortField === "course_title") {
        aVal = getCourseTitle(a.course).toLowerCase();
        bVal = getCourseTitle(b.course).toLowerCase();
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
      <div className="chapter-table-container">
        <h2>Chapter Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="chapter-table-container">
      <div className="table-header">
        <h2>Chapter Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateChapter}>
            Create Chapter
          </button>
          <button className="button button-primary" onClick={fetchChapters}>
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
            placeholder="Search chapters by title, content, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
        <div className="table-stats">
          Total Chapters: {filteredAndSortedChapters.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="chapter-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("title")} className="sortable">
                Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("course_title")} className="sortable">
                Course {sortField === "course_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("order_index")} className="sortable">
                Order {sortField === "order_index" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Content Preview</th>
              <th>Tests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedChapters.map((chapter) => (
              <tr key={chapter.id}>
                <td>{chapter.id}</td>
                <td className="title-cell">
                  <strong>{chapter.title}</strong>
                </td>
                <td>
                  <span className="badge badge-info">
                    {getCourseTitle(chapter.course)}
                  </span>
                </td>
                <td>
                  <span className="order-badge">
                    #{chapter.order_index}
                  </span>
                </td>
                <td className="content-preview-cell">
                  {chapter.content ? (
                    <div className="content-preview">
                      {chapter.content.length > 80 
                        ? `${chapter.content.substring(0, 80)}...` 
                        : chapter.content}
                    </div>
                  ) : (
                    <span className="no-content">No content</span>
                  )}
                </td>
                <td>
                  <span className="badge badge-secondary">
                    {chapter.tests?.length || 0} test(s)
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="button button-small button-info"
                    onClick={() => handleViewChapter(chapter)}
                  >
                    View
                  </button>
                  <button
                    className="button button-small button-warning"
                    onClick={() => handleEditChapter(chapter)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedChapters.length === 0 && !loading && (
        <div className="no-data">
          {searchTerm || courseFilter ? "No chapters found matching your criteria." : "No chapters found."}
        </div>
      )}

      {/* Chapter Detail Modal */}
      {showChapterModal && selectedChapter && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chapter Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="chapter-detail-grid">
                <div className="chapter-detail-item">
                  <label>ID:</label>
                  <span>{selectedChapter.id}</span>
                </div>
                <div className="chapter-detail-item">
                  <label>Title:</label>
                  <span>{selectedChapter.title}</span>
                </div>
                <div className="chapter-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-info">
                    {getCourseTitle(selectedChapter.course)}
                  </span>
                </div>
                <div className="chapter-detail-item">
                  <label>Order Index:</label>
                  <span className="order-badge">#{selectedChapter.order_index}</span>
                </div>
                <div className="chapter-detail-item">
                  <label>Tests:</label>
                  <span>{selectedChapter.tests?.length || 0}</span>
                </div>
                <div className="chapter-detail-item full-width">
                  <label>Content:</label>
                  <div className="content-display">
                    {selectedChapter.content || "No content provided"}
                  </div>
                </div>
                {selectedChapter.tests && selectedChapter.tests.length > 0 && (
                  <div className="chapter-detail-item full-width">
                    <label>Test List:</label>
                    <div className="tests-list">
                      {selectedChapter.tests.map((test, index) => (
                        <div key={test.id} className="test-item">
                          <strong>{index + 1}. {test.test_type}</strong>
                          {test.questions && test.questions.length > 0 && (
                            <span className="badge badge-secondary ml-2">
                              {test.questions.length} question(s)
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
              <button className="button button-warning" onClick={() => handleEditChapter(selectedChapter)}>
                Edit Chapter
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Chapter Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Chapter" : "Edit Chapter"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="chapter-course">Course *</label>
                  <select
                    id="chapter-course"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    required
                    disabled={formLoading}
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
                  <label htmlFor="chapter-title">Title *</label>
                  <input
                    type="text"
                    id="chapter-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chapter-order">Order Index</label>
                  <input
                    type="number"
                    id="chapter-order"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                    min="0"
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chapter-content">Content</label>
                  <textarea
                    id="chapter-content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows="6"
                    placeholder="Enter chapter content (lesson text, media links, etc.)"
                    disabled={formLoading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Chapter" : "Update Chapter")}
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