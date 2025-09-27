import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        // Globally disable cancellation signal to avoid AbortError propagation
        if (config && 'signal' in config) {
            try { delete config.signal; } catch { /* ignore */ }
        }

        const token =
          localStorage.getItem(ACCESS_TOKEN) ??
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzkwMzk4MDY4LCJpYXQiOjE3NTg4NjIwNjgsImp0aSI6ImJhOGMxYmYzMjg1ZjQ3MWZhOWEyMDRjNDRiODhjNWEwIiwidXNlcl9pZCI6IjEifQ.sYskkqK1CbP0wA12YoKnbHOnR8S5ruDiQgtY0GTk_9E";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    }, 
    (error) => {
        return Promise.reject(error)
    }
)

// --- Subscription admin helpers ---
// These assume backend endpoints; adjust paths as needed.
export async function fetchAdminSubscriptions(signal) {
    const { data } = await api.get('/admin/subscriptions/', { signal });
    return data; // expected array
}

export async function updateAdminSubscription(id, payload) {
    const { data } = await api.put(`/admin/subscriptions/${id}`, payload);
    return data; // updated record
}

export async function createAdminSubscription(payload) {
    const { data } = await api.post('/admin/subscriptions/', payload);
    return data; // created record
}

export async function deleteAdminSubscription(id) {
    const { data } = await api.delete(`/admin/subscriptions/${id}`);
    return data; // maybe { success: true }
}

// --- Achievement admin helpers ---
export async function fetchAdminAchievements(signal) {
    const { data } = await api.get('/admin/achievements/', { signal });
    return data; // expected array
}

export async function updateAdminAchievement(id, payload) {
    const { data } = await api.put(`/admin/achievements/${id}`, payload);
    return data; // updated record
}

export async function createAdminAchievement(payload) {
    const { data } = await api.post('/admin/achievements/', payload);
    return data; // created record
}

export async function deleteAdminAchievement(id) {
    const { data } = await api.delete(`/admin/achievements/${id}`);
    return data;
}

// --- Feedback admin helpers ---
export async function fetchAdminFeedback(signal) {
    const { data } = await api.get('/admin/feedback/', { signal });
    return data; // expected array
}

export async function createAdminFeedback(payload) {
    const { data } = await api.post('/admin/feedback/', payload);
    return data; // created record
}

export async function updateAdminFeedback(id, payload) {
    const { data } = await api.put(`/admin/feedback/${id}`, payload);
    return data; // updated record
}

export async function deleteAdminFeedback(id) {
    const { data } = await api.delete(`/admin/feedback/${id}`);
    return data; // maybe { success: true }
}

// --- Users admin helpers ---
export async function fetchAdminUsers(signal) {
    const { data } = await api.get('/admin/users/', { signal });
    return data; // expected array of users
}

export async function createAdminUser(payload) {
    const { data } = await api.post('/admin/users/', payload);
    return data; // created user record
}

export async function updateAdminUser(id, payload) {
    const { data } = await api.patch(`/admin/users/${id}`, payload);
    return data; // updated user record
}

export async function deleteAdminUser(id) {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data; // maybe { success: true }
}

export async function toggleAdminUserEmailNotification(id, enable) {
    const { data } = await api.patch(`/admin/users/${id}/email-notification`, { enable });
    return data; // updated user record or status
}

// --- User Game Infos admin helpers ---
export async function fetchAdminUserGameInfos(signal) {
    const { data } = await api.get('/admin/gameinfos/', { signal });
    return data; // expected array
}

export async function updateAdminUserGameInfo(id, payload) {
    const { data } = await api.put(`/admin/gameinfos/${id}`, payload);
    return data; // updated record
}

export async function createAdminUserGameInfo(payload) {
    const { data } = await api.post('/admin/gameinfos/', payload);
    return data; // created record
}

export async function deleteAdminUserGameInfo(id) {
    const { data } = await api.delete(`/admin/gameinfos/${id}`);
    return data; // maybe { success: true }
}

// --- Daily Streaks admin helpers ---
export async function fetchAdminDailyStreaks(signal) {
    const { data } = await api.get('/admin/dailystreaks/', { signal });
    return data; // expected array
}

export async function updateAdminDailyStreak(id, payload) {
    const { data } = await api.put(`/admin/dailystreaks/${id}`, payload);
    return data; // updated record
}

export async function createAdminDailyStreak(payload) {
    const { data } = await api.post('/admin/dailystreaks/', payload);
    return data; // created record
}

export async function deleteAdminDailyStreak(id) {
    const { data } = await api.delete(`/admin/dailystreaks/${id}`);
    return data; // maybe { success: true }
}

// --- User Claimed Achievements admin helpers ---
export async function fetchAdminUserClaimedAchievements(signal) {
    const { data } = await api.get('/admin/user-claimed-achievements/', { signal });
    return data; // expected array
}

export async function updateAdminUserClaimedAchievement(id, payload) {
    const { data } = await api.put(`/admin/user-claimed-achievements/${id}`, payload);
    return data; // updated record
}

export async function createAdminUserClaimedAchievement(payload) {
    const { data } = await api.post('/admin/user-claimed-achievements/', payload);
    return data; // created record
}

export async function deleteAdminUserClaimedAchievement(id) {
    const { data } = await api.delete(`/admin/user-claimed-achievements/${id}`);
    return data; // maybe { success: true }
}

// --- User Courses admin helpers ---
export async function fetchAdminUserCourses(signal) {
    const { data } = await api.get('/admin/user-courses/', { signal });
    return data;
}

export async function updateAdminUserCourse(id, payload) {
    const { data } = await api.put(`/admin/user-courses/${id}`, payload);
    return data;
}

export async function createAdminUserCourse(payload) {
    const { data } = await api.post('/admin/user-courses/', payload);
    return data;
}

export async function deleteAdminUserCourse(id) {
    const { data } = await api.delete(`/admin/user-courses/${id}`);
    return data;
}

// --- User Tests admin helpers ---
export async function fetchAdminUserTests(signal) {
    const { data } = await api.get('/admin/user-tests/', { signal });
    return data;
}

export async function updateAdminUserTest(id, payload) {
    const { data } = await api.put(`/admin/user-tests/${id}`, payload);
    return data;
}

export async function createAdminUserTest(payload) {
    const { data } = await api.post('/admin/user-tests/', payload);
    return data;
}

export async function deleteAdminUserTest(id) {
    const { data } = await api.delete(`/admin/user-tests/${id}`);
    return data;
}

// --- User Test Answers (nested under User Tests) ---
// Fetch answers for a specific user test
export async function fetchAdminUserTestAnswers(userTestId, signal) {
    const { data } = await api.get(`/admin/user-test-answers/?user_test_id=${userTestId}`, { signal });
    console.log(data)
    return data;
}

export async function updateAdminUserTestAnswer(id, payload) {
    const { data } = await api.put(`/admin/user-test-answers/${id}`, payload);
    return data;
}

export async function createAdminUserTestAnswer(payload) {
    const { data } = await api.post('/admin/user-test-answers/', payload);
    return data;
}

export async function deleteAdminUserTestAnswer(id) {
    const { data } = await api.delete(`/admin/user-test-answers/${id}`);
    return data;
}

// --- Tests admin helpers ---
export async function fetchAdminTests(signal) {
    const { data } = await api.get('/admin/tests/tree/', { signal });
    return data; // expected to include joined chapter/course info
}

export async function updateAdminTest(id, payload) {
    const { data } = await api.put(`/admin/tests/${id}`, payload);
    return data;
}

export async function createAdminTest(payload) {
    const { data } = await api.post('/admin/tests/', payload);
    return data;
}

export async function deleteAdminTest(id) {
    const { data } = await api.delete(`/admin/tests/${id}`);
    return data;
}

// --- Questions admin helpers (filterable by test_id) ---
export async function fetchAdminQuestions(testId, signal) {
    const qs = testId ? `?test_id=${encodeURIComponent(testId)}` : '';
    const { data } = await api.get(`/admin/questions/${qs}`, { signal });
    return data;
}

export async function updateAdminQuestion(id, payload) {
    const { data } = await api.put(`/admin/questions/${id}`, payload);
    return data;
}

export async function createAdminQuestion(payload) {
    const { data } = await api.post('/admin/questions/', payload);
    return data;
}

export async function deleteAdminQuestion(id) {
    const { data } = await api.delete(`/admin/questions/${id}`);
    return data;
}

// --- Question Choices admin helpers (filterable by question_id) ---
export async function fetchAdminQuestionChoices(questionId, signal) {
    const qs = questionId ? `?question_id=${encodeURIComponent(questionId)}` : '';
    const { data } = await api.get(`/admin/question-choices/${qs}`, { signal });
    return data;
}

export async function updateAdminQuestionChoice(id, payload) {
    const { data } = await api.put(`/admin/question-choices/${id}`, payload);
    return data;
}

export async function createAdminQuestionChoice(payload) {
    const { data } = await api.post('/admin/question-choices/', payload);
    return data;
}

export async function deleteAdminQuestionChoice(id) {
    const { data } = await api.delete(`/admin/question-choices/${id}`);
    return data;
}

// --- Courses admin helpers ---
export async function fetchAdminCourses(signal) {
    const { data } = await api.get('/admin/courses/', { signal });
    return data;
}

export async function updateAdminCourse(id, payload) {
    const { data } = await api.put(`/admin/courses/${id}`, payload);
    return data;
}

export async function createAdminCourse(payload) {
    const { data } = await api.post('/admin/courses/', payload);
    return data;
}

export async function deleteAdminCourse(id) {
    const { data } = await api.delete(`/admin/courses/${id}`);
    return data;
}

// --- Chapters admin helpers ---
export async function fetchAdminChapters(signal) {
    const { data } = await api.get('/admin/chapters/', { signal });
    return data;
}

export async function updateAdminChapter(id, payload) {
    const { data } = await api.put(`/admin/chapters/${id}`, payload);
    return data;
}

export async function createAdminChapter(payload) {
    const { data } = await api.post('/admin/chapters/', payload);
    return data;
}

export async function deleteAdminChapter(id) {
    const { data } = await api.delete(`/admin/chapters/${id}`);
    return data;
}

export default api;