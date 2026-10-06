export type GiftAccount = { id: string; bank: string; accountNumber: string; accountHolder: string };

/** Confirmed couple, event schedule, and bank details; story remains sample content. */
export const wedding = {
  isPreview: true,
  bride: { name: "Asri", fullName: "Asri Safitri", parents: "Putri dari Bapak Enang Rohmat & Ibu OOH", initial: "A" },
  groom: { name: "Agi", fullName: "Agi Gustira", parents: "Putra dari Bapak Supriatna & Ibu Euis Sutarsih", initial: "A" },
  date: "2026-12-02T08:00:00+07:00",
  dateLabel: "2 Desember 2026",
  dayLabel: "Rabu",
  timezone: "Asia/Jakarta",
  venue: "Sukahurip (Cipondok)",
  city: "Ciamis",
  address: "Dsn. Sukahurip (Cipondok), RT 02/RW 10, Winduraja, Kawali, Ciamis",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Sukahurip+Cipondok+RT+02+RW+10+Winduraja+Kawali+Ciamis",
  // Keep numbers as strings to preserve leading zeros.
  giftAccounts: [
    { id: "seabank-asri", bank: "SeaBank", accountNumber: "901741015830", accountHolder: "Asri Safitri" },
    { id: "bca-agi", bank: "BCA", accountNumber: "1570214884", accountHolder: "Agi Gustira" },
  ] as GiftAccount[],
  events: [
    {
      id: "akad-resepsi", title: "Akad & Resepsi",
      date: "2026-12-02T08:00:00+07:00", dateLabel: "Rabu, 2 Desember 2026",
      time: "08.00 WIB – selesai", venue: "Kediaman mempelai wanita",
      address: "Dsn. Sukahurip (Cipondok), RT 02/RW 10, Winduraja, Kawali, Ciamis",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Dusun+Sukahurip+Cipondok+RT+02+RW+10+Winduraja+Kawali+Ciamis",
      description: "Mengikat janji suci, merayakan awal cerita bersama.", icon: "rings",
    },
    {
      id: "mulung-mantu", title: "Mulung Mantu",
      date: "2026-12-05T08:00:00+07:00", dateLabel: "Sabtu, 5 Desember 2026",
      time: "08.00 WIB – selesai", venue: "Kediaman mempelai pria",
      address: "Dsn. Peuntas, RT 04/RW 02, Ds. Cilangkap, Kec. Buahdua, Sumedang",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Dusun+Peuntas+RT+04+RW+02+Cilangkap+Buahdua+Sumedang",
      description: "Melanjutkan kebahagiaan bersama keluarga dan orang terkasih.", icon: "flower",
    },
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
