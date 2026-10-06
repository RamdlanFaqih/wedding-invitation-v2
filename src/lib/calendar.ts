import { coupleNames, wedding } from "@/config/wedding";

function escapeICS(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
}

function timestamp(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function downloadCalendar() {
  const slug = `${wedding.bride.name}-${wedding.groom.name}`.toLowerCase();
  // The finish time is open-ended; omit DTEND rather than invent a duration.
  const events = wedding.events.flatMap((event) => [
    "BEGIN:VEVENT",
    `UID:${slug}-${event.id}@invitation.local`,
    `DTSTAMP:${timestamp(new Date().toISOString())}`,
    `DTSTART:${timestamp(event.date)}`,
    `SUMMARY:${escapeICS(`${event.title} — ${coupleNames}`)}`,
    `LOCATION:${escapeICS(`${event.venue}, ${event.address}`)}`,
    `DESCRIPTION:${escapeICS(`${event.time}. ${event.description}`)}`,
    `URL:${event.mapUrl}`,
    "END:VEVENT",
  ]);
  const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Asri Wedding//Invitation//ID", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR", ""].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
