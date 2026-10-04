import { expect, test, type Page } from "@playwright/test";

async function openInvitation(page: Page) {
  await page.getByRole("button", { name: "Buka Undangan" }).click();
  await expect(page.getByRole("navigation", { name: "Navigasi undangan" })).toBeVisible();
}

test("personalized envelope opens with accessible focus and mobile navigation", async ({ page }) => {
  await page.goto("/?to=Nadia%20%26%20Fajar");
  await expect(page.getByRole("heading", { name: "Nadia & Fajar" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navigasi undangan" })).toBeHidden();
  await openInvitation(page);
  await expect(page.locator(".hero h1")).toBeFocused();
  await page.getByRole("navigation").getByRole("link", { name: "Acara" }).click();
  await expect(page).toHaveURL(/#acara$/);
  await expect(page.getByRole("heading", { name: "Akad Nikah" })).toBeInViewport();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("guestbook makes its local-only status clear and survives reload", async ({ page }) => {
  await page.goto("/");
  await openInvitation(page);
  await page.getByLabel("Nama kamu").fill("Tamu Pengujian");
  await page.getByLabel("Ucapan & doa").fill("Semoga selalu bahagia dan saling menyayangi.");
  await page.getByRole("button", { name: "Kirim Ucapan" }).click();
  await expect(page.getByRole("status")).toContainText("Belum dikirim ke mempelai");
  await expect(page.getByRole("heading", { name: "Tamu Pengujian" })).toBeVisible();
  await page.reload();
  await openInvitation(page);
  await expect(page.getByRole("heading", { name: "Tamu Pengujian" })).toBeVisible();
});

test("storage failure preserves the guest's message", async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); }; });
  await page.goto("/");
  await openInvitation(page);
  await page.getByLabel("Nama kamu").fill("Nadia");
  await page.getByLabel("Ucapan & doa").fill("Selamat menempuh hidup baru.");
  await page.getByRole("button", { name: "Kirim Ucapan" }).click();
  await expect(page.getByRole("status")).toContainText("Ucapan belum tersimpan");
  await expect(page.getByLabel("Ucapan & doa")).toHaveValue("Selamat menempuh hidup baru.");
});

test("untrusted guest names are displayed as text", async ({ page }) => {
  const name = '<img src=x onerror="alert(1)">';
  await page.goto(`/?to=${encodeURIComponent(name)}`);
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(page.locator(".recipient img")).toHaveCount(0);
});

test("small viewport fits horizontally and reduced motion can open the invitation", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 667 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await openInvitation(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test("calendar download is available", async ({ page }) => {
  await page.goto("/");
  await openInvitation(page);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Simpan Tanggal" }).click();
  expect((await download).suggestedFilename()).toBe("asri-agi.ics");
});
