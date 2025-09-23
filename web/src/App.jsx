import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UpdateProfile from "./pages/UpdateProfile"
import AdminCreateUser from "./pages/AdminOperations/AdminCreateUser"
import AdminListUser from "./pages/AdminOperations/AdminListUser"
import AdminEditUser from "./pages/AdminOperations/AdminEditUser";
import Courses from "./pages/CoursesRelated/Courses"
import Chapter from "./pages/CoursesRelated/Chapter"
import Test from "./pages/CoursesRelated/Test"
import Questions from "./pages/CoursesRelated/Questions"
import Options from "./pages/CoursesRelated/Options"
import UserCourses from "./pages/CoursesRelated/UserCourses"
import UserChapters from "./pages/CoursesRelated/UserChapters"
import UserTestResults from "./pages/CoursesRelated/UserTestResults"
import UserAnswers from "./pages/CoursesRelated/UserAnswers"
import CourseDetail from "./pages/CourseDetail"
import AccessCourses from "./pages/Courses"
// import AttemptTest from "./pages/AttemptTest"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "@/components/ui/toaster"
import LeaderboardHome from "./pages/Home/Leaderboard"
import AchievementsHome from "./pages/Home/Achievements"
import SettingsHome from "./pages/Home/Settings"
import LearnHome from "./pages/Home/Learn"
import ProfileHome from "./pages/Home/Profile"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <div className="dark">
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/leaderboards" />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        <Route path="/leaderboards" element={<ProtectedRoute><LeaderboardHome /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><AchievementsHome /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsHome /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><LearnHome /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileHome /></ProtectedRoute>} />


        <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/admin/create-user" element={<ProtectedRoute><AdminCreateUser /></ProtectedRoute>} />
        <Route path="/admin/list-user" element={<ProtectedRoute><AdminListUser /></ProtectedRoute>} />
        <Route path="/admin/edit-user/:userId" element={<ProtectedRoute><AdminEditUser /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/chapter" element={<ProtectedRoute><Chapter /></ProtectedRoute>} />
        <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
        <Route path="/options" element={<ProtectedRoute><Options /></ProtectedRoute>} />
        <Route path="/user-courses" element={<ProtectedRoute><UserCourses /></ProtectedRoute>} />
        <Route path="/user-chapters" element={<ProtectedRoute><UserChapters /></ProtectedRoute>} />
        <Route path="/user-test-results" element={<ProtectedRoute><UserTestResults /></ProtectedRoute>} />
        <Route path="/user-answers" element={<ProtectedRoute><UserAnswers /></ProtectedRoute>} />
        <Route path="/course/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/access-courses" element={<ProtectedRoute><AccessCourses /></ProtectedRoute>} />
          {/* <Route path="/leaderboards" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} /> */}
          {/* <Route path="/achievements" element={<ProtectedRoute><AchievementPage /></ProtectedRoute>} /> */}
        {/* <Route path="/attempt-test/:courseId/:chapterId/:testId" element={<ProtectedRoute><AttemptTest /></ProtectedRoute>} /> */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Toaster />
      </BrowserRouter>
      </div>
  )
}

export default App
