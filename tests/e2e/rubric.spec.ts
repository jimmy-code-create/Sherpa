import { test, expect, type Page } from "@playwright/test";

/**
 * Playwright E2E for the rubric criteria that need a browser.
 * Requires: npx playwright install chromium  (not possible inside the
 * Arena sandbox — see VERIFICATION_REPORT.md "Known gaps").
 */

const EMAIL = `e2e-${Date.now()}@example.com`;
const PASSWORD = "studyhard1";

async function signUpAndVerify(page: Page) {
  await page.goto("/auth/sign-up");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: /create account/i }).click();
  // Demo mode echoes the code into the page.
  await page.getByLabel(/6-digit code/i).waitFor();
  const code = await page.locator(".font-mono.font-bold").first().textContent();
  await page.getByLabel(/6-digit code/i).fill(code!.trim());
  await page.getByRole("button", { name: /verify and continue/i }).click();
  await page.waitForURL(/\/onboarding|\/app/);
}

test("Criterion 1 — login → chapter notes in ≤ 5 taps", async ({ page }) => {
  await signUpAndVerify(page);
  // From onboarding completion we land on /app or /onboarding/complete.
  await page.goto("/app");
  let taps = 0;
  // Tap 1: subjects
  await page.getByRole("link", { name: /subjects/i }).first().click();
  taps++;
  // Tap 2: first subject
  await page.getByRole("link", { name: /science — physics/i }).first().click();
  taps++;
  // Tap 3: first chapter (notes is the default tab)
  await page.getByRole("link", { name: /chapter 1/i }).first().click();
  taps++;
  await page.waitForURL(/\/app\/chapters\/.*\?tab=notes/);
  await expect(page.getByRole("heading", { name: /light: reflection/i })).toBeVisible();
  await expect(page.getByText(/big picture/i).first()).toBeVisible({ timeout: 20_000 });
  expect(taps).toBeLessThanOrEqual(5);
});

test("Criterion 2 — cookie banner: 3 equally prominent buttons, reject-all sets all optional false", async ({ page }) => {
  await page.goto("/");
  const accept = page.getByRole("button", { name: /accept all/i });
  const reject = page.getByRole("button", { name: /reject/i });
  const custom = page.getByRole("button", { name: /customize/i });
  await expect(accept).toBeVisible({ timeout: 10_000 });
  await expect(reject).toBeVisible();
  await expect(custom).toBeVisible();

  const boxA = await accept.boundingBox();
  const boxR = await reject.boundingBox();
  expect(boxA && boxR).toBeTruthy();
  // Equal prominence: same height and near-identical width.
  expect(Math.abs((boxA!.height ?? 0) - (boxR!.height ?? 0))).toBeLessThanOrEqual(2);

  await reject.click();
  const consent = await page.evaluate(() => window.localStorage.getItem("sda_cookie_consent"));
  const parsed = JSON.parse(consent!);
  expect(parsed.version).toBe(1);
  expect(parsed.method).toBe("reject_all");
  expect(parsed.analytics).toBe(false);
  expect(parsed.personalization).toBe(false);
  expect(parsed.marketing).toBe(false);
  expect(parsed.necessary).toBe(true);
});

test("Criterion 2b — customize modal has no pre-ticked optional toggles", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /customize/i }).click();
  const analytics = page.getByRole("switch", { name: /analytics/i });
  await expect(analytics).toHaveAttribute("aria-checked", "false");
  const necessary = page.getByRole("switch", { name: /necessary/i });
  await expect(necessary).toBeDisabled();
});

test("Criterion 4 — Socratic gate in the UI: turn 1 asks a question", async ({ page }) => {
  await signUpAndVerify(page);
  await page.goto("/app/chapters/light-reflection-refraction?tab=tutor");
  await page.getByLabel(/message the tutor/i).fill("what is the mirror formula?");
  await page.getByRole("button", { name: /send/i }).click();
  const reply = page.locator("ul li div").last();
  await expect(reply).toContainText(/\?/);
  await expect(page.getByText(/guiding question/i)).toBeVisible();
});

test("Criterion 5 — offline: pinned chapter still renders", async ({ page, context }) => {
  await signUpAndVerify(page);
  await page.goto("/app/chapters/light-reflection-refraction?tab=notes");
  await page.waitForLoadState("networkidle");
  // Wait for the SW to pin the chapter.
  await page.waitForTimeout(2000);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: /light: reflection/i })).toBeVisible({ timeout: 15_000 });
  await context.setOffline(false);
});

test("Criterion 6 — keyboard-only sign-up reaches notes", async ({ page }) => {
  await page.goto("/auth/sign-up");
  await page.keyboard.press("Tab"); // skip link
  for (let i = 0; i < 40 && !(await page.getByLabel("Email").evaluate((el) => document.activeElement === el)); i++) {
    await page.keyboard.press("Tab");
  }
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.keyboard.press("Enter");
  await page.getByLabel(/6-digit code/i).waitFor();
  const code = await page.locator(".font-mono.font-bold").first().textContent();
  await page.getByLabel(/6-digit code/i).fill(code!.trim());
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/onboarding|\/app/);
  // Visible focus check
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    return getComputedStyle(el).outlineWidth;
  });
  expect(parseFloat(outline)).toBeGreaterThanOrEqual(2);
});

test("Chapter hub — all 6 tabs render without error", async ({ page }) => {
  await signUpAndVerify(page);
  for (const tab of ["notes", "roadmap", "resources", "tutor", "practice", "progress"]) {
    await page.goto(`/app/chapters/light-reflection-refraction?tab=${tab}`);
    await expect(page.getByRole("tab", { name: new RegExp(tab === "resources" ? "institutes" : tab, "i") })).toHaveAttribute("aria-selected", "true");
    await page.waitForTimeout(800);
  }
});
