import { Panel, PanelHeader, StatCard } from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { weekCalendar } from "@/lib/data";

const hours = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const availability = [
  { day: "Monday", window: "9:00 AM – 7:00 PM" },
  { day: "Tuesday", window: "3:00 PM – 8:00 PM" },
  { day: "Wednesday", window: "3:00 PM – 8:00 PM" },
  { day: "Thursday", window: "3:00 PM – 8:00 PM" },
  { day: "Friday", window: "Unavailable" },
  { day: "Saturday", window: "9:00 AM – 1:00 PM" },
];

export default function CalendarPage() {
  return (
    <TutorShell
      title="Calendar"
      subtitle="Week of September 14"
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Edit availability
          </span>
          <span className={buttonVariants({ size: "sm" })}>New session</span>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Booked this week" value="7" note="8.5 hours" />
        <StatCard label="Open blocks" value="5" note="available for booking" />
        <StatCard label="Utilization" value="58%" note="of published hours" />
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelHeader title="Week view" note="Times shown in your local timezone" />
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-zinc-200 bg-zinc-50/60">
              <div />
              {weekCalendar.map((day) => (
                <div
                  key={day.day}
                  className="border-l border-zinc-200 px-3 py-2 text-center"
                >
                  <p className="text-[12px] text-zinc-500">{day.day}</p>
                  <p className="text-[13px] font-medium text-zinc-900">
                    {day.date}
                  </p>
                </div>
              ))}
            </div>

            {hours.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-zinc-100 last:border-b-0"
              >
                <div className="px-2 py-3 text-right text-[11px] text-zinc-400 tabular-nums">
                  {hour}
                </div>
                {weekCalendar.map((day) => {
                  const slots = day.slots.filter(
                    (entry) => entry.time.split(":")[0] === hour.split(":")[0]
                  );
                  return (
                    <div
                      key={`${day.day}-${hour}`}
                      className="space-y-1 border-l border-zinc-100 p-1"
                    >
                      {slots.map((slot) => (
                        <div
                          key={slot.time}
                          className={`rounded-md px-2 py-1.5 text-[11px] leading-4 ${
                            slot.label === "Open block"
                              ? "border border-dashed border-zinc-300 text-zinc-500"
                              : "bg-zinc-900 text-white"
                          }`}
                        >
                          {slot.label}
                          <span className="block opacity-70">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader
          title="Published availability"
          note="What students see on your booking page"
        />
        <div className="grid divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-y-0">
          {availability.map((entry) => (
            <div
              key={entry.day}
              className="flex items-center justify-between px-4 py-3 sm:border-b sm:border-zinc-100"
            >
              <span className="text-[13px] text-zinc-700">{entry.day}</span>
              <span
                className={`text-[13px] ${
                  entry.window === "Unavailable"
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                {entry.window}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </TutorShell>
  );
}
