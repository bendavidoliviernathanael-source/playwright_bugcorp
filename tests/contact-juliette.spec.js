import { test, expect } from "@playwright/test";

//Test sur la fonctionnalité CONTACT: contact par mail
test("test BDON-40", async ({ page }) => {
  await page.goto("https://bugcorp.vercel.app/");
  await page.getByTestId("nav-contact").click();
  // Saisir les champs obligatoires "Nom", "Email" et "Message" avec au moins 10 caractères
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("PETIT");
  await page.getByRole("textbox", { name: "Votre Nom *" }).press("Tab");
  await page.getByRole("textbox", { name: "Email *" }).fill("test@yahoo.com");
  await page.getByRole("textbox", { name: "Message *" }).click();
  await page
    .getByRole("textbox", { name: "Message *" })
    .fill("Je dois saisir au moins 10 caractères !");
  //Cliquer sur le bouton "Initialiser la transmission"
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();
  //Attendre que la page de progression de transmission soit visible
  await page.locator("#status-console-success").waitFor({ state: "visible" });

  //Verifier que la transmission du mail a réussi avec le message "TRANSMISSION REUSSIE" affiché
  await expect(page.locator("#status-console-success")).toContainText(
    "TRANSMISSION RÉUSSIE"
  );
});
