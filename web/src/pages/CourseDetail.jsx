import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/CourseDetail.css";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [userChapters, setUserChapters] = useState([]);
  const [userCourse, setUserCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // Fetch course details
      const courseResponse = await api.get(`/api/courses/courses/${courseId}/`);
      setCourse(courseResponse.data);

      // Fetch chapters for this course
      const chaptersResponse = await api.get(`/api/courses/chapters/?course_id=${courseId}`);
      setChapters(chaptersResponse.data || []);

      // Fetch user's enrollment status
      try {
        const userCoursesResponse = await api.get("/api/courses/my-courses/");
        const enrollment = userCoursesResponse.data.find(uc => 
          uc.course?.id === parseInt(courseId) || uc.course === parseInt(courseId)
        );
        setUserCourse(enrollment);
      } catch (err) {
        console.error("Not enrolled or not authenticated:", err);
      }

      // Fetch user chapter progress if enrolled
      if (userCourse) {
        fetchUserChapterProgress();
      }

    } catch (err) {
      setError("Failed to load course details");
      console.error("Failed to fetch course data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserChapterProgress = async () => {
    try {
      const progressPromises = chapters.map(chapter =>
        api.get(`/api/courses/user-chapters/${chapter.id}/`)
          .catch(() => ({ data: { completed: false, last_accessed: null } }))
      );
      const progressResults = await Promise.all(progressPromises);
      setUserChapters(progressResults.map(res => res.data));
    } catch (err) {
      console.error("Failed to fetch user chapter progress:", err);
    }
  };

  const handleChapterClick = (chapterId) => {
    navigate(`/course/${courseId}/chapter/${chapterId}`);
  };

  const handleEnroll = async () => {
    try {
      await api.post("/api/courses/enroll/", { course: courseId });
      // Refresh course data after enrollment
      await fetchCourseData();
      alert("Successfully enrolled in the course!");
    } catch (err) {
      const message = err?.response?.data?.detail || "Failed to enroll in course";
      alert(`Error: ${message}`);
    }
  };

  const isChapterCompleted = (chapterIndex) => {
    return userChapters[chapterIndex]?.completed || false;
  };

  const getChapterStatus = (chapterIndex) => {
    const userChapter = userChapters[chapterIndex];
    if (!userChapter) return "not-started";
    if (userChapter.completed) return "completed";
    if (userChapter.last_accessed) return "in-progress";
    return "not-started";
  };

  if (loading) {
    return (
      <div className="course-detail-container">
        <LoadingIndicator />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-container">
        <div className="error-message">
          {error || "Course not found"}
          <button onClick={() => navigate("/courses")}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <div className="course-detail-header">
        <button 
          className="back-button"
          onClick={() => navigate("/courses")}
        >
          ← Back to Courses
        </button>
        
        <div className="course-info">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          
          {userCourse && (
            <div className="enrollment-status">
              <div className="progress-info">
                <span>Progress: {(userCourse.progress_percent || 0).toFixed(1)}%</span>
                <span className={`status-badge ${userCourse.status}`}>
                  {userCourse.status}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${userCourse.progress_percent || 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!userCourse ? (
        <div className="enrollment-prompt">
          <h3>Enroll to Start Learning</h3>
          <p>You need to enroll in this course to access the chapters and tests.</p>
          <button className="button button-primary" onClick={handleEnroll}>
            Enroll Now
          </button>
        </div>
      ) : (
        <div className="chapters-section">
          <h2>Course Chapters</h2>
          {chapters.length === 0 ? (
            <div className="no-chapters">
              <p>No chapters available for this course yet.</p>
            </div>
          ) : (
            <div className="chapters-list">
              {chapters.map((chapter, index) => {
                const status = getChapterStatus(index);
                const completed = isChapterCompleted(index);
                
                return (
                  <div 
                    key={chapter.id} 
                    className={`chapter-card ${status}`}
                    onClick={() => handleChapterClick(chapter.id)}
                  >
                    <div className="chapter-number">
                      {completed ? "✓" : index + 1}
                    </div>
                    <div className="chapter-content">
                      <h3>{chapter.title}</h3>
                      {chapter.content && (
                        <p className="chapter-preview">
                          {chapter.content.length > 100 
                            ? `${chapter.content.substring(0, 100)}...`
                            : chapter.content
                          }
                        </p>
                      )}
                    </div>
                    <div className="chapter-status">
                      <span className={`status-indicator ${status}`}>
                        {status === "completed" ? "Completed" : 
                         status === "in-progress" ? "In Progress" : "Start"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}