import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UpdateProfile from "./pages/UpdateProfile"
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
import AttemptTest from "./pages/Learn/AttemptTest"
import TestResult from "./pages/Learn/TestResult"
import SubscriptionHome from "./pages/Home/Subscription"
import PaymentPage from "./pages/Home/Payment"
import AdminLayout from "./layouts/AdminLayout"
import AdminCreateUser from "./pages/Admin/AdminCreateUser"
import AdminListUser from "./pages/Admin/AdminListUser"
import AdminEditUser from "./pages/Admin/AdminEditUser"
import AdminSubscriptions from "./pages/Admin/AdminSubscriptions"
import AdminUsers from "./pages/Admin/AdminUsers"
import AdminAchievements from "./pages/Admin/AdminAchievements"
import AdminFeedback from "./pages/Admin/AdminFeedback"
import AdminUserGameInfos from "./pages/Admin/AdminUserGameInfos"
import AdminUserCourses from "./pages/Admin/AdminUserCourses"
import AdminUserTests from "./pages/Admin/AdminUserTests"
import AdminDailyStreaks from "./pages/Admin/AdminDailyStreaks"
import AdminUserClaimedAchievements from "./pages/Admin/AdminUserClaimedAchievements"
import AdminCourses from "./pages/Admin/AdminCourses"
import ForgotPassword from "./pages/ForgotPassword"

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
  <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/leaderboards" element={<ProtectedRoute><LeaderboardHome /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><AchievementsHome /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsHome /></ProtectedRoute>} />
  <Route path="/subscription" element={<ProtectedRoute><SubscriptionHome /></ProtectedRoute>} />
  <Route path="/subscription/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><LearnHome /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileHome /></ProtectedRoute>} />
        
        {/* Admin nested routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="create-user" element={<AdminCreateUser />} />
          <Route path="list-user" element={<AdminListUser />} />
          <Route path="edit-user/:userId" element={<AdminEditUser />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="user-courses" element={<AdminUserCourses />} />
          <Route path="user-tests" element={<AdminUserTests />} />
          <Route path="user-claimed-achievements" element={<AdminUserClaimedAchievements />} />
          <Route path="user-gameinfos" element={<AdminUserGameInfos />} />
          <Route path="daily-streaks" element={<AdminDailyStreaks />} />
          <Route path="achievement" element={<AdminAchievements />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="course" element={<AdminCourses />} />
        </Route>

        {/* General / user management outside admin layout */}
        <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
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
        <Route path="/attempt-test/:testId" element={<ProtectedRoute><AttemptTest /></ProtectedRoute>} />
        <Route path="/attempt-test/:testId/result" element={<ProtectedRoute><TestResult /></ProtectedRoute>} />
        <Route path="/lesson" element={<ProtectedRoute><AttemptTest /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Toaster />
      </BrowserRouter>
      </div>
  )
}

export default App
