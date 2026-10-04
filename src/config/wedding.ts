export type GiftAccount = { id: string; bank: string; accountNumber: string; accountHolder: string };

/** Confirmed couple/date/address; event times, story, and bank details are pending. */
export const wedding = {
  isPreview: true,
  bride: { name: "Asri", fullName: "Asri Safitri", parents: "Putri dari Bapak Enang Rohmat & Ibu OOH", initial: "A" },
  groom: { name: "Agi", fullName: "Agi Gustira", parents: "Putra dari Bapak Supriatna & Ibu Euis Sutarsih", initial: "A" },
  date: "2026-12-02T00:00:00+07:00",
  endDate: "2026-12-03T00:00:00+07:00",
  allDay: true,
  dateLabel: "2 Desember 2026",
  dayLabel: "Rabu",
  timezone: "Asia/Jakarta",
  venue: "Sukahurip (Cipondok)",
  city: "Ciamis",
  address: "Sukahurip (Cipondok), RT 02/RW 10, Winduraja, Kawali, Ciamis",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Sukahurip+Cipondok+RT+02+RW+10+Winduraja+Kawali+Ciamis",
  // Add confirmed bank details here. Keep numbers as strings to preserve leading zeros.
  giftAccounts: [] as GiftAccount[],
  events: [
    { title: "Akad Nikah", time: "Waktu menyusul", description: "Awal dari janji untuk selamanya.", icon: "rings" },
    { title: "Resepsi", time: "Waktu menyusul", description: "Merayakan cinta bersama yang terkasih.", icon: "flower" },
  ],
  story: [
    { year: "2022", title: "Sebuah pertemuan", text: "Dari percakapan sederhana, tumbuh rasa yang tak pernah kami duga. Semesta punya caranya sendiri mempertemukan dua hati." },
    { year: "2025", title: "Satu arah, bersama", text: "Melewati banyak cerita, kami menemukan rumah dalam diri satu sama lain. Lalu, kami memilih untuk melangkah bersama." },
    { year: "2026", title: "Babak yang baru", text: "Dengan restu keluarga dan doa orang-orang terkasih, kami memulai cerita selamanya. Dan kamu menjadi bagian di dalamnya." },
  ],
} as const;

export const coupleNames = `${wedding.bride.name} & ${wedding.groom.name}`;

const date = new Date(wedding.date);
const datePart = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", { ...options, timeZone: wedding.timezone }).format(date);
export const weddingDate = {
  day: datePart({ day: "2-digit" }),
  month: datePart({ month: "long" }),
  year: datePart({ year: "numeric" }),
  numeric: datePart({ day: "2-digit", month: "2-digit", year: "numeric" }).replaceAll("/", " . "),
};
