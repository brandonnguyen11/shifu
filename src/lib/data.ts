export type Skill = { skill: string; mastery: number; trend: number };

export type TimelineEvent = {
  date: string;
  kind: "session" | "assignment" | "quiz" | "note" | "mastery" | "payment";
  title: string;
  detail: string;
};

export type Student = {
  id: string;
  name: string;
  initials: string;
  subject: string;
  grade: string;
  cadence: string;
  status: "On track" | "Needs focus" | "Late work" | "Trial";
  mastery: number;
  attendance: number;
  assignmentsComplete: string;
  nextSession: string;
  parent: string;
  goal: string;
  skills: Skill[];
  strengths: string[];
  weaknesses: string[];
  timeline: TimelineEvent[];
  notes: { date: string; visibility: "Private" | "Shared"; body: string }[];
};

export const students: Student[] = [
  {
    id: "emma-reyes",
    name: "Emma Reyes",
    initials: "ER",
    subject: "Algebra II",
    grade: "Grade 10",
    cadence: "Tuesdays and Thursdays",
    status: "Needs focus",
    mastery: 68,
    attendance: 96,
    assignmentsComplete: "12/14",
    nextSession: "Today, 4:00 PM",
    parent: "Daniel Reyes",
    goal: "Pass the unit 4 exam with an 85 or better.",
    skills: [
      { skill: "Functions", mastery: 91, trend: 4 },
      { skill: "Quadratic equations", mastery: 82, trend: 7 },
      { skill: "Word problems", mastery: 74, trend: -2 },
      { skill: "Factoring", mastery: 61, trend: -9 },
    ],
    strengths: [
      "Sets up equations correctly before solving",
      "Strong with function notation and graph reading",
    ],
    weaknesses: [
      "Sign errors when factoring negative coefficients",
      "Rushes the final simplification step under time pressure",
    ],
    timeline: [
      {
        date: "Sep 12",
        kind: "quiz",
        title: "Quadratics quiz graded",
        detail: "84%, up from 62% two weeks ago.",
      },
      {
        date: "Sep 10",
        kind: "assignment",
        title: "Targeted factoring set assigned",
        detail: "12 questions built from her last two quizzes.",
      },
      {
        date: "Sep 07",
        kind: "note",
        title: "Session note saved",
        detail: "Understands the method, makes sign errors when rushed.",
      },
      {
        date: "Sep 05",
        kind: "quiz",
        title: "Factoring quiz graded",
        detail: "62%, a 15 point drop from the prior attempt.",
      },
      {
        date: "Sep 01",
        kind: "session",
        title: "Session completed",
        detail: "Reviewed quadratic formula and discriminant.",
      },
    ],
    notes: [
      {
        date: "Sep 12",
        visibility: "Shared",
        body: "Great recovery on the quiz. Keep showing each factoring step instead of jumping to the answer.",
      },
      {
        date: "Sep 07",
        visibility: "Private",
        body: "Anxious about the unit exam. Keep sessions light on new material until confidence recovers.",
      },
    ],
  },
  {
    id: "ava-mitchell",
    name: "Ava Mitchell",
    initials: "AM",
    subject: "AP Calculus",
    grade: "Grade 12",
    cadence: "Mondays",
    status: "On track",
    mastery: 84,
    attendance: 100,
    assignmentsComplete: "18/18",
    nextSession: "Monday, 11:30 AM",
    parent: "Rachel Mitchell",
    goal: "Score a 4 or better on the AP exam in May.",
    skills: [
      { skill: "Limits", mastery: 94, trend: 2 },
      { skill: "Derivatives", mastery: 88, trend: 5 },
      { skill: "Chain rule", mastery: 79, trend: 11 },
      { skill: "Implicit differentiation", mastery: 71, trend: 6 },
    ],
    strengths: ["Fast and accurate with routine derivatives", "Reliable homework completion"],
    weaknesses: ["Composite functions with nested chain rule"],
    timeline: [
      {
        date: "Sep 11",
        kind: "mastery",
        title: "Chain rule mastery improved",
        detail: "68% to 79% after two targeted sets.",
      },
      {
        date: "Sep 08",
        kind: "session",
        title: "Session completed",
        detail: "Chain rule with trig and exponential composites.",
      },
    ],
    notes: [
      {
        date: "Sep 08",
        visibility: "Shared",
        body: "Start timing practice sets so exam pacing becomes automatic.",
      },
    ],
  },
  {
    id: "james-keller",
    name: "James Keller",
    initials: "JK",
    subject: "SAT Math",
    grade: "Grade 11",
    cadence: "Wednesdays",
    status: "Late work",
    mastery: 73,
    attendance: 82,
    assignmentsComplete: "7/11",
    nextSession: "Wednesday, 4:30 PM",
    parent: "Monica Keller",
    goal: "Raise the math section from 620 to 700.",
    skills: [
      { skill: "Heart of algebra", mastery: 81, trend: 3 },
      { skill: "Problem solving", mastery: 76, trend: 1 },
      { skill: "Passport to advanced math", mastery: 64, trend: -4 },
      { skill: "Geometry and trig", mastery: 58, trend: 0 },
    ],
    strengths: ["Strong mental math", "Good at eliminating wrong answers"],
    weaknesses: ["Skips written work and loses track of steps", "Misses assignment deadlines"],
    timeline: [
      {
        date: "Sep 11",
        kind: "assignment",
        title: "Assignment overdue",
        detail: "Practice section 3 is three days past due.",
      },
      {
        date: "Sep 04",
        kind: "session",
        title: "Session completed",
        detail: "Timed section with review of missed questions.",
      },
    ],
    notes: [
      {
        date: "Sep 04",
        visibility: "Private",
        body: "Juggling fall sports. Shorter, more frequent assignments work better than one long set.",
      },
    ],
  },
  {
    id: "noah-patel",
    name: "Noah Patel",
    initials: "NP",
    subject: "Geometry",
    grade: "Grade 9",
    cadence: "Thursdays",
    status: "On track",
    mastery: 91,
    attendance: 94,
    assignmentsComplete: "15/16",
    nextSession: "Thursday, 5:30 PM",
    parent: "Priya Patel",
    goal: "Finish the semester with an A and place into honors.",
    skills: [
      { skill: "Proofs", mastery: 93, trend: 6 },
      { skill: "Triangles", mastery: 92, trend: 2 },
      { skill: "Circles", mastery: 88, trend: 4 },
      { skill: "Coordinate geometry", mastery: 86, trend: 3 },
    ],
    strengths: ["Writes clean two-column proofs", "Asks precise questions"],
    weaknesses: ["Occasional arithmetic slips on coordinate problems"],
    timeline: [
      {
        date: "Sep 09",
        kind: "session",
        title: "Session completed",
        detail: "Circle theorems and inscribed angles.",
      },
    ],
    notes: [
      {
        date: "Sep 09",
        visibility: "Shared",
        body: "Ready for honors placement material. Adding one stretch problem per set.",
      },
    ],
  },
  {
    id: "michael-tran",
    name: "Michael Tran",
    initials: "MT",
    subject: "Pre-Calculus",
    grade: "Grade 11",
    cadence: "Trial completed",
    status: "Trial",
    mastery: 0,
    attendance: 100,
    assignmentsComplete: "0/0",
    nextSession: "Not scheduled",
    parent: "Lien Tran",
    goal: "Decide whether to continue after the trial session.",
    skills: [],
    strengths: ["Engaged through the full trial session"],
    weaknesses: ["Unit circle recall"],
    timeline: [
      {
        date: "Sep 13",
        kind: "session",
        title: "Trial session completed",
        detail: "Covered unit circle basics. No follow-up booked yet.",
      },
    ],
    notes: [
      {
        date: "Sep 13",
        visibility: "Private",
        body: "Interested in a weekly slot. Send package options before Tuesday.",
      },
    ],
  },
];

export function getStudent(id: string) {
  return students.find((student) => student.id === id);
}

export const todaySchedule = [
  {
    time: "9:00 AM",
    student: "Emma Reyes",
    studentId: "emma-reyes",
    subject: "Algebra II",
    length: "60 min",
    state: "Prep ready",
  },
  {
    time: "11:30 AM",
    student: "Ava Mitchell",
    studentId: "ava-mitchell",
    subject: "AP Calculus",
    length: "60 min",
    state: "Confirmed",
  },
  {
    time: "2:00 PM",
    student: "Michael Tran",
    studentId: "michael-tran",
    subject: "Trial session",
    length: "30 min",
    state: "First session",
  },
  {
    time: "4:30 PM",
    student: "James Keller",
    studentId: "james-keller",
    subject: "SAT Math",
    length: "90 min",
    state: "Needs plan",
  },
];

export const weekCalendar = [
  { day: "Mon", date: "14", slots: [{ time: "11:30", label: "Ava Mitchell" }] },
  {
    day: "Tue",
    date: "15",
    slots: [
      { time: "16:00", label: "Emma Reyes" },
      { time: "18:00", label: "Noah Patel" },
    ],
  },
  { day: "Wed", date: "16", slots: [{ time: "16:30", label: "James Keller" }] },
  {
    day: "Thu",
    date: "17",
    slots: [
      { time: "16:00", label: "Emma Reyes" },
      { time: "17:30", label: "Noah Patel" },
    ],
  },
  { day: "Fri", date: "18", slots: [] },
  { day: "Sat", date: "19", slots: [{ time: "10:00", label: "Open block" }] },
  { day: "Sun", date: "20", slots: [] },
];

export const tutorAssignments = [
  {
    id: "factoring-set-4",
    title: "Factoring practice set 4",
    student: "Emma Reyes",
    subject: "Algebra II",
    due: "Sep 15",
    submitted: 0,
    total: 12,
    state: "Assigned",
  },
  {
    id: "chain-rule-mixed",
    title: "Chain rule mixed review",
    student: "Ava Mitchell",
    subject: "AP Calculus",
    due: "Sep 14",
    submitted: 14,
    total: 14,
    state: "Needs grading",
  },
  {
    id: "sat-section-3",
    title: "SAT practice section 3",
    student: "James Keller",
    subject: "SAT Math",
    due: "Sep 11",
    submitted: 0,
    total: 20,
    state: "Overdue",
  },
  {
    id: "circle-theorems",
    title: "Circle theorems proof set",
    student: "Noah Patel",
    subject: "Geometry",
    due: "Sep 16",
    submitted: 8,
    total: 10,
    state: "In progress",
  },
  {
    id: "quadratics-quiz",
    title: "Quadratics quiz",
    student: "Emma Reyes",
    subject: "Algebra II",
    due: "Sep 12",
    submitted: 10,
    total: 10,
    state: "Graded",
  },
];

export const conversations = [
  {
    id: "emma",
    name: "Emma Reyes",
    initials: "ER",
    role: "Student",
    preview: "Thanks! I'll redo questions 4 and 7 before Thursday.",
    time: "2h",
    unread: 0,
    thread: [
      { from: "them", time: "Yesterday, 6:12 PM", body: "I got stuck on question 4 of the factoring set." },
      { from: "me", time: "Yesterday, 6:40 PM", body: "Look at the sign on the middle term first. Factor out the negative before you split it." },
      { from: "them", time: "Today, 8:05 AM", body: "Thanks! I'll redo questions 4 and 7 before Thursday." },
    ],
  },
  {
    id: "monica",
    name: "Monica Keller",
    initials: "MK",
    role: "Parent of James",
    preview: "Can we move Wednesday to 5:30 this week?",
    time: "5h",
    unread: 1,
    thread: [
      { from: "them", time: "Today, 5:20 AM", body: "Can we move Wednesday to 5:30 this week?" },
    ],
  },
  {
    id: "michael",
    name: "Michael Tran",
    initials: "MT",
    role: "Trial student",
    preview: "That session was helpful, what are the next steps?",
    time: "1d",
    unread: 1,
    thread: [
      { from: "them", time: "Yesterday, 3:10 PM", body: "That session was helpful, what are the next steps?" },
    ],
  },
];

export const payments = [
  { date: "Sep 13", student: "Ava Mitchell", item: "10 session package", amount: "$850.00", state: "Paid" },
  { date: "Sep 12", student: "Michael Tran", item: "Trial session", amount: "$40.00", state: "Paid" },
  { date: "Sep 10", student: "Emma Reyes", item: "5 session package", amount: "$450.00", state: "Paid" },
  { date: "Sep 08", student: "James Keller", item: "Single session", amount: "$95.00", state: "Refunded" },
  { date: "Sep 05", student: "Noah Patel", item: "Monthly package", amount: "$320.00", state: "Paid" },
  { date: "Sep 01", student: "Emma Reyes", item: "Single session", amount: "$95.00", state: "Failed" },
];

export const packages = [
  { name: "Single session", price: "$95", detail: "60 minutes, no expiration" },
  { name: "5 session package", price: "$450", detail: "60 minutes each, expires in 3 months" },
  { name: "10 session package", price: "$850", detail: "60 minutes each, expires in 6 months" },
  { name: "Trial session", price: "$40", detail: "30 minutes, one per student" },
];

export const studentWork = [
  {
    title: "Factoring practice set 4",
    subject: "Algebra II",
    due: "Due tomorrow",
    state: "Not started",
    score: null,
  },
  {
    title: "Quadratics quiz",
    subject: "Algebra II",
    due: "Graded Sep 12",
    state: "Graded",
    score: "84%",
  },
  {
    title: "Chapter 4 review",
    subject: "Algebra II",
    due: "Graded Sep 03",
    state: "Graded",
    score: "72%",
  },
  {
    title: "Word problems set 2",
    subject: "Algebra II",
    due: "Graded Aug 28",
    state: "Graded",
    score: "88%",
  },
];

export const studentSessions = [
  { date: "Today, 4:00 PM", topic: "Factoring accuracy and mixed quadratics", state: "Upcoming" },
  { date: "Sep 11, 4:00 PM", topic: "Quadratic formula and the discriminant", state: "Completed" },
  { date: "Sep 07, 4:00 PM", topic: "Factoring with negative coefficients", state: "Completed" },
  { date: "Sep 04, 4:00 PM", topic: "Graphing parabolas from standard form", state: "Completed" },
  { date: "Aug 31, 4:00 PM", topic: "Unit 3 exam review", state: "Missed" },
];

export const binder = [
  { name: "Session summary — Sep 11", type: "Summary", size: "2 pages" },
  { name: "Whiteboard — factoring walkthrough", type: "Whiteboard", size: "4 boards" },
  { name: "Worksheet — mixed factoring", type: "PDF", size: "380 KB" },
  { name: "Study guide — unit 4 exam", type: "PDF", size: "1.2 MB" },
  { name: "Formula sheet — quadratics", type: "PDF", size: "210 KB" },
];
