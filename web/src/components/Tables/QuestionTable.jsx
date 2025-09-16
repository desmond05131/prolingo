import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/QuestionTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function QuestionTable() {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [testFilter, setTestFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    test: "",
    question_text: "",
    question_type: "mcq",
    points: 1
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchQuestions();
    fetchTests();
    fetchChapters();
    fetchCourses();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/courses/questions/");
      setQuestions(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to fetch questions";
      setError(message);
      console.error("QuestionTable: fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await api.get("/api/courses/tests/");
      setTests(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tests for dropdown:", err);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await api.get("/api/courses/chapters/");
      setChapters(response.data || []);
    } catch (err) {
      console.error("Failed to fetch chapters for filter:", err);
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

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setShowQuestionModal(true);
  };

  const handleCreateQuestion = () => {
    setFormData({
      test: "",
      question_text: "",
      question_type: "mcq",
      points: 1
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      test: question.test || "",
      question_text: question.question_text || "",
      question_type: question.question_type || "mcq",
      points: question.points || 1
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteQuestion = async (questionId, questionText) => {
    const preview = questionText.length > 50 ? `${questionText.substring(0, 50)}...` : questionText;
    if (!window.confirm(`Are you sure you want to delete question "${preview}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/questions/${questionId}/delete/`);
      setQuestions(questions.filter(question => question.id !== questionId));
      alert("Question has been deleted successfully.");
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete question";
      alert(`Error: ${message}`);
      console.error("Delete question error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new question
        const response = await api.post("/api/courses/questions/create/", formData);
        setQuestions([...questions, response.data]);
        setShowCreateModal(false);
        alert("Question created successfully!");
      } else if (showEditModal && editingQuestion) {
        // Update existing question
        const response = await api.patch(`/api/courses/questions/${editingQuestion.id}/update/`, formData);
        setQuestions(questions.map(question => 
          question.id === editingQuestion.id ? response.data : question
        ));
        setShowEditModal(false);
        setEditingQuestion(null);
        alert("Question updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      if (data.test) {
        setFormError(Array.isArray(data.test) ? data.test[0] : String(data.test));
      } else if (data.question_text) {
        setFormError(Array.isArray(data.question_text) ? data.question_text[0] : String(data.question_text));
      } else if (data.question_type) {
        setFormError(Array.isArray(data.question_type) ? data.question_type[0] : String(data.question_type));
      } else if (data.points) {
        setFormError(Array.isArray(data.points) ? data.points[0] : String(data.points));
      } else {
        setFormError("Operation failed. Please try again.");
      }
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const closeAllModals = () => {
    setShowQuestionModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedQuestion(null);
    setEditingQuestion(null);
    setFormData({
      test: "",
      question_text: "",
      question_type: "mcq",
      points: 1
    });
    setFormError("");
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

  const getQuestionTypeBadgeClass = (questionType) => {
    switch (questionType) {
      case "mcq": return "badge badge-mcq";
      case "short": return "badge badge-short";
      case "coding": return "badge badge-coding";
      case "fill": return "badge badge-fill";
      default: return "badge badge-default";
    }
  };

  // Filter and sort questions
  const filteredAndSortedQuestions = questions
    .filter(question => {
      const testInfo = getTestInfo(question.test);
      const chapterTitle = getChapterTitle(question.test);
      const courseTitle = getCourseTitle(question.test);
      
      const matchesSearch = 
        question.question_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.question_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTest = testFilter === "" || question.test?.toString() === testFilter;
      const matchesChapter = chapterFilter === "" || getChapterTitle(question.test) === chapterFilter;
      const matchesCourse = courseFilter === "" || getCourseTitle(question.test) === courseFilter;
      
      return matchesSearch && matchesTest && matchesChapter && matchesCourse;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
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

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Get filtered tests based on chapter/course selection
  const filteredTests = tests.filter(test => {
    if (chapterFilter && getChapterTitle(test.id) !== chapterFilter) return false;
    if (courseFilter && getCourseTitle(test.id) !== courseFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="question-table-container">
        <h2>Question Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="question-table-container">
      <div className="table-header">
        <h2>Question Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateQuestion}>
            Create Question
          </button>
          <button className="button button-primary" onClick={fetchQuestions}>
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
            placeholder="Search questions by text, type, test, chapter, or course..."
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
              setTestFilter(""); // Reset test filter when course changes
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
              setTestFilter(""); // Reset test filter when chapter changes
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
        <div className="table-stats">
          Total Questions: {filteredAndSortedQuestions.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="question-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("question_type")} className="sortable">
                Type {sortField === "question_type" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Question Text</th>
              <th onClick={() => handleSort("test_info")} className="sortable">
                Test {sortField === "test_info" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("chapter_title")} className="sortable">
                Chapter {sortField === "chapter_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("course_title")} className="sortable">
                Course {sortField === "course_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("points")} className="sortable">
                Points {sortField === "points" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedQuestions.map((question) => (
              <tr key={question.id}>
                <td>{question.id}</td>
                <td>
                  <span className={getQuestionTypeBadgeClass(question.question_type)}>
                    {question.question_type}
                  </span>
                </td>
                <td className="question-text-cell">
                  <div className="question-text-preview">
                    {question.question_text.length > 80 
                      ? `${question.question_text.substring(0, 80)}...` 
                      : question.question_text}
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">
                    {getTestInfo(question.test)}
                  </span>
                </td>
                <td>
                  <span className="badge badge-secondary">
                    {getChapterTitle(question.test)}
                  </span>
                </td>
                <td>
                  <span className="badge badge-primary">
                    {getCourseTitle(question.test)}
                  </span>
                </td>
                <td>
                  <span className="points-badge">
                    {question.points}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info">
                    {question.options?.length || 0}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="button button-small button-info"
                    onClick={() => handleViewQuestion(question)}
                  >
                    View
                  </button>
                  <button
                    className="button button-small button-warning"
                    onClick={() => handleEditQuestion(question)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDeleteQuestion(question.id, question.question_text)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedQuestions.length === 0 && !loading && (
        <div className="no-data">
          {searchTerm || testFilter || chapterFilter || courseFilter ? "No questions found matching your criteria." : "No questions found."}
        </div>
      )}

      {/* Question Detail Modal */}
      {showQuestionModal && selectedQuestion && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Question Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="question-detail-grid">
                <div className="question-detail-item">
                  <label>ID:</label>
                  <span>{selectedQuestion.id}</span>
                </div>
                <div className="question-detail-item">
                  <label>Type:</label>
                  <span className={getQuestionTypeBadgeClass(selectedQuestion.question_type)}>
                    {selectedQuestion.question_type}
                  </span>
                </div>
                <div className="question-detail-item">
                  <label>Test:</label>
                  <span className="badge badge-info">
                    {getTestInfo(selectedQuestion.test)}
                  </span>
                </div>
                <div className="question-detail-item">
                  <label>Chapter:</label>
                  <span className="badge badge-secondary">
                    {getChapterTitle(selectedQuestion.test)}
                  </span>
                </div>
                <div className="question-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-primary">
                    {getCourseTitle(selectedQuestion.test)}
                  </span>
                </div>
                <div className="question-detail-item">
                  <label>Points:</label>
                  <span className="points-badge">{selectedQuestion.points}</span>
                </div>
                <div className="question-detail-item full-width">
                  <label>Question Text:</label>
                  <div className="question-text-display">
                    {selectedQuestion.question_text}
                  </div>
                </div>
                {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                  <div className="question-detail-item full-width">
                    <label>Options:</label>
                    <div className="options-list">
                      {selectedQuestion.options.map((option, index) => (
                        <div key={option.id} className={`option-item ${option.is_correct ? 'correct-option' : ''}`}>
                          <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                          <span className="option-text">{option.option_text}</span>
                          {option.is_correct && (
                            <span className="badge badge-correct">Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditQuestion(selectedQuestion)}>
                Edit Question
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Question Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Question" : "Edit Question"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="question-test">Test *</label>
                  <select
                    id="question-test"
                    value={formData.test}
                    onChange={(e) => setFormData({...formData, test: e.target.value})}
                    required
                    disabled={formLoading}
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
                  <label htmlFor="question-type">Question Type *</label>
                  <select
                    id="question-type"
                    value={formData.question_type}
                    onChange={(e) => setFormData({...formData, question_type: e.target.value})}
                    required
                    disabled={formLoading}
                  >
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="short">Short Answer</option>
                    <option value="coding">Coding</option>
                    <option value="fill">Fill in the Blank</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="question-points">Points</label>
                  <input
                    type="number"
                    id="question-points"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 1})}
                    min="1"
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="question-text">Question Text *</label>
                  <textarea
                    id="question-text"
                    value={formData.question_text}
                    onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                    rows="6"
                    placeholder="Enter the question text here..."
                    required
                    disabled={formLoading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Question" : "Update Question")}
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