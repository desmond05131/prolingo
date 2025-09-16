import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/UserTestResultTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function UserTestResultTable() {
  const [testResults, setTestResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("attempt_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedTestResult, setSelectedTestResult] = useState(null);
  const [showTestResultModal, setShowTestResultModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTestResult, setEditingTestResult] = useState(null);
  const [passedFilter, setPassedFilter] = useState("");
  const [testFilter, setTestFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    user: "",
    test: "",
    score: 0.0,
    attempt_number: 1,
    passed: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchTestResults();
    fetchUsers();
    fetchTests();
    fetchChapters();
    fetchCourses();
  }, []);

  const fetchTestResults = async () => {
    setLoading(true);
    setError("");
    try {
      // Admin endpoint to view all user test results
      const response = await api.get("/api/courses/admin/test-results/");
      console.log("Fetched test results:", response.data);
      setTestResults(response.data || []);
    } catch (err) {
      // If admin endpoint doesn't exist, try fallback
      try {
        console.log("Admin endpoint not found, trying alternative approach...");
        const response = await api.get("/api/courses/test-results/");
        setTestResults(response.data || []);
      } catch (fallbackErr) {
        const message = fallbackErr?.response?.data?.detail || `Failed to fetch test results: ${fallbackErr.message}`;
        setError(message);
        console.error("UserTestResultTable: fetch error", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      let response;
      try {
        response = await api.get("/api/users/account/viewall/");
      } catch (firstErr) {
        try {
          response = await api.get("/api/users/");
        } catch (secondErr) {
          response = await api.get("/api/admin/users/");
        }
      }
      
      const userData = response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else if (userData && Array.isArray(userData.results)) {
        setUsers(userData.results);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await api.get("/api/courses/tests/");
      setTests(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tests:", err);
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

  const handleViewTestResult = (testResult) => {
    setSelectedTestResult(testResult);
    setShowTestResultModal(true);
  };

  const handleCreateTestResult = () => {
    setFormData({
      user: "",
      test: "",
      score: 0.0,
      attempt_number: 1,
      passed: false
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditTestResult = (testResult) => {
    setEditingTestResult(testResult);
    setFormData({
      user: testResult.user || "",
      test: testResult.test || "",
      score: testResult.score || 0.0,
      attempt_number: testResult.attempt_number || 1,
      passed: testResult.passed || false
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteTestResult = async (testResultId, username, testInfo) => {
    if (!window.confirm(`Are you sure you want to delete test result for "${username}" in "${testInfo}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/admin/test-results/${testResultId}/delete/`);
      setTestResults(testResults.filter(tr => tr.id !== testResultId));
      alert(`Test result for "${username}" in "${testInfo}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete test result";
      alert(`Error: ${message}`);
      console.error("Delete test result error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new test result
        const response = await api.post("/api/courses/admin/test-results/create/", formData);
        setTestResults([response.data, ...testResults]);
        setShowCreateModal(false);
        alert("Test result created successfully!");
      } else if (showEditModal && editingTestResult) {
        // Update existing test result
        const response = await api.patch(`/api/courses/admin/test-results/${editingTestResult.id}/update/`, formData);
        setTestResults(testResults.map(tr => 
          tr.id === editingTestResult.id ? response.data : tr
        ));
        setShowEditModal(false);
        setEditingTestResult(null);
        alert("Test result updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      console.error("Form submit error details:", data);
      
      if (data.user) {
        setFormError(Array.isArray(data.user) ? data.user[0] : String(data.user));
      } else if (data.test) {
        setFormError(Array.isArray(data.test) ? data.test[0] : String(data.test));
      } else if (data.score) {
        setFormError(Array.isArray(data.score) ? data.score[0] : String(data.score));
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
    setShowTestResultModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedTestResult(null);
    setEditingTestResult(null);
    setFormData({
      user: "",
      test: "",
      score: 0.0,
      attempt_number: 1,
      passed: false
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

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : "Unknown User";
  };

  const getTestInfo = (testId) => {
    const test = tests.find(t => t.id === testId);
    return test ? `${test.test_type} (${test.id})` : "Unknown Test";
  };

  const getChapterTitle = (testId) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return "Unknown Chapter";
    const chapter = chapters.find(c => c.id === test.chapter);
    return chapter ? chapter.title : "Unknown Chapter";
  };

  const getCourseTitle = (testId) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return "Unknown Course";
    const chapter = chapters.find(c => c.id === test.chapter);
    if (!chapter) return "Unknown Course";
    const course = courses.find(c => c.id === chapter.course);
    return course ? course.title : "Unknown Course";
  };

  const getTestPassingScore = (testId) => {
    const test = tests.find(t => t.id === testId);
    return test ? test.passing_score : 0;
  };

  const getScoreBadgeClass = (score, testId) => {
    const passingScore = getTestPassingScore(testId);
    if (score >= passingScore) {
      return "badge badge-score-pass";
    }
    return "badge badge-score-fail";
  };

  // Filter and sort test results
  const filteredAndSortedTestResults = testResults
    .filter(testResult => {
      const username = testResult.user_username || getUserName(testResult.user);
      const testInfo = getTestInfo(testResult.test);
      const chapterTitle = getChapterTitle(testResult.test);
      const courseTitle = getCourseTitle(testResult.test);
      
      const matchesSearch = 
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testResult.score?.toString().includes(searchTerm);
      
      const matchesPassed = passedFilter === "" || 
        (passedFilter === "true" && testResult.passed) ||
        (passedFilter === "false" && !testResult.passed);
      
      const matchesTest = testFilter === "" || testResult.test?.toString() === testFilter;
      const matchesChapter = chapterFilter === "" || getChapterTitle(testResult.test) === chapterFilter;
      const matchesCourse = courseFilter === "" || getCourseTitle(testResult.test) === courseFilter;
      const matchesUser = userFilter === "" || testResult.user?.toString() === userFilter;
      
      return matchesSearch && matchesPassed && matchesTest && matchesChapter && matchesCourse && matchesUser;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle date fields
      if (sortField === "attempt_date") {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }
      
      // Handle username sorting
      if (sortField === "user_username") {
        aVal = (a.user_username || getUserName(a.user)).toLowerCase();
        bVal = (b.user_username || getUserName(b.user)).toLowerCase();
      }
      
      // Handle test info sorting
      if (sortField === "test_info") {
        aVal = getTestInfo(a.test).toLowerCase();
        bVal = getTestInfo(b.test).toLowerCase();
      }
      
      // Handle chapter title sorting
      if (sortField === "chapter_title") {
        aVal = getChapterTitle(a.test).toLowerCase();
        bVal = getChapterTitle(b.test).toLowerCase();
      }
      
      // Handle course title sorting
      if (sortField === "course_title") {
        aVal = getCourseTitle(a.test).toLowerCase();
        bVal = getCourseTitle(b.test).toLowerCase();
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

  // Get filtered tests based on selections
  const filteredTests = tests.filter(test => {
    if (chapterFilter && getChapterTitle(test.id) !== chapterFilter) return false;
    if (courseFilter && getCourseTitle(test.id) !== courseFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="test-result-table-container">
        <h2>Test Result Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="test-result-table-container">
      <div className="table-header">
        <h2>Test Result Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateTestResult}>
            Create Test Result
          </button>
          <button className="button button-primary" onClick={fetchTestResults}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={fetchTestResults} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}

      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username, test, chapter, course, or score..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={passedFilter}
            onChange={(e) => setPassedFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Results</option>
            <option value="true">Passed</option>
            <option value="false">Failed</option>
          </select>
        </div>
        <div className="filter-container">
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setChapterFilter(""); // Reset filters
              setTestFilter("");
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
            onChange={(e) => {
              setChapterFilter(e.target.value);
              setTestFilter(""); // Reset test filter
            }}
            className="filter-select"
          >
            <option value="">All Chapters</option>
            {chapters.filter(chapter => 
              !courseFilter || getCourseTitle(tests.find(t => t.chapter === chapter.id)?.id) === courseFilter
            ).map(chapter => (
              <option key={chapter.id} value={chapter.title}>
                {chapter.title}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-container">
          <select
            value={testFilter}
            onChange={(e) => setTestFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Tests</option>
            {filteredTests.map(test => (
              <option key={test.id} value={test.id}>
                {getTestInfo(test.id)} - {getChapterTitle(test.id)}
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
          Total Results: {filteredAndSortedTestResults.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="test-result-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("user_username")} className="sortable">
                User {sortField === "user_username" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("test_info")} className="sortable">
                Test {sortField === "test_info" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("chapter_title")} className="sortable">
                Chapter {sortField === "chapter_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("course_title")} className="sortable">
                Course {sortField === "course_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("score")} className="sortable">
                Score {sortField === "score" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("attempt_number")} className="sortable">
                Attempt {sortField === "attempt_number" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("passed")} className="sortable">
                Result {sortField === "passed" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("attempt_date")} className="sortable">
                Date {sortField === "attempt_date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTestResults.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? "Loading..." : "No test results found"}
                </td>
              </tr>
            ) : (
              filteredAndSortedTestResults.map((testResult) => (
                <tr key={testResult.id}>
                  <td>{testResult.id}</td>
                  <td>
                    <span className="badge badge-user">
                      {testResult.user_username || getUserName(testResult.user)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-test">
                      {getTestInfo(testResult.test)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-chapter">
                      {getChapterTitle(testResult.test)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-course">
                      {getCourseTitle(testResult.test)}
                    </span>
                  </td>
                  <td>
                    <span className={getScoreBadgeClass(testResult.score, testResult.test)}>
                      {testResult.score?.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-attempt">
                      #{testResult.attempt_number}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${testResult.passed ? 'badge-passed' : 'badge-failed'}`}>
                      {testResult.passed ? "✓ Passed" : "✗ Failed"}
                    </span>
                  </td>
                  <td>{formatDate(testResult.attempt_date)}</td>
                  <td className="actions-cell">
                    <button
                      className="button button-small button-info"
                      onClick={() => handleViewTestResult(testResult)}
                    >
                      View
                    </button>
                    <button
                      className="button button-small button-warning"
                      onClick={() => handleEditTestResult(testResult)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-small button-danger"
                      onClick={() => handleDeleteTestResult(
                        testResult.id, 
                        testResult.user_username || getUserName(testResult.user),
                        getTestInfo(testResult.test)
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

      {/* Test Result Detail Modal */}
      {showTestResultModal && selectedTestResult && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Test Result Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="test-result-detail-grid">
                <div className="test-result-detail-item">
                  <label>ID:</label>
                  <span>{selectedTestResult.id}</span>
                </div>
                <div className="test-result-detail-item">
                  <label>User:</label>
                  <span className="badge badge-user">
                    {selectedTestResult.user_username || getUserName(selectedTestResult.user)}
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Test:</label>
                  <span className="badge badge-test">
                    {getTestInfo(selectedTestResult.test)}
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Chapter:</label>
                  <span className="badge badge-chapter">
                    {getChapterTitle(selectedTestResult.test)}
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-course">
                    {getCourseTitle(selectedTestResult.test)}
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Score:</label>
                  <span className={getScoreBadgeClass(selectedTestResult.score, selectedTestResult.test)}>
                    {selectedTestResult.score?.toFixed(2)}%
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Passing Score:</label>
                  <span className="badge badge-info">
                    {getTestPassingScore(selectedTestResult.test)}%
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Attempt Number:</label>
                  <span className="badge badge-attempt">
                    #{selectedTestResult.attempt_number}
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Result:</label>
                  <span className={`badge ${selectedTestResult.passed ? 'badge-passed' : 'badge-failed'}`}>
                    {selectedTestResult.passed ? "✓ Passed" : "✗ Failed"}
                  </span>
                </div>
                <div className="test-result-detail-item">
                  <label>Attempt Date:</label>
                  <span>{formatDate(selectedTestResult.attempt_date)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditTestResult(selectedTestResult)}>
                Edit Result
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Test Result Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Test Result" : "Edit Test Result"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="test-result-user">User *</label>
                  <select
                    id="test-result-user"
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
                  <label htmlFor="test-result-test">Test *</label>
                  <select
                    id="test-result-test"
                    value={formData.test}
                    onChange={(e) => setFormData({...formData, test: e.target.value})}
                    required
                    disabled={formLoading || showEditModal}
                  >
                    <option value="">Select a test</option>
                    {tests.map(test => (
                      <option key={test.id} value={test.id}>
                        {getTestInfo(test.id)} - {getChapterTitle(test.id)} ({getCourseTitle(test.id)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="test-result-score">Score (%) *</label>
                  <input
                    type="number"
                    id="test-result-score"
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: parseFloat(e.target.value) || 0.0})}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="test-result-attempt">Attempt Number</label>
                  <input
                    type="number"
                    id="test-result-attempt"
                    value={formData.attempt_number}
                    onChange={(e) => setFormData({...formData, attempt_number: parseInt(e.target.value) || 1})}
                    min="1"
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="test-result-passed"
                      checked={formData.passed}
                      onChange={(e) => setFormData({...formData, passed: e.target.checked})}
                      disabled={formLoading}
                    />
                    <label htmlFor="test-result-passed">Mark as Passed</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Result" : "Update Result")}
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