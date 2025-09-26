# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Admin Users Page (New)

An admin interface has been added at `/admin/users` providing CRUD management for user accounts using a reusable dialog + table pattern (TanStack React Table + custom UI components).

Features:
- List users with sortable columns (username, email, role, registration date, email notification status).
- Create and edit users via a modal dialog (`UserFormDialog`).
- Toggle email notification enable/disable inline.
- Delete users with confirmation.
- Mock data fallback defined in `constants.js` (`MOCK_ADMIN_USERS`) until backend endpoints (`/admin/users`) are live.

Primary key for user records is configurable via `ADMIN_USER_PRIMARY_KEY` (currently `user_id`).

API helper functions for integration are in `api.js`:
`fetchAdminUsers`, `createAdminUser`, `updateAdminUser`, `deleteAdminUser`, `toggleAdminUserEmailNotification`.

This mirrors the structure used for Subscriptions, Achievements, and Feedback for consistency across the admin experience.

## Admin User Game Infos & Daily Streaks (New)

Two additional admin management pages have been added to mirror the existing Subscription management pattern.

### User Game Infos (`/admin/user-gameinfos`)
Schema:
- (PK) `gameinfo_id`
- (FK) `user_id`
- `username` (display only convenience field in mock data)
- `xp_value` (number)
- `energy_value` (number)
- `energy_last_updated_date` (ISO string or null)

Implementation details:
- Mock data: `MOCK_ADMIN_USER_GAMEINFOS` in `constants.js` with primary key constant `ADMIN_USER_GAMEINFO_PRIMARY_KEY`.
- CRUD API helpers in `api.js`: `fetchAdminUserGameInfos`, `createAdminUserGameInfo`, `updateAdminUserGameInfo`, `deleteAdminUserGameInfo` (expects backend endpoints under `/admin/user-gameinfos`).
- Form dialog: `UserGameInfoFormDialog.jsx` (re-uses Input components; date-time field is optional).
- Table actions: Modify/Delete with confirmation, consistent button styling.

### Daily Streaks (`/admin/daily-streaks`)
Schema:
- (PK) `daily_streak_id`
- (FK) `user_id`
- `username` (display only convenience field in mock data)
- `daily_streak_date` (ISO date string `YYYY-MM-DD`)
- `is_streak_saver` (boolean; whether a streak saver was used)

Implementation details:
- Mock data: `MOCK_ADMIN_DAILY_STREAKS` in `constants.js` with primary key constant `ADMIN_DAILY_STREAK_PRIMARY_KEY`.
- CRUD API helpers in `api.js`: `fetchAdminDailyStreaks`, `createAdminDailyStreak`, `updateAdminDailyStreak`, `deleteAdminDailyStreak` (expects backend endpoints under `/admin/daily-streaks`).
- Form dialog: `DailyStreakFormDialog.jsx` includes a native checkbox for `is_streak_saver` to avoid pulling in an additional UI dependency.
- Table displays whether a streak saver was used (Yes/No) and allows editing or deletion.

### Navigation
`MOCK_ADMIN_NAV` updated to include links: "User Game Infos" and "Daily Streaks" so they appear in the `AdminSidebar` navigation.

### Backend Integration Notes
- Ensure backend routes align with pluralized paths used here (`/admin/user-gameinfos`, `/admin/daily-streaks`). If the backend chooses a different naming convention (e.g., `/admin/user-game-info`), update the helper paths in `api.js` accordingly.
- Date handling: `energy_last_updated_date` uses full ISO strings; in the form a `datetime-local` input slices to minutes. Adjust serialization/parsing if seconds or timezone handling become important.
- For `daily_streak_date`, only a date (no time) is currently persisted; backend should normalize to midnight UTC or user-local policy.
- Validation (e.g., preventing duplicate streak entries for same user/date) should be enforced server-side; client currently trusts API responses.

### Future Enhancements
- Add filtering (by username, date range) and sorting persistence in local storage.
- Incorporate pagination if record counts grow large.
- Show derived stats (e.g., current streak length) in the Daily Streaks table.
- Replace plain checkbox with a styled UI component once a shared Toggle/Checkbox primitive is added.

## Admin User Claimed Achievements (New)

Path: `/admin/user-claimed-achievements`

Schema:
- (PK) `user_claimed_achievement_id`
- (FK) `user_id`
- (FK) `achievement_id`
- `claimed_date` (ISO date string `YYYY-MM-DD`)

Implementation details:
- Mock data: `MOCK_ADMIN_USER_CLAIMED_ACHIEVEMENTS` in `src/constants.js` with primary key constant `ADMIN_USER_CLAIMED_ACHIEVEMENT_PRIMARY_KEY`.
- CRUD API helpers in `src/api.js`:
	- `fetchAdminUserClaimedAchievements()`
	- `createAdminUserClaimedAchievement(payload)`
	- `updateAdminUserClaimedAchievement(id, payload)`
	- `deleteAdminUserClaimedAchievement(id)`
	Expected backend endpoints live under `/admin/user-claimed-achievements`.
- Form dialog: `src/components/admin/UserClaimedAchievementFormDialog.jsx`.
- Admin page: `src/pages/Admin/AdminUserClaimedAchievements.jsx` following the same table/actions pattern as Subscriptions.
- Navigation: Added to `MOCK_ADMIN_NAV` so it appears in `AdminSidebar`.

Notes:
- `username` is included in mock data purely for display convenience; backend may omit it or provide via join.
- Sorting for `claimed_date` uses `Date.parse`. Ensure backend returns ISO date strings to sort correctly.

## Admin User Courses and User Tests (New)

Two admin pages have been added that mirror the Subscriptions management pattern:

### User Courses (`/admin/user-courses`)
Schema:
- (PK) `user_course_id`
- (FK) `course_id`
- (FK) `user_id`
- `enrollment_date` (ISO date string `YYYY-MM-DD`)
- `is_dropped` (boolean)

Implementation details:
- Mock data: `MOCK_ADMIN_USER_COURSES` with primary key `ADMIN_USER_COURSE_PRIMARY_KEY` in `src/constants.js`.
- CRUD API helpers in `src/api.js`:
	- `fetchAdminUserCourses()`
	- `createAdminUserCourse(payload)`
	- `updateAdminUserCourse(id, payload)`
	- `deleteAdminUserCourse(id)`
	Expected backend endpoints under `/admin/user-courses`.
- Form dialog: `src/components/admin/UserCourseFormDialog.jsx`.
- Admin page: `src/pages/Admin/AdminUserCourses.jsx` with sortable columns and Modify/Delete actions.
- Navigation: Added to `MOCK_ADMIN_NAV` as "User Courses".

### User Tests (`/admin/user-tests`) with embedded Answers
Schema:
- (PK) `user_test_id`
- (FK) `user_id`
- (FK) `test_id`
- `attempt_date` (ISO datetime string)
- `time_spent` (seconds)

Embedded: User Test Answers
- (PK) `user_test_answer_id`
- (FK) `user_test_id`
- `given_answer_text`
- `is_correct` (boolean)

Implementation details:
- Mock data: `MOCK_ADMIN_USER_TESTS`, `ADMIN_USER_TEST_PRIMARY_KEY`, and `MOCK_ADMIN_USER_TEST_ANSWERS`, `ADMIN_USER_TEST_ANSWER_PRIMARY_KEY` in `src/constants.js`.
- CRUD API helpers in `src/api.js`:
	- `fetchAdminUserTests()` / `createAdminUserTest()` / `updateAdminUserTest()` / `deleteAdminUserTest()`
	- `fetchAdminUserTestAnswers(userTestId)` to load answers for a test
	- `createAdminUserTestAnswer(payload)` / `updateAdminUserTestAnswer(id, payload)` / `deleteAdminUserTestAnswer(id)`
	Expected backend endpoints under `/admin/user-tests` and `/admin/user-tests/:id/answers` (for listing), with standalone `/admin/user-test-answers` for create/update/delete.
- Form dialogs: `src/components/admin/UserTestFormDialog.jsx` and `src/components/admin/UserTestAnswerFormDialog.jsx`.
- Admin page: `src/pages/Admin/AdminUserTests.jsx` includes a "Load Answers" button per row that fetches and displays an inline table of answers, with Add/Modify/Delete actions.
- Navigation: Added to `MOCK_ADMIN_NAV` as "User Tests".

Backend integration tips:
- Ensure date strings are ISO-formatted. The UI uses `datetime-local` for `attempt_date`; consider normalizing to UTC on save.
- For large answer sets, consider server-side pagination for `/answers`.
