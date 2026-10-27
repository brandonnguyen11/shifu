export type NavItem = { href: string; label: string };

export const tutorNav: NavItem[] = [
  { href: "/tutor", label: "Dashboard" },
  { href: "/tutor/students", label: "Students" },
  { href: "/tutor/calendar", label: "Calendar" },
  { href: "/tutor/assignments", label: "Assignments" },
  { href: "/tutor/messages", label: "Messages" },
  { href: "/tutor/payments", label: "Payments" },
];

export const studentNav: NavItem[] = [
  { href: "/student/room", label: "My room" },
  { href: "/student/assignments", label: "Assignments" },
  { href: "/student/progress", label: "Progress" },
  { href: "/student/sessions", label: "Sessions" },
  { href: "/student/messages", label: "Messages" },
];
