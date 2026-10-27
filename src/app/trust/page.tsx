import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const policies = [
  {
    id: "ferpa",
    title: "FERPA",
    body: "When a tutor works with a school or district, Roomline operates as a school official with a legitimate educational interest under 34 CFR 99.31(a)(1). Education records stay under the control of the institution, are used only to deliver the service, and are never sold or used to train third-party models. Records are returned or deleted on request.",
  },
  {
    id: "coppa",
    title: "COPPA",
    body: "Students under 13 can only be added with verifiable parental consent, collected during account creation and recorded on the student profile. Accounts for minors have messaging, file sharing, and public profile features restricted by default until a tutor or parent enables them.",
  },
  {
    id: "privacy",
    title: "Privacy policy",
    body: "We collect the minimum needed to run sessions, track progress, and process payments. Student work, notes, and grades are visible to the assigned tutor, the student, and any parent the tutor has explicitly granted access. Private tutor notes are never exposed to students or parents.",
  },
  {
    id: "terms",
    title: "Terms of service",
    body: "Tutors own their content and their client relationships. Roomline provides the software, processes payments through a third-party processor, and does not take a commission on session revenue. Either party can terminate at any time, and tutors can export their students, notes, and records on the way out.",
  },
  {
    id: "security",
    title: "Security",
    body: "Data is encrypted in transit and at rest. Access is scoped by role, so a tutor can only reach their own students and an organization admin can only reach their own tutors. Uploaded files are served through short-lived signed URLs, and every AI action is written to an audit log with its inputs, outputs, and approval status.",
  },
  {
    id: "dpa",
    title: "Data processing",
    body: "Schools, districts, and tutoring centers can execute a data processing agreement covering processing purpose, retention windows, breach notification timelines, and deletion obligations. Contact us to request the current version.",
  },
  {
    id: "subprocessors",
    title: "Subprocessors",
    body: "We use a small set of vendors for hosting, payments, video, transactional email, and model inference. The current list, along with what data each one receives, is published and updated before any new subprocessor is added.",
  },
  {
    id: "status",
    title: "Status",
    body: "Uptime and incident history are published publicly. Sessions, rooms, and student records are backed up daily with point-in-time recovery.",
  },
];

export default function TrustPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-24">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-zinc-500">
              Trust and compliance
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-zinc-950">
              Student records deserve boring, predictable handling.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Plain-language summaries of how Roomline treats student data. The
              full legal text is available on request.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[200px_1fr]">
            <nav className="hidden lg:block">
              <div className="sticky top-24 space-y-2">
                {policies.map((policy) => (
                  <a
                    key={policy.id}
                    href={`#${policy.id}`}
                    className="block text-[13px] text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    {policy.title}
                  </a>
                ))}
              </div>
            </nav>

            <div className="divide-y divide-zinc-200 border-t border-zinc-200">
              {policies.map((policy) => (
                <section
                  key={policy.id}
                  id={policy.id}
                  className="scroll-mt-24 py-8"
                >
                  <h2 className="text-[15px] font-medium text-zinc-900">
                    {policy.title}
                  </h2>
                  <p className="mt-3 max-w-3xl leading-7 text-zinc-600">
                    {policy.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
