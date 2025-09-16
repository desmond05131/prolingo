import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Tables/UserAnswerTable.css";
import LoadingIndicator from "../LoadingIndicator";

export default function UserAnswerTable() {
  const [userAnswers, setUserAnswers] = useState([]);
  const [users, setUsers] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUserAnswer, setSelectedUserAnswer] = useState(null);
  const [showUserAnswerModal, setShowUserAnswerModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserAnswer, setEditingUserAnswer] = useState(null);
  const [correctnessFilter, setCorrectnessFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [questionFilter, setQuestionFilter] = useState("");
  const [testFilter, setTestFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const navigate = useNavigate();

  // Form states for create/edit
  const [formData, setFormData] = useState({
    result: "",
    question: "",
    given_answer: "",
    is_correct: false,
    time_spent: 0
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchUserAnswers();
    fetchUsers();
    fetchTestResults();
    fetchQuestions();
    fetchTests();
    fetchChapters();
    fetchCourses();
  }, []);

  const fetchUserAnswers = async () => {
    setLoading(true);
    setError("");
    try {
      // Try admin endpoint first
      const response = await api.get("/api/courses/admin/user-answers/");
      console.log("Fetched user answers:", response.data);
      setUserAnswers(response.data || []);
    } catch (err) {
      // If admin endpoint doesn't exist, try regular endpoint
      try {
        console.log("Admin endpoint not found, trying regular endpoint...");
        const response = await api.get("/api/courses/answers/");
        setUserAnswers(response.data || []);
      } catch (fallbackErr) {
        const message = fallbackErr?.response?.data?.detail || `Failed to fetch user answers: ${fallbackErr.message}`;
        setError(message);
        console.error("UserAnswerTable: fetch error", fallbackErr);
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

  const fetchTestResults = async () => {
    try {
      // Try admin endpoint first
      let response;
      try {
        response = await api.get("/api/courses/admin/test-results/");
      } catch (err) {
        response = await api.get("/api/courses/test-results/");
      }
      setTestResults(response.data || []);
    } catch (err) {
      console.error("Failed to fetch test results:", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/api/courses/questions/");
      setQuestions(response.data || []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
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

  const handleViewUserAnswer = (userAnswer) => {
    setSelectedUserAnswer(userAnswer);
    setShowUserAnswerModal(true);
  };

  const handleCreateUserAnswer = () => {
    setFormData({
      result: "",
      question: "",
      given_answer: "",
      is_correct: false,
      time_spent: 0
    });
    setFormError("");
    setShowCreateModal(true);
  };

  const handleEditUserAnswer = (userAnswer) => {
    setEditingUserAnswer(userAnswer);
    setFormData({
      result: userAnswer.result || "",
      question: userAnswer.question || "",
      given_answer: userAnswer.given_answer || "",
      is_correct: userAnswer.is_correct || false,
      time_spent: userAnswer.time_spent || 0
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleDeleteUserAnswer = async (userAnswerId, username, questionText) => {
    const preview = questionText.length > 50 ? `${questionText.substring(0, 50)}...` : questionText;
    if (!window.confirm(`Are you sure you want to delete answer by "${username}" for question "${preview}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/admin/user-answers/${userAnswerId}/delete/`);
      setUserAnswers(userAnswers.filter(ua => ua.id !== userAnswerId));
      alert(`Answer by "${username}" has been deleted successfully.`);
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to delete user answer";
      alert(`Error: ${message}`);
      console.error("Delete user answer error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (showCreateModal) {
        // Create new user answer
        const response = await api.post("/api/courses/admin/user-answers/create/", formData);
        setUserAnswers([response.data, ...userAnswers]);
        setShowCreateModal(false);
        alert("User answer created successfully!");
      } else if (showEditModal && editingUserAnswer) {
        // Update existing user answer
        const response = await api.patch(`/api/courses/admin/user-answers/${editingUserAnswer.id}/update/`, formData);
        setUserAnswers(userAnswers.map(ua => 
          ua.id === editingUserAnswer.id ? response.data : ua
        ));
        setShowEditModal(false);
        setEditingUserAnswer(null);
        alert("User answer updated successfully!");
      }
    } catch (err) {
      const data = err?.response?.data || {};
      console.error("Form submit error details:", data);
      
      if (data.result) {
        setFormError(Array.isArray(data.result) ? data.result[0] : String(data.result));
      } else if (data.question) {
        setFormError(Array.isArray(data.question) ? data.question[0] : String(data.question));
      } else if (data.given_answer) {
        setFormError(Array.isArray(data.given_answer) ? data.given_answer[0] : String(data.given_answer));
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
    setShowUserAnswerModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUserAnswer(null);
    setEditingUserAnswer(null);
    setFormData({
      result: "",
      question: "",
      given_answer: "",
      is_correct: false,
      time_spent: 0
    });
    setFormError("");
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getUserName = (resultId) => {
    const result = testResults.find(tr => tr.id === resultId);
    if (!result) return "Unknown User";
    const user = users.find(u => u.id === result.user);
    return user ? user.username : "Unknown User";
  };

  const getQuestionText = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.question_text : "Unknown Question";
  };

  const getQuestionInfo = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question ? `Q${question.id} (${question.question_type})` : "Unknown Question";
  };

  const getTestInfo = (resultId) => {
    const result = testResults.find(tr => tr.id === resultId);
    if (!result) return "Unknown Test";
    const test = tests.find(t => t.id === result.test);
    return test ? `${test.test_type} (${test.id})` : "Unknown Test";
  };

  const getChapterTitle = (resultId) => {
    const result = testResults.find(tr => tr.id === resultId);
    if (!result) return "Unknown Chapter";
    const test = tests.find(t => t.id === result.test);
    if (!test) return "Unknown Chapter";
    const chapter = chapters.find(c => c.id === test.chapter);
    return chapter ? chapter.title : "Unknown Chapter";
  };

  const getCourseTitle = (resultId) => {
    const result = testResults.find(tr => tr.id === resultId);
    if (!result) return "Unknown Course";
    const test = tests.find(t => t.id === result.test);
    if (!test) return "Unknown Course";
    const chapter = chapters.find(c => c.id === test.chapter);
    if (!chapter) return "Unknown Course";
    const course = courses.find(c => c.id === chapter.course);
    return course ? course.title : "Unknown Course";
  };

  const getResultInfo = (resultId) => {
    const result = testResults.find(tr => tr.id === resultId);
    return result ? `Result #${result.id} (${result.score?.toFixed(1)}%)` : "Unknown Result";
  };

  // Filter and sort user answers
  const filteredAndSortedUserAnswers = userAnswers
    .filter(userAnswer => {
      const username = getUserName(userAnswer.result);
      const questionText = getQuestionText(userAnswer.question);
      const questionInfo = getQuestionInfo(userAnswer.question);
      const testInfo = getTestInfo(userAnswer.result);
      const chapterTitle = getChapterTitle(userAnswer.result);
      const courseTitle = getCourseTitle(userAnswer.result);
      const resultInfo = getResultInfo(userAnswer.result);
      
      const matchesSearch = 
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        questionInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resultInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userAnswer.given_answer?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCorrectness = correctnessFilter === "" || 
        (correctnessFilter === "true" && userAnswer.is_correct) ||
        (correctnessFilter === "false" && !userAnswer.is_correct);
      
      const matchesResult = resultFilter === "" || userAnswer.result?.toString() === resultFilter;
      const matchesQuestion = questionFilter === "" || userAnswer.question?.toString() === questionFilter;
      const matchesTest = testFilter === "" || getTestInfo(userAnswer.result) === testFilter;
      const matchesChapter = chapterFilter === "" || getChapterTitle(userAnswer.result) === chapterFilter;
      const matchesCourse = courseFilter === "" || getCourseTitle(userAnswer.result) === courseFilter;
      const matchesUser = userFilter === "" || getUserName(userAnswer.result) === userFilter;
      
      return matchesSearch && matchesCorrectness && matchesResult && matchesQuestion && 
             matchesTest && matchesChapter && matchesCourse && matchesUser;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle username sorting
      if (sortField === "username") {
        aVal = getUserName(a.result).toLowerCase();
        bVal = getUserName(b.result).toLowerCase();
      }
      
      // Handle question text sorting
      if (sortField === "question_text") {
        aVal = getQuestionText(a.question).toLowerCase();
        bVal = getQuestionText(b.question).toLowerCase();
      }
      
      // Handle test info sorting
      if (sortField === "test_info") {
        aVal = getTestInfo(a.result).toLowerCase();
        bVal = getTestInfo(b.result).toLowerCase();
      }
      
      // Handle chapter title sorting
      if (sortField === "chapter_title") {
        aVal = getChapterTitle(a.result).toLowerCase();
        bVal = getChapterTitle(b.result).toLowerCase();
      }
      
      // Handle course title sorting
      if (sortField === "course_title") {
        aVal = getCourseTitle(a.result).toLowerCase();
        bVal = getCourseTitle(b.result).toLowerCase();
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

  // Get filtered questions and results based on selections
  const filteredQuestions = questions.filter(question => {
    if (testFilter) {
      const questionResult = testResults.find(tr => getTestInfo(tr.id) === testFilter);
      if (!questionResult) return false;
      const test = tests.find(t => t.id === questionResult.test);
      return test && question.test === test.id;
    }
    if (chapterFilter || courseFilter) {
      // Filter questions based on chapter/course
      const test = tests.find(t => t.id === question.test);
      if (!test) return false;
      if (chapterFilter && getChapterTitle(testResults.find(tr => tr.test === test.id)?.id) !== chapterFilter) return false;
      if (courseFilter && getCourseTitle(testResults.find(tr => tr.test === test.id)?.id) !== courseFilter) return false;
    }
    return true;
  });

  const filteredResults = testResults.filter(result => {
    if (userFilter && getUserName(result.id) !== userFilter) return false;
    if (testFilter && getTestInfo(result.id) !== testFilter) return false;
    if (chapterFilter && getChapterTitle(result.id) !== chapterFilter) return false;
    if (courseFilter && getCourseTitle(result.id) !== courseFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="user-answer-table-container">
        <h2>User Answer Management</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="user-answer-table-container">
      <div className="table-header">
        <h2>User Answer Management</h2>
        <div className="header-actions">
          <button className="button button-success" onClick={handleCreateUserAnswer}>
            Create Answer
          </button>
          <button className="button button-primary" onClick={fetchUserAnswers}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={fetchUserAnswers} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}

      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by user, question, answer, test, chapter, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={correctnessFilter}
            onChange={(e) => setCorrectnessFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Answers</option>
            <option value="true">Correct</option>
            <option value="false">Incorrect</option>
          </select>
        </div>
        <div className="filter-container">
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setChapterFilter("");
              setTestFilter("");
              setResultFilter("");
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
              setTestFilter("");
              setResultFilter("");
              setQuestionFilter("");
            }}
            className="filter-select"
          >
            <option value="">All Chapters</option>
            {chapters.filter(chapter => 
              !courseFilter || getCourseTitle(testResults.find(tr => 
                tests.find(t => t.chapter === chapter.id && t.id === tr.test)
              )?.id) === courseFilter
            ).map(chapter => (
              <option key={chapter.id} value={chapter.title}>
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
            {Array.from(new Set(testResults.map(result => getUserName(result.id)))).map(username => (
              <option key={username} value={username}>
                {username}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-container">
          <select
            value={resultFilter}
            onChange={(e) => {
              setResultFilter(e.target.value);
              setQuestionFilter("");
            }}
            className="filter-select"
          >
            <option value="">All Results</option>
            {filteredResults.map(result => (
              <option key={result.id} value={result.id}>
                {getResultInfo(result.id)} - {getUserName(result.id)}
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
          Total Answers: {filteredAndSortedUserAnswers.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="user-answer-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("username")} className="sortable">
                User {sortField === "username" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("question_text")} className="sortable">
                Question {sortField === "question_text" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Given Answer</th>
              <th onClick={() => handleSort("is_correct")} className="sortable">
                Correct {sortField === "is_correct" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("time_spent")} className="sortable">
                Time {sortField === "time_spent" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("test_info")} className="sortable">
                Test {sortField === "test_info" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("course_title")} className="sortable">
                Course {sortField === "course_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUserAnswers.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? "Loading..." : "No user answers found"}
                </td>
              </tr>
            ) : (
              filteredAndSortedUserAnswers.map((userAnswer) => (
                <tr key={userAnswer.id}>
                  <td>{userAnswer.id}</td>
                  <td>
                    <span className="badge badge-user">
                      {getUserName(userAnswer.result)}
                    </span>
                  </td>
                  <td className="question-text-cell">
                    <div className="question-text-preview">
                      <strong>{getQuestionInfo(userAnswer.question)}</strong>
                      <div className="question-text-content">
                        {getQuestionText(userAnswer.question).length > 60 
                          ? `${getQuestionText(userAnswer.question).substring(0, 60)}...` 
                          : getQuestionText(userAnswer.question)}
                      </div>
                    </div>
                  </td>
                  <td className="answer-text-cell">
                    <div className="answer-text-preview">
                      {userAnswer.given_answer?.length > 50 
                        ? `${userAnswer.given_answer.substring(0, 50)}...` 
                        : userAnswer.given_answer || "No answer"}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${userAnswer.is_correct ? 'badge-correct' : 'badge-incorrect'}`}>
                      {userAnswer.is_correct ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-time">
                      {formatTime(userAnswer.time_spent)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-test">
                      {getTestInfo(userAnswer.result)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-course">
                      {getCourseTitle(userAnswer.result)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="button button-small button-info"
                      onClick={() => handleViewUserAnswer(userAnswer)}
                    >
                      View
                    </button>
                    <button
                      className="button button-small button-warning"
                      onClick={() => handleEditUserAnswer(userAnswer)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-small button-danger"
                      onClick={() => handleDeleteUserAnswer(
                        userAnswer.id,
                        getUserName(userAnswer.result),
                        getQuestionText(userAnswer.question)
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

      {/* User Answer Detail Modal */}
      {showUserAnswerModal && selectedUserAnswer && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Answer Details</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-answer-detail-grid">
                <div className="user-answer-detail-item">
                  <label>ID:</label>
                  <span>{selectedUserAnswer.id}</span>
                </div>
                <div className="user-answer-detail-item">
                  <label>User:</label>
                  <span className="badge badge-user">
                    {getUserName(selectedUserAnswer.result)}
                  </span>
                </div>
                <div className="user-answer-detail-item">
                  <label>Question:</label>
                  <span className="badge badge-info">
                    {getQuestionInfo(selectedUserAnswer.question)}
                  </span>
                </div>
                <div className="user-answer-detail-item">
                  <label>Test:</label>
                  <span className="badge badge-test">
                    {getTestInfo(selectedUserAnswer.result)}
                  </span>
                </div>
                <div className="user-answer-detail-item">
                  <label>Chapter:</label>
                  <span className="badge badge-chapter">
                    {getChapterTitle(selectedUserAnswer.result)}
                  </span>
                </div>
                <div className="user-answer-detail-item">
                  <label>Course:</label>
                  <span className="badge badge-course">
                    {getCourseTitle(selectedUserAnswer.result)}
                  </span>
                </div>
                <div className="user-answer-detail-item">
                  <label>Correctness:</label>
                  <span className={`badge ${selectedUserAnswer.is_correct ? 'badge-correct' : 'badge-incorrect'}`}>
                    {selectedUserAnswer.is_correct ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <div className="user-answer-detail-item">
                  <label>Time Spent:</label>
                  <span className="badge badge-time">
                    {formatTime(selectedUserAnswer.time_spent)}
                  </span>
                </div>
                <div className="user-answer-detail-item">
                  <label>Test Result:</label>
                  <span className="badge badge-info">
                    {getResultInfo(selectedUserAnswer.result)}
                  </span>
                </div>
                <div className="user-answer-detail-item full-width">
                  <label>Question Text:</label>
                  <div className="question-text-display">
                    {getQuestionText(selectedUserAnswer.question)}
                  </div>
                </div>
                <div className="user-answer-detail-item full-width">
                  <label>Given Answer:</label>
                  <div className="answer-text-display">
                    {selectedUserAnswer.given_answer || "No answer provided"}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-warning" onClick={() => handleEditUserAnswer(selectedUserAnswer)}>
                Edit Answer
              </button>
              <button className="button button-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit User Answer Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showCreateModal ? "Create New Answer" : "Edit Answer"}</h3>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="error-message">{formError}</div>
                )}
                <div className="form-group">
                  <label htmlFor="user-answer-result">Test Result *</label>
                  <select
                    id="user-answer-result"
                    value={formData.result}
                    onChange={(e) => setFormData({...formData, result: e.target.value})}
                    required
                    disabled={formLoading || showEditModal}
                  >
                    <option value="">Select a test result</option>
                    {testResults.map(result => (
                      <option key={result.id} value={result.id}>
                        {getResultInfo(result.id)} - {getUserName(result.id)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="user-answer-question">Question *</label>
                  <select
                    id="user-answer-question"
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    required
                    disabled={formLoading || showEditModal}
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
                  <label htmlFor="user-answer-given">Given Answer</label>
                  <textarea
                    id="user-answer-given"
                    value={formData.given_answer}
                    onChange={(e) => setFormData({...formData, given_answer: e.target.value})}
                    rows="4"
                    placeholder="Enter the user's answer here..."
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-answer-time">Time Spent (seconds)</label>
                  <input
                    type="number"
                    id="user-answer-time"
                    value={formData.time_spent}
                    onChange={(e) => setFormData({...formData, time_spent: parseInt(e.target.value) || 0})}
                    min="0"
                    disabled={formLoading}
                  />
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="user-answer-correct"
                      checked={formData.is_correct}
                      onChange={(e) => setFormData({...formData, is_correct: e.target.checked})}
                      disabled={formLoading}
                    />
                    <label htmlFor="user-answer-correct">Mark as Correct</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="button button-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : (showCreateModal ? "Create Answer" : "Update Answer")}
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