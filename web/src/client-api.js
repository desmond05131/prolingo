import api from './api.js';

// Non-admin API helpers for client-side features
// All paths are relative to import.meta.env.VITE_API_URL as configured in api.js
// Keep this focused on public/user endpoints (no /admin/* here)

// --- Auth ---
export async function login({ username, password }) {
  const { data } = await api.post('/token/', { username, password });
  return data; // { access, refresh }
}

export async function refreshToken(refresh) {
  const { data } = await api.post('/token/refresh/', { refresh });
  return data; // { access }
}

export async function registerUser(payload) {
  const { data } = await api.post('/client/users/register/', payload);
  return data; // created user
}

// --- Profile ---
export async function getMyProfile(signal) {
  const { data } = await api.get('/client/me/', { signal });
  return data;
}

export async function updateMyProfile(payload) {
  const { data } = await api.patch('/client/me/', payload);
  return data;
}

export async function changeMyPassword(payload) {
  // Backend may not expose this; consumers should handle 404 gracefully
  const { data } = await api.post('/auth/change-password/', payload);
  return data;
}

// --- Courses ---
export async function listCourses(signal) {
  const { data } = await api.get("/client/courses/", { signal });
  return data;
}

export async function getCourse(courseId, signal) {
  const { data } = await api.get(`/client/courses/${courseId}`, { signal });
  return data;
}

// --- User Courses (client) ---
// CRUD for the current user's course enrollments
export async function listUserCourses(signal) {
  const { data } = await api.get('/client/user-courses/', { signal });
  return data; // expected array or { results: [...] }
}

export async function joinUserCourse(courseId) {
  if (courseId === undefined || courseId === null || courseId === '') {
    throw new Error('joinUserCourse: courseId is required');
  }
  const { data } = await api.post('/client/user-courses/enroll/', { course_id: courseId });
  return data; // created user-course record
}

export async function unjoinUserCourse(userCourseId) {
  if (!userCourseId) {
    throw new Error('unjoinUserCourse: userCourseId is required');
  }
  const { data } = await api.post(`/client/user-courses/${userCourseId}/unenroll/`);
  return data; // maybe { success: true }
}

// --- Chapters ---
export async function listChapters(params = {}, signal) {
  // Optional params: course_id
  const search = new URLSearchParams(params).toString();
  const qs = search ? `?${search}` : '';
  const { data } = await api.get(`/client/courses/chapters/${qs}`, { signal });
  return data;
}

export async function getUserChapter(userChapterId, signal) {
  const { data } = await api.get(`/client/courses/user-chapters/${userChapterId}/`, { signal });
  return data;
}

// --- Tests, Questions, Results ---
export async function listTests(signal) {
  const { data } = await api.get('/client/courses/tests/', { signal });
  return data;
}

export async function listQuestions(signal) {
  const { data } = await api.get('/client/courses/questions/', { signal });
  return data;
}

// Fetch questions (with related choices) for a specific test
// Endpoint: /client/questions/?test_id=xxx
// Returns: Array of questions; each question may include an embedded choices/options array
export async function getTestQuestions(testId, signal) {
  if (testId === undefined || testId === null || testId === '') {
    throw new Error('getTestQuestions: testId is required');
  }
  const qs = `?test_id=${encodeURIComponent(testId)}`;
  const { data } = await api.get(`/client/questions/${qs}`, { signal });
  return data;
}

export async function listTestResults(signal) {
  const { data } = await api.get('/client/courses/test-results/', { signal });
  return data;
}

export async function createTestResult(payload) {
  const { data } = await api.post('/client/courses/test-results/create/', payload);
  return data;
}

// Submit a completed test attempt for the current user
// Endpoint: /client/user-tests/submit/
// Payload schema:
// {
//   test_id: number,
//   duration: number,
//   answers: [{ question_id: number, answer_text: string }]
// }
// Returns detailed attempt summary including user_test_id and stats
export async function submitUserTestAttempt(payload) {
  const { data } = await api.post('/client/user-tests/submit/', payload);
  return data;
}

// --- Notes (simple demo endpoints used in AdminHome) ---
export async function listNotes(signal) {
  const { data } = await api.get('/notes/', { signal });
  return data;
}

export async function createNote(payload) {
  const { data } = await api.post('/notes/', payload);
  return data;
}

// --- Subscription (current user) ---
// GET active subscription(s) for current user
// Endpoint: /client/subscription/active/
// Returns: Array of subscriptions; highlight if any item has is_active=true
export async function getMyActiveSubscription(signal) {
  const { data } = await api.get('/client/subscriptions/active/', { signal });
  return data;
}

// Create a new subscription (payment pending)
// Payload schema: { type: 'month' | 'year', is_renewable: boolean, amount: string }
export async function createClientSubscription(payload) {
  const { data } = await api.post('/client/subscriptions/', payload);
  return data;
}

// Trigger payment for the latest/pending subscription
// Backend expects no payload
export async function payClientSubscription() {
  const { data } = await api.post('/client/subscriptions/payment/');
  return data;
}

// Unsubscribe (cancel current/active subscription)
export async function unsubscribeClientSubscription() {
  const { data } = await api.delete('/client/subscriptions/');
  return data;
}

// --- Feedback (client) ---
// Create a feedback entry from current user
// Endpoint: POST /client/feedback/create/
// Payload: { message: string }
export async function createClientFeedback(payload) {
  const { data } = await api.post('/client/feedback/create/', payload);
  return data;
}

// --- Client Learn: tests tree and user tests ---
export async function fetchClientTestsTree(signal) {
  const { data } = await api.get('/client/tests/tree/', { signal });
  return data; // expected array of { course, chapter, test }
}

export async function fetchClientUserTests(signal) {
  const { data } = await api.get('/client/user-tests/', { signal });
  return data; // expected array of user test attempts (must include test id reference)
}

// --- Leaderboard ---
// Returns Top 50 users by highest streak globally
// Expected response: Array of user records or { results: [...] }
export async function getLeaderboardTop50(signal) {
  const { data } = await api.get('/client/leaderboard/top50/', { signal });
  return data;
}

// Get current user's leaderboard info (rank, level, xp, etc.)
// Schema:
// { rank, user_id, username, xp_value, level, profile_icon }
export async function getMyLeaderboard(signal) {
  const { data } = await api.get('/client/leaderboard/me/', { signal });
  return data;
}

// --- Achievements ---
// Endpoint returns an array of achievements
// Schema: [{ achievement_id, reward_type, reward_amount, reward_content, reward_content_description }]
export async function listAchievements(signal) {
  const { data } = await api.get('/client/achievements/', { signal });
  return data;
}

// Get the list of achievements that the current user has claimed
// Endpoint: /client/user-claimed-achievements/
// Schema: [ { user_claimed_achievement_id, achievement_id, claimed_date } ]
export async function listUserClaimedAchievements(signal) {
  const { data } = await api.get('/client/user-claimed-achievements/', { signal });
  return data;
}

// Claim an achievement for the current user
// Expected payload: { achievement_id }
// Endpoint assumption based on backend conventions
export async function claimAchievement(achievementId) {
  if (!achievementId && achievementId !== 0) {
    throw new Error('claimAchievement: achievementId is required');
  }
  const { data } = await api.post(`/client/achievements/${achievementId}/claim/`);
  return data;
}

// --- Daily Streaks ---
// GET: current user's daily streak info
// Schema: { streak_count: number, streak_days: [{ daily_streak_date: ISOString, is_streak_saver: boolean }] }
export async function getMyDailyStreak(signal) {
  const { data } = await api.get('/client/dailystreaks/me/', { signal });
  return data;
}

// POST: use streak saver for a specific date (string 'YYYY-MM-DD')
export async function useStreakSaver(date) {
  if (!date) throw new Error('useStreakSaver: date is required');
  const { data } = await api.post('/client/dailystreaks/use-streak-saver/', { date });
  return data;
}

// --- Game Info (current user) ---
// Get current user's game info: xp, energy, level, next level progress
// Schema:
// {
//   "gameinfo_id": number,
//   "xp_value": number,
//   "energy_value": number,
//   "energy_last_updated_date": string,
//   "level": number,
//   "next_level_xp": number,
//   "next_level_progress_pct": number
// }
export async function getMyGameInfo(signal) {
  const { data } = await api.get('/client/gameinfo/me/', { signal });
  return data;
}

// Named export bundle for convenience
export const clientApi = {
  login,
  refreshToken,
  registerUser,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  listCourses,
  getCourse,
  listChapters,
  getUserChapter,
  listTests,
  listQuestions,
  listTestResults,
  createTestResult,
  submitUserTestAttempt,
  listNotes,
  createNote,
  fetchClientTestsTree,
  fetchClientUserTests,
  getTestQuestions,
  getLeaderboardTop50,
  getMyLeaderboard,
  listAchievements,
  listUserClaimedAchievements,
  claimAchievement,
  getMyDailyStreak,
  useStreakSaver,
  getMyGameInfo,
  listUserCourses,
  joinUserCourse,
  unjoinUserCourse,
  getMyActiveSubscription,
  createClientSubscription,
  payClientSubscription,
  unsubscribeClientSubscription,
  createClientFeedback,
};
