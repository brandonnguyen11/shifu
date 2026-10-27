import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/workspace-shell";
import { studentNav, tutorNav } from "@/lib/nav";
import { getUser, initialsOf } from "@/lib/session";

type ShellProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
};

export async function TutorShell({
  title,
  subtitle,
  actions,
  children,
}: ShellProps) {
  const user = await getUser();
  const name = user?.name ?? "Tutor";

  return (
    <WorkspaceShell
      role="Tutor"
      name={name}
      initials={initialsOf(name)}
      nav={tutorNav}
      title={title}
      subtitle={subtitle}
      actions={actions}
    >
      {children}
    </WorkspaceShell>
  );
}

export async function StudentShell({
  title,
  subtitle,
  actions,
  children,
}: ShellProps) {
  const user = await getUser();
  const name = user?.name ?? "Student";

  return (
    <WorkspaceShell
      role="Student"
      name={name}
      initials={initialsOf(name)}
      nav={studentNav}
      title={title}
      subtitle={subtitle}
      actions={actions}
    >
      {children}
    </WorkspaceShell>
  );
}
