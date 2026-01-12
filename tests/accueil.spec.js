import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://bugcorp.vercel.app/");
  await expect(page.locator("#home-title")).toContainText(
    "Bienvenue chez BugCorp"
  );
  await expect(page.locator("#home-page")).toContainText(
    "Pionniers de l'intégration continue de bugs. Nous avons viré toute l'équipe QA, c'est donc à vos scripts de sauver la prod."
  );
  await expect(page.locator("#home-subtitle-code")).toContainText(
    'git commit -m "fixed bugs (added more)"'
  );
});
