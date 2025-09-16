import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/Courses.css";

export default function AccessCourses() {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState({});
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchUserCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/courses/");
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses. Please try again.");
    }
  };

  const fetchUserCourses = async () => {
    try {
      const response = await api.get("/api/courses/my-courses/");
      setUserCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch user courses:", err);
      // Don't set error here as this might fail for unauthenticated users
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setEnrollLoading(prev => ({ ...prev, [courseId]: true }));
    try {
      await api.post("/api/courses/enroll/", { course: courseId });
      
      // Refresh user courses to update enrollment status
      await fetchUserCourses();
      
      alert("Successfully enrolled in the course!");
    } catch (err) {
      const message = err?.response?.data?.detail || 
                     err?.response?.data?.course?.[0] ||
                     "Failed to enroll in course";
      alert(`Error: ${message}`);
      console.error("Enrollment error:", err);
    } finally {
      setEnrollLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleStartCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const isEnrolled = (courseId) => {
    return userCourses.some(uc => uc.course?.id === courseId || uc.course === courseId);
  };

  const getUserCourseProgress = (courseId) => {
    const userCourse = userCourses.find(uc => uc.course?.id === courseId || uc.course === courseId);
    return userCourse ? userCourse.progress_percent || 0 : 0;
  };

  const getUserCourseStatus = (courseId) => {
    const userCourse = userCourses.find(uc => uc.course?.id === courseId || uc.course === courseId);
    return userCourse ? userCourse.status || 'in-progress' : null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active": return "badge badge-active";
      case "draft": return "badge badge-draft";
      case "archived": return "badge badge-archived";
      default: return "badge badge-default";
    }
  };

  const getProgressBadgeClass = (status) => {
    switch (status) {
      case "completed": return "badge badge-completed";
      case "in-progress": return "badge badge-in-progress";
      case "dropped": return "badge badge-dropped";
      default: return "badge badge-default";
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || course.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="courses-container">
        <h1>Available Courses</h1>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Available Courses</h1>
        <p className="courses-subtitle">
          Discover and enroll in courses to start your learning journey
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchCourses} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}

      <div className="courses-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search courses by title or description..."
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
            <option value="">All Courses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="courses-stats">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <div className="no-courses">
            <h3>No courses found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const progress = getUserCourseProgress(course.id);
            const userStatus = getUserCourseStatus(course.id);
            const isEnrolling = enrollLoading[course.id] || false;

            return (
              <div key={course.id} className={`course-card ${enrolled ? 'enrolled' : ''}`}>
                <div className="course-card-header">
                  <div className="course-title-section">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-badges">
                      <span className={getStatusBadgeClass(course.status)}>
                        {course.status}
                      </span>
                      {enrolled && (
                        <span className={getProgressBadgeClass(userStatus)}>
                          {userStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="course-card-body">
                  <div className="course-description">
                    {course.description ? (
                      course.description.length > 150 
                        ? `${course.description.substring(0, 150)}...`
                        : course.description
                    ) : (
                      <em>No description available</em>
                    )}
                  </div>

                  <div className="course-meta">
                    <div className="course-meta-item">
                      <label>Created:</label>
                      <span>{formatDate(course.created_date)}</span>
                    </div>
                    <div className="course-meta-item">
                      <label>Course ID:</label>
                      <span>#{course.id}</span>
                    </div>
                  </div>

                  {enrolled && (
                    <div className="course-progress">
                      <div className="progress-info">
                        <label>Progress:</label>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="course-card-footer">
                  {enrolled ? (
                    <div className="enrolled-actions">
                      <button
                        className="button button-primary"
                        onClick={() => handleStartCourse(course.id)}
                      >
                        {progress > 0 ? "Continue Course" : "Start Course"}
                      </button>
                      <span className="enrolled-indicator">
                        ✓ Enrolled
                      </span>
                    </div>
                  ) : (
                    <div className="enroll-actions">
                      {course.status === 'active' ? (
                        <button
                          className="button button-success"
                          onClick={() => handleEnroll(course.id)}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? "Enrolling..." : "Enroll Now"}
                        </button>
                      ) : (
                        <button
                          className="button button-secondary"
                          disabled
                        >
                          {course.status === 'draft' ? 'Coming Soon' : 'Not Available'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {userCourses.length > 0 && (
        <div className="enrolled-courses-summary">
          <h2>Your Enrolled Courses</h2>
          <div className="enrolled-summary-grid">
            {userCourses.map((userCourse) => {
              const course = courses.find(c => c.id === userCourse.course?.id || c.id === userCourse.course);
              if (!course) return null;

              return (
                <div key={userCourse.id} className="enrolled-summary-card">
                  <div className="enrolled-summary-info">
                    <h4>{course.title}</h4>
                    <div className="enrolled-summary-meta">
                      <span className={getProgressBadgeClass(userCourse.status)}>
                        {userCourse.status}
                      </span>
                      <span className="progress-text">
                        {(userCourse.progress_percent || 0).toFixed(1)}% complete
                      </span>
                    </div>
                  </div>
                  <button
                    className="button button-small button-primary"
                    onClick={() => handleStartCourse(course.id)}
                  >
                    Continue
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}