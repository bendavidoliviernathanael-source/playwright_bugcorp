import { test, expect } from "@playwright/test";

test.describe("Tests de la page accueil", () => {
  //test BDON-28
  test("test BDON-28", async ({ page }) => {
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

  //test BDON-29
  test("test BDON-29", async ({ page }) => {
    //Visiter le site https://bugcorp.vercel.app/
    await page.goto("https://bugcorp.vercel.app/");
    //Un affichage du site ://bugcorp.vercel.app/ est obtenu sur le navigateur
    await expect(page).toHaveURL("https://bugcorp.vercel.app/");

    //la page affiche "Bienvenue chez BugCorp"
    await expect(page.locator("#home-title")).toContainText(
      "Bienvenue chez BugCorp"
    );

    //Cliquer sur le bouton "Accéder à l'annuaire" dans la page affichée
    await page.getByRole("button", { name: "Accéder à l'Annuaire" }).click();
    //Un affichage d'une page avec le titre "l'annuaire enterprise" est obtenu
    await expect(
      page.getByRole("heading", { name: "L'Annuaire Enterprise" })
    ).toBeVisible();

    //Cliquer sur le bouton "Accueil" dans le bandeau sur le côté gauche de la page affichée
    await page.getByTestId("nav-home").click();
    //Un affichage d'une page avec le titre "Bienvenue chez bugcorp" est obtenu
    await expect(
      page.getByRole("heading", { name: "Bienvenue chez BugCorp" })
    ).toBeVisible();

    //Cliquer sur le bouton "Pirater le système" dans la page affichée
    await page.getByRole("button", { name: "Pirater le Système" }).click();
    //Un affichage d'une page avec un formulaire d'authentification est obtenu
    await expect(page.getByText("Veuillez vous authentifier")).toBeVisible();

    //Cliquer sur le bouton "Accueil" dans le bandeau sur le côté gauche de la page affichée
    await page.getByTestId("nav-home").click();
    //Un affichage d'une page avec le titre "Bienvenue chez bugcorp" est obtenu
    await expect(
      page.getByRole("heading", { name: "Bienvenue chez BugCorp" })
    ).toBeVisible();

    //Cliquer sur le bouton " tester vos réflexes" dans la page affichée
    await page.getByRole("button", { name: "Tester vos réflexes" }).click();
    //Un affichage d'une page avec le titre "Eléments instables" est obtenu
    await expect(
      page.getByRole("heading", { name: "Éléments Instables" })
    ).toBeVisible();

    //Cliquer sur le bouton "Accueil" dans le bandeau sur le côté gauche de la page affichée
    await page.getByTestId("nav-home").click();
    //Un affichage d'une page avec le titre "Bienvenue chez bugcorp" est obtenu
    await expect(
      page.getByRole("heading", { name: "Bienvenue chez BugCorp" })
    ).toBeVisible();

    //Cliquer sur le bouton "Ouvrir un ticket" dans la page affichée
    await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
    //Un affichage d'une page avec le titre "Contact support" est obtenu
    await expect(
      page.getByRole("heading", { name: "Contact Support" })
    ).toBeVisible();
  });
});
