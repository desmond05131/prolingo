import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/TestTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function TestTable() {
  const [tests, setTests] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [chapterFilter, setChapterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    chapter: "",
    test_type: "quiz",
    repeatable: false,
    max_attempts: 1,
    passing_score: 0.0,
    structure: "objective"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchTests();
    fetchChapters();
    fetchCourses();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/courses/tests/");
      setTests(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to fetch tests";
      setError(message);
      console.error("TestTable: fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await api.get("/api/courses/chapters/");
      setChapters(response.data || []);
    } catch (err) {
      console.error("Failed to fetch chapters for dropdown:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/courses/");
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses for filter:", err);
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

  const handleViewTest = (test) => {
    setSelectedTest(test);
    setShowTestModal(true);
  };

  const handleCreateTest = () => {
    setFormData({
      chapter: "",
      test_type: "quiz",
      repeatable: false,
      max_attempts: 1,
      passing_score: 0.0,
      structure: "objective"
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setFormData({
      chapter: test.chapter || "",
      test_type: test.test_type || "quiz",
      repeatable: test.repeatable || false,
      max_attempts: test.max_attempts || 1,
      passing_score: test.passing_score || 0.0,
      structure: test.structure || "objective"
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteTest = async (testId, testType) => {
    if (!window.confirm(`Are you sure you want to delete test "${testType}" (ID: ${testId})? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/tests/${testId}/delete/`);
      setTests(tests.filter(test => test.id !== testId));
      alert(`Test "${testType}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete test";
      alert(`Error: ${message}`);
      console.error("Delete test error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new test
        const response = await api.post("/api/courses/tests/create/", formData);
        setTests([...tests, response.data]);
        setShowCreateModal(false);
        alert("Test created successfully!");
      } else if (showEditModal && editingTest) {
        // Update existing test
        const response = await api.patch(`/api/courses/tests/${editingTest.id}/update/`, formData);
        setTests(tests.map(test => 
          test.id === editingTest.id ? response.data : test
        ));
        setShowEditModal(false);
        setEditingTest(null);
        alert("Test updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      if (data.chapter) {
        setFormError(Array.isArray(data.chapter) ? data.chapter[0] : String(data.chapter));
      } else if (data.test_type) {
        setFormError(Array.isArray(data.test_type) ? data.test_type[0] : String(data.test_type));
      } else if (data.max_attempts) {
        setFormError(Array.isArray(data.max_attempts) ? data.max_attempts[0] : String(data.max_attempts));
      } else if (data.passing_score) {
        setFormError(Array.isArray(data.passing_score) ? data.passing_score[0] : String(data.passing_score));
      } else {
        setFormError("Operation failed. Please try again.");
      }
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const closeAllModals = () => {
    setShowTestModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedTest(null);
    setEditingTest(null);
    setFormData({
      chapter: "",
      test_type: "quiz",
      repeatable: false,
      max_attempts: 1,
      passing_score: 0.0,
      structure: "objective"
    });
    setFormError("");
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

  const getTestTypeBadgeClass = (testType) => {
    switch (testType) {
      case "quiz": return "badge badge-quiz";
      case "coding": return "badge badge-coding";
      case "objective": return "badge badge-objective";
      default: return "badge badge-default";
    }
  };

  const getStructureBadgeClass = (structure) => {
    switch (structure) {
      case "objective": return "badge badge-structure-obj";
      case "no-repeat": return "badge badge-structure-no-repeat";
      case "custom": return "badge badge-structure-custom";
      default: return "badge badge-default";
    }
  };

  // Filter and sort tests
  const filteredAndSortedTests = tests
    .filter(test => {
      const chapterTitle = getChapterTitle(test.chapter);
      const courseTitle = getCourseTitle(test.chapter);
      
      const matchesSearch = 
        test.test_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.structure?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesChapter = chapterFilter === "" || test.chapter?.toString() === chapterFilter;
      const matchesCourse = courseFilter === "" || getCourseTitle(test.chapter) === courseFilter;
      
      return matchesSearch && matchesChapter && matchesCourse;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle chapter title sorting
      if (sortField === "chapter_title") {
        aVal = getChapterTitle(a.chapter).toLowerCase();
        bVal = getChapterTitle(b.chapter).toLowerCase();
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

  // Get filtered chapters based on course selection
  const filteredChapters = courseFilter 
    ? chapters.filter(chapter => chapter.course?.toString() === courseFilter)
    : chapters;

  if (loading) {
    return (
      <div className="test-table-container">
        <h2>Test Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="test-table-container">
      <div className="table-header">
        <h2>Test Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateTest}>
            Create Test
          </button>
          <button className="button button-primary" onClick={fetchTests}>
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
            placeholder="Search tests by type, structure, chapter, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
              <option key={course.id} value={course.id}>
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
        <div className="table-stats">
          Total Tests: {filteredAndSortedTests.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="test-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("test_type")} className="sortable">
                Type {sortField === "test_type" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("chapter_title")} className="sortable">
                Chapter {sortField === "chapter_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("course_title")} className="sortable">
                Course {sortField === "course_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("structure")} className="sortable">
                Structure {sortField === "structure" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("max_attempts")} className="sortable">
                Max Attempts {sortField === "max_attempts" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("passing_score")} className="sortable">
                Passing Score {sortField === "passing_score" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Repeatable</th>
              <th>Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTests.map((test) => (
              <tr key={test.id}>
                <td>{test.id}</td>
                <td>
                  <span className={getTestTypeBadgeClass(test.test_type)}>
                    {test.test_type}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info">
                    {getChapterTitle(test.chapter)}
                  </span>
                </td>
                <td>
                  <span className="badge badge-secondary">
                    {getCourseTitle(test.chapter)}
                  </span>
                </td>
                <td>
                  <span className={getStructureBadgeClass(test.structure)}>
                    {test.structure}
                  </span>
                </td>
                <td>
                  <span className="attempts-badge">
                    {test.max_attempts}
                  </span>
                </td>
                <td>
                  <span className="score-badge">
                    {test.passing_score}%
                  </span>
                </td>
                <td>
                  <span className={`badge ${test.repeatable ? 'badge-yes' : 'badge-no'}`}>
                    {test.repeatable ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info">
                    {test.questions?.length || 0}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="button button-small button-info"
                    onClick={() => handleViewTest(test)}
                  >
                    View
                  </button>
                  <button
                    className="button button-small button-warning"
                    onClick={() => handleEditTest(test)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDeleteTest(test.id, test.test_type)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedTests.length === 0 && !loading && (
        <div className="no-data">
          {searchTerm || chapterFilter || courseFilter ? "No tests found matching your criteria." : "No tests found."}
        </div>
      )}

      {/* Test Detail Modal */}
      {showTestModal && selectedTest && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Test Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="test-detail-grid">
                <div className="test-detail-item">
                  <label>ID:</label>
                  <span>{selectedTest.id}</span>
                </div>
                <div className="test-detail-item">
                  <label>Type:</label>
                  <span className={getTestTypeBadgeClass(selectedTest.test_type)}>
                    {selectedTest.test_type}
                  </span>
                </div>
                <div className="test-detail-item">
                  <label>Chapter:</label>
                  <span className="badge badge-info">
                    {getChapterTitle(selectedTest.chapter)}
                  </span>
                </div>
                <div className="test-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-secondary">
                    {getCourseTitle(selectedTest.chapter)}
                  </span>
                </div>
                <div className="test-detail-item">
                  <label>Structure:</label>
                  <span className={getStructureBadgeClass(selectedTest.structure)}>
                    {selectedTest.structure}
                  </span>
                </div>
                <div className="test-detail-item">
                  <label>Repeatable:</label>
                  <span className={`badge ${selectedTest.repeatable ? 'badge-yes' : 'badge-no'}`}>
                    {selectedTest.repeatable ? "Yes" : "No"}
                  </span>
                </div>
                <div className="test-detail-item">
                  <label>Max Attempts:</label>
                  <span className="attempts-badge">{selectedTest.max_attempts}</span>
                </div>
                <div className="test-detail-item">
                  <label>Passing Score:</label>
                  <span className="score-badge">{selectedTest.passing_score}%</span>
                </div>
                <div className="test-detail-item">
                  <label>Questions:</label>
                  <span>{selectedTest.questions?.length || 0}</span>
                </div>
                {selectedTest.questions && selectedTest.questions.length > 0 && (
                  <div className="test-detail-item full-width">
                    <label>Question List:</label>
                    <div className="questions-list">
                      {selectedTest.questions.map((question, index) => (
                        <div key={question.id} className="question-item">
                          <strong>{index + 1}. {question.question_type}</strong>
                          <span className="badge badge-secondary ml-2">
                            {question.points} point(s)
                          </span>
                          <div className="question-text">
                            {question.question_text.length > 100 
                              ? `${question.question_text.substring(0, 100)}...` 
                              : question.question_text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditTest(selectedTest)}>
                Edit Test
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Test Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Test" : "Edit Test"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="test-chapter">Chapter *</label>
                  <select
                    id="test-chapter"
                    value={formData.chapter}
                    onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                    required
                    disabled={formLoading}
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
                  <label htmlFor="test-type">Test Type *</label>
                  <select
                    id="test-type"
                    value={formData.test_type}
                    onChange={(e) => setFormData({...formData, test_type: e.target.value})}
                    required
                    disabled={formLoading}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="coding">Coding</option>
                    <option value="objective">Objective</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="test-structure">Structure</label>
                  <select
                    id="test-structure"
                    value={formData.structure}
                    onChange={(e) => setFormData({...formData, structure: e.target.value})}
                    disabled={formLoading}
                  >
                    <option value="objective">Objective</option>
                    <option value="no-repeat">No Repeat</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="test-repeatable"
                      checked={formData.repeatable}
                      onChange={(e) => setFormData({...formData, repeatable: e.target.checked})}
                      disabled={formLoading}
                    />
                    <label htmlFor="test-repeatable">Repeatable</label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="test-max-attempts">Max Attempts</label>
                  <input
                    type="number"
                    id="test-max-attempts"
                    value={formData.max_attempts}
                    onChange={(e) => setFormData({...formData, max_attempts: parseInt(e.target.value) || 1})}
                    min="1"
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="test-passing-score">Passing Score (%)</label>
                  <input
                    type="number"
                    id="test-passing-score"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({...formData, passing_score: parseFloat(e.target.value) || 0.0})}
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={formLoading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Test" : "Update Test")}
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