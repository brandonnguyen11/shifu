import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    id: "mission",
    title: "Mission",
    body: "Tutoring works because of the relationship between one tutor and one student. Most software gets in the way of that relationship by scattering it across a calendar app, a video call, a shared drive, and a spreadsheet. Roomline keeps the whole relationship in one place so the teaching stays the hard part and the admin stops being one.",
  },
  {
    id: "approach",
    title: "Approach",
    body: "Every session, note, assignment, and grade is written back to the student's room. That record is what powers progress tracking and recommendations, and it belongs to the tutor and the student rather than to us. Nothing is published to a student, parent, or grade book without the tutor approving it first.",
  },
  {
    id: "careers",
    title: "Careers",
    body: "We are a small team of engineers and former tutors. We hire people who have sat on both sides of a tutoring session and care about the boring parts of the work: scheduling, invoicing, follow-ups, and records that hold up over a school year.",
  },
  {
    id: "contact",
    title: "Contact",
    body: "For product questions, partnerships, or district pilots, reach the team at hello@roomline.com. We answer every message from a real person, usually within one business day.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-24">
          <p className="text-[13px] font-medium text-zinc-500">About</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-zinc-950">
            Built for the people who actually run the sessions.
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Roomline is a tutoring operating system for independent tutors and
            small tutoring businesses.
          </p>

          <div className="mt-14 space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-[15px] font-medium text-zinc-900">
                  {section.title}
                </h2>
                <p className="mt-3 leading-7 text-zinc-600">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
