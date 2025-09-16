import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/OptionTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function OptionTable() {
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [questionFilter, setQuestionFilter] = useState("");
  const [testFilter, setTestFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    question: "",
    option_text: "",
    is_correct: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchOptions();
    fetchQuestions();
    fetchTests();
    fetchChapters();
    fetchCourses();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/courses/options/");
      setOptions(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to fetch options";
      setError(message);
      console.error("OptionTable: fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/api/courses/questions/");
      setQuestions(response.data || []);
    } catch (err) {
      console.error("Failed to fetch questions for dropdown:", err);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await api.get("/api/courses/tests/");
      setTests(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tests for filter:", err);
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

  const handleViewOption = (option) => {
    setSelectedOption(option);
    setShowOptionModal(true);
  };

  const handleCreateOption = () => {
    setFormData({
      question: "",
      option_text: "",
      is_correct: false
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditOption = (option) => {
    setEditingOption(option);
    setFormData({
      question: option.question || "",
      option_text: option.option_text || "",
      is_correct: option.is_correct || false
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteOption = async (optionId, optionText) => {
    const preview = optionText.length > 50 ? `${optionText.substring(0, 50)}...` : optionText;
    if (!window.confirm(`Are you sure you want to delete option "${preview}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/options/${optionId}/delete/`);
      setOptions(options.filter(option => option.id !== optionId));
      alert("Option has been deleted successfully.");
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete option";
      alert(`Error: ${message}`);
      console.error("Delete option error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new option
        const response = await api.post("/api/courses/options/create/", formData);
        setOptions([...options, response.data]);
        setShowCreateModal(false);
        alert("Option created successfully!");
      } else if (showEditModal && editingOption) {
        // Update existing option
        const response = await api.patch(`/api/courses/options/${editingOption.id}/update/`, formData);
        setOptions(options.map(option => 
          option.id === editingOption.id ? response.data : option
        ));
        setShowEditModal(false);
        setEditingOption(null);
        alert("Option updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      if (data.question) {
        setFormError(Array.isArray(data.question) ? data.question[0] : String(data.question));
      } else if (data.option_text) {
        setFormError(Array.isArray(data.option_text) ? data.option_text[0] : String(data.option_text));
      } else {
        setFormError("Operation failed. Please try again.");
      }
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const closeAllModals = () => {
    setShowOptionModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedOption(null);
    setEditingOption(null);
    setFormData({
      question: "",
      option_text: "",
      is_correct: false
    });
    setFormError("");
  };

  const getQuestionInfo = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question ? `Q${question.id} (${question.question_type})` : "Unknown Question";
  };

  const getQuestionText = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.question_text : "Unknown Question Text";
  };

  const getTestInfo = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return "Unknown Test";
    const test = tests.find(t => t.id === question.test);
    return test ? `${test.test_type} (${test.id})` : "Unknown Test";
  };

  const getChapterTitle = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return "Unknown Chapter";
    const test = tests.find(t => t.id === question.test);
    if (!test) return "Unknown Chapter";
    const chapter = chapters.find(c => c.id === test.chapter);
    return chapter ? chapter.title : "Unknown Chapter";
  };

  const getCourseTitle = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return "Unknown Course";
    const test = tests.find(t => t.id === question.test);
    if (!test) return "Unknown Course";
    const chapter = chapters.find(c => c.id === test.chapter);
    if (!chapter) return "Unknown Course";
    const course = courses.find(c => c.id === chapter.course);
    return course ? course.title : "Unknown Course";
  };

  // Filter and sort options
  const filteredAndSortedOptions = options
    .filter(option => {
      const questionInfo = getQuestionInfo(option.question);
      const questionText = getQuestionText(option.question);
      const testInfo = getTestInfo(option.question);
      const chapterTitle = getChapterTitle(option.question);
      const courseTitle = getCourseTitle(option.question);
      
      const matchesSearch = 
        option.option_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        questionInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesQuestion = questionFilter === "" || option.question?.toString() === questionFilter;
      const matchesTest = testFilter === "" || getTestInfo(option.question) === testFilter;
      const matchesChapter = chapterFilter === "" || getChapterTitle(option.question) === chapterFilter;
      const matchesCourse = courseFilter === "" || getCourseTitle(option.question) === courseFilter;
      
      return matchesSearch && matchesQuestion && matchesTest && matchesChapter && matchesCourse;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle question info sorting
      if (sortField === "question_info") {
        aVal = getQuestionInfo(a.question).toLowerCase();
        bVal = getQuestionInfo(b.question).toLowerCase();
      }
      
      // Handle test info sorting
      if (sortField === "test_info") {
        aVal = getTestInfo(a.question).toLowerCase();
        bVal = getTestInfo(b.question).toLowerCase();
      }
      
      // Handle chapter title sorting
      if (sortField === "chapter_title") {
        aVal = getChapterTitle(a.question).toLowerCase();
        bVal = getChapterTitle(b.question).toLowerCase();
      }
      
      // Handle course title sorting
      if (sortField === "course_title") {
        aVal = getCourseTitle(a.question).toLowerCase();
        bVal = getCourseTitle(b.question).toLowerCase();
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

  // Get filtered questions based on filters
  const filteredQuestions = questions.filter(question => {
    if (testFilter && getTestInfo(question.id) !== testFilter) return false;
    if (chapterFilter && getChapterTitle(question.id) !== chapterFilter) return false;
    if (courseFilter && getCourseTitle(question.id) !== courseFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="option-table-container">
        <h2>Option Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="option-table-container">
      <div className="table-header">
        <h2>Option Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateOption}>
            Create Option
          </button>
          <button className="button button-primary" onClick={fetchOptions}>
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
            placeholder="Search options by text, question, test, chapter, or course..."
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
              setChapterFilter(""); // Reset filters when course changes
              setTestFilter("");
              setQuestionFilter("");
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
              setTestFilter(""); // Reset test and question filters
              setQuestionFilter("");
            }}
            className="filter-select"
          >
            <option value="">All Chapters</option>
            {chapters.filter(chapter => 
              !courseFilter || getCourseTitle(questions.find(q => tests.find(t => t.chapter === chapter.id))?.id) === courseFilter
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
            onChange={(e) => {
              setTestFilter(e.target.value);
              setQuestionFilter(""); // Reset question filter
            }}
            className="filter-select"
          >
            <option value="">All Tests</option>
            {tests.filter(test => {
              if (chapterFilter && getChapterTitle(questions.find(q => q.test === test.id)?.id) !== chapterFilter) return false;
              if (courseFilter && getCourseTitle(questions.find(q => q.test === test.id)?.id) !== courseFilter) return false;
              return true;
            }).map(test => (
              <option key={test.id} value={getTestInfo(questions.find(q => q.test === test.id)?.id)}>
                {getTestInfo(questions.find(q => q.test === test.id)?.id)} - {getChapterTitle(questions.find(q => q.test === test.id)?.id)}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-container">
          <select
            value={questionFilter}
            onChange={(e) => setQuestionFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Questions</option>
            {filteredQuestions.map(question => (
              <option key={question.id} value={question.id}>
                {getQuestionInfo(question.id)} - {question.question_text.substring(0, 50)}...
              </option>
            ))}
          </select>
        </div>
        <div className="table-stats">
          Total Options: {filteredAndSortedOptions.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="option-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Option Text</th>
              <th onClick={() => handleSort("question_info")} className="sortable">
                Question {sortField === "question_info" && (sortDirection === "asc" ? "↑" : "↓")}
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
              <th onClick={() => handleSort("is_correct")} className="sortable">
                Correct {sortField === "is_correct" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOptions.map((option) => (
              <tr key={option.id}>
                <td>{option.id}</td>
                <td className="option-text-cell">
                  <div className="option-text-preview">
                    {option.option_text.length > 60 
                      ? `${option.option_text.substring(0, 60)}...` 
                      : option.option_text}
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">
                    {getQuestionInfo(option.question)}
                  </span>
                </td>
                <td>
                  <span className="badge badge-secondary">
                    {getTestInfo(option.question)}
                  </span>
                </td>
                <td>
                  <span className="badge badge-primary">
                    {getChapterTitle(option.question)}
                  </span>
                </td>
                <td>
                  <span className="badge badge-warning">
                    {getCourseTitle(option.question)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${option.is_correct ? 'badge-correct' : 'badge-incorrect'}`}>
                    {option.is_correct ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="button button-small button-info"
                    onClick={() => handleViewOption(option)}
                  >
                    View
                  </button>
                  <button
                    className="button button-small button-warning"
                    onClick={() => handleEditOption(option)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDeleteOption(option.id, option.option_text)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedOptions.length === 0 && !loading && (
        <div className="no-data">
          {searchTerm || questionFilter || testFilter || chapterFilter || courseFilter ? "No options found matching your criteria." : "No options found."}
        </div>
      )}

      {/* Option Detail Modal */}
      {showOptionModal && selectedOption && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Option Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="option-detail-grid">
                <div className="option-detail-item">
                  <label>ID:</label>
                  <span>{selectedOption.id}</span>
                </div>
                <div className="option-detail-item">
                  <label>Question:</label>
                  <span className="badge badge-info">
                    {getQuestionInfo(selectedOption.question)}
                  </span>
                </div>
                <div className="option-detail-item">
                  <label>Test:</label>
                  <span className="badge badge-secondary">
                    {getTestInfo(selectedOption.question)}
                  </span>
                </div>
                <div className="option-detail-item">
                  <label>Chapter:</label>
                  <span className="badge badge-primary">
                    {getChapterTitle(selectedOption.question)}
                  </span>
                </div>
                <div className="option-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-warning">
                    {getCourseTitle(selectedOption.question)}
                  </span>
                </div>
                <div className="option-detail-item">
                  <label>Correct Answer:</label>
                  <span className={`badge ${selectedOption.is_correct ? 'badge-correct' : 'badge-incorrect'}`}>
                    {selectedOption.is_correct ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <div className="option-detail-item full-width">
                  <label>Question Text:</label>
                  <div className="question-text-display">
                    {getQuestionText(selectedOption.question)}
                  </div>
                </div>
                <div className="option-detail-item full-width">
                  <label>Option Text:</label>
                  <div className="option-text-display">
                    {selectedOption.option_text}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditOption(selectedOption)}>
                Edit Option
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Option Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Option" : "Edit Option"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="option-question">Question *</label>
                  <select
                    id="option-question"
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    required
                    disabled={formLoading}
                  >
                    <option value="">Select a question</option>
                    {questions.map(question => (
                      <option key={question.id} value={question.id}>
                        {getQuestionInfo(question.id)} - {question.question_text.substring(0, 80)}...
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="option-text">Option Text *</label>
                  <textarea
                    id="option-text"
                    value={formData.option_text}
                    onChange={(e) => setFormData({...formData, option_text: e.target.value})}
                    rows="4"
                    placeholder="Enter the option text here..."
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="option-correct"
                      checked={formData.is_correct}
                      onChange={(e) => setFormData({...formData, is_correct: e.target.checked})}
                      disabled={formLoading}
                    />
                    <label htmlFor="option-correct">This is the correct answer</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Option" : "Update Option")}
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