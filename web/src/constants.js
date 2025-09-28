export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";

// Central palette (primary colors requested)
export const PRIMARY_COLORS = [
  "#E4D6A7", // tan
  "#E9B44C", // orange
  "#FF6978", // pink
  "#9799CA", // periwinkle
  "#2D936C", // teal-green
  "#AEC3CE", // muted blue-grey
  "#FFF6D2", // pale cream
  "#CB2749", // deep crimson
  "#9B8C79", // earthy taupe
  "#FFA531", // vibrant amber
  "#1F4433", // deep forest green
  "#024943", // dark teal
];

// Mock streak check-ins for current month (ISO date strings)
// NOTE: Replace with backend-provided data later.
export const MOCK_STREAK_CHECKINS = (() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  // Pretend user checked in daily for last 8 days and sporadically earlier.
  const dates = new Set();
  for (let i = 0; i < 8; i++) {
    const d = new Date(year, month, today.getDate() - i);
    dates.add(d.toISOString().slice(0, 10));
  }
  // Add two earlier random days this month
  dates.add(new Date(year, month, 2).toISOString().slice(0, 10));
  dates.add(new Date(year, month, 5).toISOString().slice(0, 10));
  return Array.from(dates).sort();
})();

// Slightly darkened counterparts for borders (manually picked ~15-20% darker)
const BORDER_COLORS = {
  "#E4D6A7": "#C1B58D",
  "#E9B44C": "#BF8F3D",
  "#FF6978": "#CC5460",
  "#9799CA": "#7476A2",
  "#2D936C": "#227352",

  "#AEC3CE": "#8B9CA5",
  "#FFF6D2": "#CCC5A8",
  "#CB2749": "#A21F3A",
  "#9B8C79": "#7C7060",
  "#FFA531": "#CC8427",
  // "#1F4433": "#173428",
  // "#024943": "#01332F",
};

export const units = [
  {
    unitNumber: 1,
    description: "Introduction to C++",
    backgroundColor: "bg-[#CC8427]",
    textColor: "text-[#CC8427]",
    borderColor: "border-[#FFA531]",
    tiles: [
      { type: "star", description: "Form basic sentences" },
      { type: "book", description: "Good morning" },
      { type: "star", description: "Greet people" },
      // { type: "treasure" },
      { type: "book", description: "A date" },
      { type: "trophy", description: "Unit 1 review" },
    ],
  },
  {
    unitNumber: 2,
    description: "The Syntax",
    backgroundColor: "bg-[#A21F3A]",
    textColor: "text-[#A21F3A]",
    borderColor: "border-[#CB2749]",
    tiles: [
      { type: "fast-forward", description: "Get around in a city" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "book", description: "One thing" },
      // { type: "treasure" },
      { type: "star", description: "Get around in a city" },
      { type: "book", description: "A very big family" },
      { type: "star", description: "Greet people" },
      { type: "book", description: "The red jacket" },
      // { type: "treasure" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "trophy", description: "Unit 2 review" },
    ],
  },
  {
    unitNumber: 3,
    description: "How to loop",
    backgroundColor: "bg-[#7C7060]",
    textColor: "text-[#7C7060]",
    borderColor: "border-[#9B8C79]",
    tiles: [
      { type: "fast-forward", description: "Order food and drink" },
      { type: "book", description: "The passport" },
      { type: "star", description: "Order food and drinks" },
      // { type: "treasure" },
      { type: "book", description: "The honeymoon" },
      { type: "star", description: "Get around in a city" },
      // { type: "treasure" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "book", description: "Doctor Eddy" },
      { type: "trophy", description: "Unit 2 review" },
    ],
  },
];

export const questions = [
  {
    id: 1,
    question_type: "mcq",
    question_text: "What is the capital of France?",
    options: [
      { id: 1, option_text: "Berlin" },
      { id: 2, option_text: "Madrid" },
      { id: 3, option_text: "Paris" },
      { id: 5, option_text: "Paris" },
      { id: 6, option_text: "Paris" },
      { id: 7, option_text: "Paris" },
      { id: 8, option_text: "Paris" },
      { id: 9, option_text: "Paris" },
      { id: 4, option_text: "Rome" },
    ],
    correct_option_id: 3,
  },
  {
    id: 2,
    question_type: "fill",
    question_text: "What is the capital of France?",
    correct_answer: "Paris",
  },
];

// Mock profile + subscription data (UI only; replace with API calls later)
export const MOCK_PROFILE = {
  id: "user_123",
  name: "Jane Developer",
  email: "jane.developer@example.com",
  avatarUrl: "/public/assets/Logo.png", // fallback asset
  badges: [
    // Added imageUrl for visual circular badge display in ProfileBanner
    { id: "b1", label: "Early", color: "#E9B44C", imageUrl: "/public/assets/Achievements.svg" },
    { id: "b2", label: "Streak", color: "#2D936C", imageUrl: "/public/assets/Streak.svg" },
    { id: "b3", label: "Champion", color: "#CB2749", imageUrl: "/public/assets/Leaderboard.svg" },
    { id: "b4", label: "Beta", color: "#9799CA", imageUrl: "/public/assets/Settings.svg" },
  ],
  subscription: {
    plan: "Free",
    renewsOn: null,
  },
};

export const MOCK_SUBSCRIPTION_PLANS = [
  { id: "free", name: "Free", price: 0, features: ["Basic lessons", "Community leaderboard"] },
  { id: "pro", name: "Pro", price: 9.99, features: ["All lessons", "Unlimited tests", "Priority support"] },
  { id: "team", name: "Team", price: 39.0, features: ["Team management", "Shared progress", "Reports"] },
];

// Mock courses for user dropdown fallback (shape aligned to listUserCourses usage)
export const MOCK_USER_COURSES = [
  { id: 1, course_title: "C++ Foundations", course_description: "Basics, syntax, and first programs" },
  { id: 2, course_title: "C++ OOP", course_description: "Classes, objects, inheritance" },
  { id: 3, course_title: "Data Structures", course_description: "Vectors, lists, maps, and more" },
  { id: 4, course_title: "Algorithms", course_description: "Sorting, searching, and complexity" },
  { id: 5, course_title: "STL Mastery", course_description: "Practical STL containers and algorithms" },
  { id: 6, course_title: "Modern C++", course_description: "C++11/14/17 features in practice" },
];

// Paid subscription (single-user) upgrade plan mock data for Subscription page cards
// Tailored to highlight benefits: more XP, streak saver, faster energy regeneration.
export const MOCK_SUBSCRIPTION_PLANS_PAID = [
  {
    id: "monthly",
    name: "Monthly",
    cadence: "Billed monthly",
    price: 7.99,
    priceLabel: "$7.99/mo",
    highlight: "Flexible access",
    savingsNote: null,
    perks: [
      "+20% XP boost on lessons",
      "1 Streak Saver per month included",
      "Energy refills 25% faster",
      "Access to all current & future units",
      "Priority in new feature betas"
    ],
  },
  {
    id: "annual",
    name: "Annual",
    cadence: "Billed yearly",
    price: 79.99,
    priceLabel: "$79.99/yr",
    highlight: "Best value",
    savingsNote: "Save 17% vs monthly",
    perks: [
      "+25% XP boost on lessons",
      "2 Streak Savers per month included",
      "Energy refills 35% faster",
      "Access to all current & future units",
      "Exclusive seasonal badge",
      "Priority in new feature betas"
    ],
    featured: true,
  },
];

// --- Admin mock data additions ---
// Order controls display in AdminSidebar (logo + username rendered separately)
export const MOCK_ADMIN_NAV = [
  { id: 'nav_users', label: 'Users', to: '/admin/users', icon: 'users' },
  { id: 'nav_course', label: 'Course', to: '/admin/course', icon: 'course' },
  { id: 'nav_achievement', label: 'Achievement', to: '/admin/achievement', icon: 'trophy' },
  { id: 'nav_feedback', label: 'Feedback', to: '/admin/feedback', icon: 'feedback' },
  { id: 'nav_subscriptions', label: 'Subscriptions', to: '/admin/subscriptions', icon: 'credit-card' },
  { id: 'nav_daily_streaks', label: 'Daily Streaks', to: '/admin/daily-streaks', icon: 'fire' },
  { id: 'nav_user_gameinfos', label: 'User Game Infos', to: '/admin/user-gameinfos', icon: 'game' },
  { id: 'nav_user_claimed_achievements', label: 'User Claimed Achievements', to: '/admin/user-claimed-achievements', icon: 'badge' },
  { id: 'nav_user_courses', label: 'User Courses', to: '/admin/user-courses', icon: 'book' },
  { id: 'nav_user_tests', label: 'User Tests', to: '/admin/user-tests', icon: 'test' },
];

// Mock subscription records (would come from backend)
export const MOCK_ADMIN_SUBSCRIPTIONS = [
  {
    subscription_id: 'sub_001',
    user_id: 'user_123',
    type: 'month',
    start_date: '2025-09-01',
    end_date: '2025-10-01',
    status: 'active',
    is_renewable: true,
    amount: 9.99,
  },
  {
    subscription_id: 'sub_002',
    user_id: 'user_456',
    type: 'year',
    start_date: '2024-10-10',
    end_date: '2025-10-10',
    status: 'expired',
    is_renewable: false,
    amount: 79.99,
  },
  {
    subscription_id: 'sub_003',
    user_id: 'user_789',
    type: 'month',
    start_date: '2025-09-20',
    end_date: '2025-10-20',
    status: 'pending_payment',
    is_renewable: true,
    amount: 9.99,
  }
];

// Central place to configure which field acts as the primary key for admin subscription records
export const ADMIN_SUBSCRIPTION_PRIMARY_KEY = 'subscription_id';

// --- Feedback (admin) mock data ---
// Schema reference:
// (PK) feedback_id
// message (text)
// (FK) created_by (user id or username)
// created_date (ISO string)
// (FK) updated_by
// updated_date (ISO string nullable)
export const MOCK_ADMIN_FEEDBACK = [
  {
    feedback_id: 'fb_001',
    message: 'Loving the new streak feature, but could we have a weekly summary email?',
    created_by: 'Jane Developer',
    created_date: '2025-09-10T14:05:00Z',
    updated_by: null,
    updated_date: null,
  },
  {
    feedback_id: 'fb_002',
    message: 'Dark mode contrast on buttons could be improved for accessibility.',
    created_by: 'John Tester',
    created_date: '2025-09-12T09:22:00Z',
    updated_by: 'Admin User',
    updated_date: '2025-09-15T11:40:00Z',
  },
  {
    feedback_id: 'fb_003',
    message: 'Suggestion: Add a practice mode without affecting energy levels.',
    created_by: 'Alice Analyst',
    created_date: '2025-09-18T18:30:00Z',
    updated_by: null,
    updated_date: null,
  }
];

export const ADMIN_FEEDBACK_PRIMARY_KEY = 'feedback_id';

// --- Achievements (admin) mock data ---
// Schema reference:
// (PK) achievement_id
// target_xp_value (NULLABLE)
// target_streak_value (NULLABLE)
// (FK) target_completed_test_id (NULLABLE)
// reward_type (xp, energy, badge)
// reward_amount (NULLABLE)
// reward_content (used by badge) (NULLABLE)
// reward_content_description (used by badge) (NULLABLE)

export const MOCK_ADMIN_ACHIEVEMENTS = [
  {
    achievement_id: 'achv_001',
    target_xp_value: 500,
    target_streak_value: null,
    target_completed_test_id: null,
    reward_type: 'xp',
    reward_amount: 100,
    reward_content: null,
    reward_content_description: null,
  },
  {
    achievement_id: 'achv_002',
    target_xp_value: null,
    target_streak_value: 7,
    target_completed_test_id: null,
    reward_type: 'energy',
    reward_amount: 5,
    reward_content: null,
    reward_content_description: null,
  },
  {
    achievement_id: 'achv_003',
    target_xp_value: null,
    target_streak_value: null,
    target_completed_test_id: 'test_101',
    reward_type: 'badge',
    reward_amount: null,
    reward_content: 'early_bird',
    reward_content_description: 'Awarded for completing the placement test',
  },
];

export const ADMIN_ACHIEVEMENT_PRIMARY_KEY = 'achievement_id';

// --- Users (admin) mock data ---
// Schema reference:
// (PK) user_id
// username
// email
// password_hash (NEVER expose in UI; only send password on create/update if changed)
// profile_icon (nullable string - URL or identifier)
// role (student, lecturer, admin)
// registration_date (ISO string)
// enable_email_notification (boolean)
export const MOCK_ADMIN_USERS = [
  {
    user_id: 'user_123',
    username: 'Jane Developer',
    email: 'jane.developer@example.com',
    profile_icon: null,
    role: 'admin',
    registration_date: '2025-08-15T10:00:00Z',
    enable_email_notification: true,
  },
  {
    user_id: 'user_456',
    username: 'John Tester',
    email: 'john.tester@example.com',
    profile_icon: null,
    role: 'student',
    registration_date: '2025-09-01T08:30:00Z',
    enable_email_notification: false,
  },
  {
    user_id: 'user_789',
    username: 'Alice Analyst',
    email: 'alice.analyst@example.com',
    profile_icon: null,
    role: 'lecturer',
    registration_date: '2025-09-05T14:45:00Z',
    enable_email_notification: true,
  },
];

export const ADMIN_USER_PRIMARY_KEY = 'id';

// --- User Game Infos (admin) mock data ---
// Schema reference:
// (PK) gameinfo_id
// (FK) user_id
// xp_value (number)
// energy_value (number)
// energy_last_updated_date (ISO date string nullable)
export const MOCK_ADMIN_USER_GAMEINFOS = [
  {
    gameinfo_id: 'ginfo_001',
    user_id: 'user_123',
    username: 'Jane Developer',
    xp_value: 1520,
    energy_value: 8,
    energy_last_updated_date: '2025-09-20T10:00:00Z',
  },
  {
    gameinfo_id: 'ginfo_002',
    user_id: 'user_456',
    username: 'John Tester',
    xp_value: 340,
    energy_value: 3,
    energy_last_updated_date: '2025-09-22T15:12:00Z',
  },
  {
    gameinfo_id: 'ginfo_003',
    user_id: 'user_789',
    username: 'Alice Analyst',
    xp_value: 910,
    energy_value: 10,
    energy_last_updated_date: null,
  },
];
export const ADMIN_USER_GAMEINFO_PRIMARY_KEY = 'gameinfo_id';

// --- Daily Streaks (admin) mock data ---
// Schema reference:
// (PK) daily_streak_id
// (FK) user_id
// daily_streak_date (ISO date for the day of streak entry)
// is_streak_saver (boolean indicates if a streak saver was used on that date)
export const MOCK_ADMIN_DAILY_STREAKS = [
  {
    daily_streak_id: 'streak_001',
    user_id: 'user_123',
    username: 'Jane Developer',
    daily_streak_date: '2025-09-23',
    is_streak_saver: false,
  },
  {
    daily_streak_id: 'streak_002',
    user_id: 'user_123',
    username: 'Jane Developer',
    daily_streak_date: '2025-09-24',
    is_streak_saver: true,
  },
  {
    daily_streak_id: 'streak_003',
    user_id: 'user_456',
    username: 'John Tester',
    daily_streak_date: '2025-09-24',
    is_streak_saver: false,
  },
];
export const ADMIN_DAILY_STREAK_PRIMARY_KEY = 'daily_streak_id';

// --- User Claimed Achievements (admin) mock data ---
// Schema reference:
// (PK) user_claimed_achievement_id
// (FK) user_id
// (FK) achievement_id
// claimed_date (ISO date string)
export const MOCK_ADMIN_USER_CLAIMED_ACHIEVEMENTS = [
  {
    user_claimed_achievement_id: 'uca_001',
    user_id: 'user_123',
    username: 'Jane Developer',
    achievement_id: 'achv_001',
    claimed_date: '2025-09-24',
  },
  {
    user_claimed_achievement_id: 'uca_002',
    user_id: 'user_456',
    username: 'John Tester',
    achievement_id: 'achv_003',
    claimed_date: '2025-09-20',
  },
];
export const ADMIN_USER_CLAIMED_ACHIEVEMENT_PRIMARY_KEY = 'user_claimed_achievement_id';

// --- User Courses (admin) mock data ---
// Schema reference:
// (PK) user_course_id
// (FK) course_id
// (FK) user_id
// enrollment_date (ISO date string)
// is_dropped (boolean)
export const MOCK_ADMIN_USER_COURSES = [
  {
    user_course_id: 'uc_001',
    user_id: 'user_123',
    username: 'Jane Developer',
    course_id: 'course_101',
    course_title: 'Intro to C++',
    enrollment_date: '2025-08-20',
    is_dropped: false,
  },
  {
    user_course_id: 'uc_002',
    user_id: 'user_456',
    username: 'John Tester',
    course_id: 'course_102',
    course_title: 'Data Structures',
    enrollment_date: '2025-09-01',
    is_dropped: true,
  },
];
export const ADMIN_USER_COURSE_PRIMARY_KEY = 'user_course_id';

// --- User Tests (admin) mock data ---
// Schema reference:
// (PK) user_test_id
// (FK) user_id
// (FK) test_id
// attempt_date (ISO datetime string)
// time_spent (seconds)
export const MOCK_ADMIN_USER_TESTS = [
  {
    user_test_id: 'ut_001',
    user_id: 'user_123',
    username: 'Jane Developer',
    test_id: 'test_101',
    test_title: 'Placement Test',
    attempt_date: '2025-09-20T10:30:00Z',
    time_spent: 540,
  },
  {
    user_test_id: 'ut_002',
    user_id: 'user_456',
    username: 'John Tester',
    test_id: 'test_202',
    test_title: 'Unit 2 Review',
    attempt_date: '2025-09-22T16:05:00Z',
    time_spent: 780,
  },
];
export const ADMIN_USER_TEST_PRIMARY_KEY = 'user_test_id';

// --- User Test Answers (embedded under User Tests) mock data ---
// Schema reference:
// (PK) user_test_answer_id
// (FK) user_test_id
// given_answer_text (text)
// is_correct (boolean)
export const MOCK_ADMIN_USER_TEST_ANSWERS = [
  // Answers for ut_001
  { user_test_answer_id: 'uta_001', user_test_id: 'ut_001', given_answer_text: 'Paris', is_correct: true },
  { user_test_answer_id: 'uta_002', user_test_id: 'ut_001', given_answer_text: 'Madrid', is_correct: false },
  // Answers for ut_002
  { user_test_answer_id: 'uta_003', user_test_id: 'ut_002', given_answer_text: 'O(n log n)', is_correct: true },
];
export const ADMIN_USER_TEST_ANSWER_PRIMARY_KEY = 'user_test_answer_id';

// --- Tests (admin) mock data ---
// Schema reference:
// (PK) test_id
// (FK) chapter_id
// passing_score (NULLABLE)
// title
// order_index
// Note: We include joined course and chapter fields for display convenience
export const MOCK_ADMIN_TESTS = [
  {
    test_id: 'test_101',
    title: 'Placement Test',
    passing_score: 70,
    order_index: 1,
    chapter_id: 'chap_001',
    chapter_title: 'Intro Basics',
    chapter_description: null,
    chapter_learning_resource_url: null,
    chapter_order_index: 1,
    course_id: 'course_101',
    course_title: 'Intro to C++',
    course_status: 'active',
  },
  {
    test_id: 'test_202',
    title: 'Unit 2 Review',
    passing_score: 60,
    order_index: 2,
    chapter_id: 'chap_010',
    chapter_title: 'Loops and Conditions',
    chapter_description: 'Practice loops & conditionals',
    chapter_learning_resource_url: 'https://example.com/learn/loops',
    chapter_order_index: 3,
    course_id: 'course_102',
    course_title: 'Data Structures',
    course_status: 'draft',
  },
];
export const ADMIN_TEST_PRIMARY_KEY = 'test_id';

// --- Questions (admin) mock data ---
// Schema reference:
// (PK) question_id
// (FK) test_id
// text
// type (MCQ, fill_in_blank)
// correct_answer_text
// order_index
export const MOCK_ADMIN_QUESTIONS = [
  {
    question_id: 'q_001',
    test_id: 'test_101',
    text: 'What is C++?',
    type: 'mcq',
    correct_answer_text: 'A programming language',
    order_index: 1,
  },
  {
    question_id: 'q_002',
    test_id: 'test_101',
    text: 'Fill the blank: ____ is compiled.',
    type: 'fill_in_blank',
    correct_answer_text: 'C++',
    order_index: 2,
  },
  {
    question_id: 'q_010',
    test_id: 'test_202',
    text: 'Which loop repeats a fixed number of times?',
    type: 'mcq',
    correct_answer_text: 'for loop',
    order_index: 1,
  },
];
export const ADMIN_QUESTION_PRIMARY_KEY = 'question_id';

// --- Question Choices (admin) mock data ---
// Schema reference:
// (PK) choice_id
// (FK) question_id
// text
// order_index
export const MOCK_ADMIN_QUESTION_CHOICES = [
  // For q_001 (MCQ)
  { choice_id: 'c_001', question_id: 'q_001', text: 'A database', order_index: 1 },
  { choice_id: 'c_002', question_id: 'q_001', text: 'A programming language', order_index: 2 },
  { choice_id: 'c_003', question_id: 'q_001', text: 'An operating system', order_index: 3 },
  // For q_010 (MCQ)
  { choice_id: 'c_010', question_id: 'q_010', text: 'for loop', order_index: 1 },
  { choice_id: 'c_011', question_id: 'q_010', text: 'while loop', order_index: 2 },
  { choice_id: 'c_012', question_id: 'q_010', text: 'do-while loop', order_index: 3 },
];
export const ADMIN_QUESTION_CHOICE_PRIMARY_KEY = 'choice_id';

// --- Courses (admin) mock data ---
// Schema:
// (PK) course_id, title, description (nullable), status (active, archived, draft)
export const MOCK_ADMIN_COURSES = [
  { course_id: 'course_101', title: 'Intro to C++', description: 'Basics of C++', status: 'active' },
  { course_id: 'course_102', title: 'Data Structures', description: 'Core data structures', status: 'draft' },
];
export const ADMIN_COURSE_PRIMARY_KEY = 'course_id';

// --- Chapters (admin) mock data ---
// Schema:
// (PK) chapter_id, (FK) course_id, title, description (nullable), learning_resource_url (nullable), order_index
export const MOCK_ADMIN_CHAPTERS = [
  { chapter_id: 'chap_001', course_id: 'course_101', title: 'Intro Basics', description: null, learning_resource_url: null, order_index: 1 },
  { chapter_id: 'chap_010', course_id: 'course_102', title: 'Loops and Conditions', description: 'Practice loops', learning_resource_url: 'https://example.com/loops', order_index: 3 },
];
export const ADMIN_CHAPTER_PRIMARY_KEY = 'chapter_id';

// --- Leaderboard (client) mock data ---
// Shape assumption: each item has { username, streak_value, avatar_url? }
// Used as a fallback for the Home Leaderboard UI when API is unavailable.
export const MOCK_LEADERBOARD_TOP50 = Array.from({ length: 15 }).map((_, i) => ({
  rank: i + 1,
  username: i === 0 ? 'BigOrange' : `User_${String(i + 1).padStart(2, '0')}`,
  streak_value: i === 0 ? 100 : 98 - Math.floor(i / 2),
  avatar_url: i === 0 ? '/assets/Icon.jpg' : null,
}));