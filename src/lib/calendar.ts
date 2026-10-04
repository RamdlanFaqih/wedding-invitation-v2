import { coupleNames, wedding } from "@/config/wedding";

function escapeICS(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
}

function timestamp(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function downloadCalendar() {
  const slug = `${wedding.bride.name}-${wedding.groom.name}`.toLowerCase();
  const dates = wedding.allDay
    ? [`DTSTART;VALUE=DATE:${wedding.date.slice(0, 10).replaceAll("-", "")}`, `DTEND;VALUE=DATE:${wedding.endDate.slice(0, 10).replaceAll("-", "")}`]
    : [`DTSTART:${timestamp(wedding.date)}`, `DTEND:${timestamp(wedding.endDate)}`];
  const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Asri Wedding//Invitation//ID", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:${slug}-${wedding.date.slice(0, 10)}@invitation.local`, `DTSTAMP:${timestamp(new Date().toISOString())}`, ...dates, `SUMMARY:${escapeICS(`Pernikahan ${coupleNames}`)}`, `LOCATION:${escapeICS(wedding.address)}`, `DESCRIPTION:${escapeICS("Kami menantikan kehadiran dan doa baik Anda di hari bahagia kami." + (wedding.allDay ? " Jam akad dan resepsi menyusul." : ""))}`, "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
