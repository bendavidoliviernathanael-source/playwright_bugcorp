// tests/lighthouse.spec.js
import { test } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";
import lighthouseDesktopConfig from "lighthouse/core/config/lr-desktop-config.js";

const PORT = 9222;

const LIGHTHOUSE_THRESHOLDS = {
  performance: 80,
  accessibility: 70,
  "best-practices": 85,
  seo: 80,
};

test.describe("Lighthouse - tests de performances", () => {
  let browser;
  let page;

  test.beforeAll(async ({ playwright, baseURL }) => {
    browser = await playwright.chromium.launch({
      headless: false,
      args: [`--remote-debugging-port=${PORT}`],
    });
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await browser?.close();
  });

  async function auditPage(pageName) {
    await page.waitForLoadState("networkidle").catch(() => {});
    await playAudit({
      page,
      port: PORT,
      config: lighthouseDesktopConfig,
      thresholds: LIGHTHOUSE_THRESHOLDS,
      reports: {
        name: pageName,
        directory: "lighthouse-reports",
        formats: { html: true, json: true },
      },
    });
  }

  test("Lighthouse - Annuaire", async ({ baseURL }) => {
    await page.goto(baseURL + "#/directory", { waitUntil: "networkidle" });
    await auditPage("annuaire");
  });

  test("Lighthouse - Contact", async ({ baseURL }) => {
    await page.goto(baseURL + "#/contact", { waitUntil: "networkidle" });
    await auditPage("contact");
  });

  test("Lighthouse - Éléments Instables", async ({ baseURL }) => {
    await page.goto(baseURL + "#/unstable", { waitUntil: "networkidle" });
    await auditPage("elements-instables");
  });
});
