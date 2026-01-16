import { test, expect } from "@playwright/test";

test.describe("Tests de la page zone sécurisée", () => {
  //test BDON-41
  test("test BDON-41", async ({ page }) => {
    //Visiter le site https://bugcorp.vercel.app/
    await page.goto("https://bugcorp.vercel.app/");
    //Un affichage du site https://bugcorp.vercel.app/ est obtenu sur le navigateur.
    await expect(page).toHaveURL("https://bugcorp.vercel.app/");

    //Cliquer sur le bouton "zone sécurisée" dans le bandeau sur le côté gauche de la page
    await page.getByTestId("nav-secure").click();
    //Un affichage d’une page avec un formulaire d’authentification est obtenu
    await expect(page.getByRole("paragraph")).toContainText(
      "Veuillez vous authentifier pour accéder au panneau de contrôle."
    );

    //Saisir l’identifiant admin
    await page.getByRole("textbox", { name: "Identifiant" }).click();
    await page.getByRole("textbox", { name: "Identifiant" }).fill("admin");
    //l’identifiant admin est affiché dans la zone de saisie
    await expect(
      page.getByRole("textbox", { name: "Identifiant" })
    ).toHaveValue("admin");

    //Saisir le mot de passe password123
    await page.getByRole("textbox", { name: "Mot de passe" }).click();
    await page
      .getByRole("textbox", { name: "Mot de passe" })
      .fill("password123");
    //11 points sont affichés dans la zone de saisie
    await expect(
      page.getByRole("textbox", { name: "Mot de passe" })
    ).toHaveValue("password123");

    //Cliquer sur le bouton déverrouiller
    await page.getByRole("button", { name: "Déverrouiller" }).click();
    //Un affichage d’une page avec le titre "Zone Sécurisée" est obtenu.
    await expect(page.locator("h1")).toContainText("Zone Sécurisée (Niveau 4)");
  });
});
