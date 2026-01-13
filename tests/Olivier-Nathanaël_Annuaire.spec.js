import { test, expect } from "@playwright/test";

test.describe("Tests de la page annuaire", () => {
  //test BDON-31
  test("test BDON-31", async ({ page }) => {
    //Visiter le site https://bugcorp.vercel.app/
    await page.goto("https://bugcorp.vercel.app/");
    //Un affichage du site https://bugcorp.vercel.app/ est obtenu sur le navigateur.
    await expect(page).toHaveURL("https://bugcorp.vercel.app/");

    //Cliquer sur le bouton "l’annuaire" dans le bandeau sur le côté gauche de la page
    await page.getByTestId("nav-directory").click();
    //Un affichage d’une page avec le titre "L'Annuaire Enterprise" est obtenu
    await expect(page.locator("#page-title")).toContainText(
      "L'Annuaire Enterprise"
    );

    //effectif avant licenciement
    const effectifAvantLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(effectifAvantLicenciement);
    //économie avant licenciement
    const texteEconomieAvantLicenciement = await page
      .locator("#current-savings-value")
      .innerText();
    const economieAvantLicenciement = await parseInt(
      texteEconomieAvantLicenciement.replace(/[^\d]/g, ""),
      10
    );
    await console.log(economieAvantLicenciement);

    //Cliquer sur le bouton virer dans la ligne Dennis Ritchie
    await page.getByTestId("fire-btn-1001").click();
    //Un affichage d’un pop up avec la question "Êtes-vous sûr ?" est obtenu
    await expect(page.getByText("Êtes-vous sûr ?Cette action")).toBeVisible();

    //Cliquer sur le bouton "Continuer" dans la pop-up
    await page.getByTestId("fire-step1-confirm").click();
    //Un affichage d’un autre pop up est obtenu avec le texte "Il a une famille !"
    await expect(page.getByText("Il a une famille !Cet")).toBeVisible();

    //Cliquer sur le bouton "Je n’ai pas de cœur, continuer."
    await page.getByTestId("fire-step2-confirm").click();
    //Un affichage d’un autre pop up est obtenu avec le texte "Confirmation ultime"
    await expect(page.getByText("Confirmation UltimePour")).toBeVisible();

    //Saisir DELETE dans la zone de saisie du pop up
    await page.getByTestId("fire-confirm-input").click();
    await page.getByTestId("fire-confirm-input").fill("DELETE");
    //Le texte DELETE est affiché dans la zone de saisie
    await expect(page.getByTestId("fire-confirm-input")).toHaveValue("DELETE");

    //Cliquer sur le bouton "virer" dans le pop up
    await page.getByTestId("fire-step3-confirm").click();
    //effectif après licenciement
    const effectifApresLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(effectifApresLicenciement);
    //économie après licenciement
    const texteEconomieApresLicenciement = await page
      .locator("#current-savings-value")
      .innerText();
    const economieApresLicenciement = await parseInt(
      texteEconomieApresLicenciement.replace(/[^\d]/g, ""),
      10
    );
    await console.log(economieApresLicenciement);
    //l'économie est augmentée de 45000 euros par rapport à l'économie avant le licenciement
    await expect(economieApresLicenciement).toBe(
      economieAvantLicenciement + 45000
    );
    //La ligne Dennis Ritchie est supprimée dans le tableau
    await expect(page.locator("#table-employees")).not.toContainText(
      "Dennis Ritchie"
    );
    //La valeur effectif est plus petite d’une unité par rapport à cette valeur avant le licenciement
    await expect(effectifApresLicenciement).toBe(effectifAvantLicenciement - 1);

    //Cliquer sur le bouton Promouvoir dans la ligne Otto Mobile
    await page.getByTestId("promote-btn-1002").click();
    //Le rôle affiché de "Otto mobile" est Director
    await expect(page.locator("#cell-role-1002")).toContainText("Director");

    //Cliquer sur le bouton "Réinitialiser"
    await page.getByTestId("reset-btn").click();
    //Les effets suivants sont observés :
    //un objectif d'économie est défini
    await expect(page.locator("#target-savings-value")).toBeVisible();
    //l'économie est placée à zéro
    await expect(page.locator("#current-savings-value")).toContainText("0 €");
    //les employés virés sont réintroduits dans la liste des employés (présence de Dennis Ritchie)
    await expect(
      page.getByRole("cell", { name: "DR Dennis Ritchie dennis." })
    ).toBeVisible();
    //pour chaque employé, son rôle est remis à celui associé avant des modifications (le rôle de Otto Mobile est manager)
    await expect(page.locator("#cell-role-1002")).toContainText("Manager");
    //les filtres sont replacés à leur valeur initiale (département : tous  et statut : tous)
    await expect(page.getByTestId("dept-filter")).toHaveValue("all");
    await expect(page.getByTestId("status-filter")).toHaveValue("all");
    //Les valeurs effectif et filtrés sont remises à 151
    await expect(page.getByTestId("total-count")).toContainText("151");
    await expect(page.getByTestId("filtered-count")).toContainText("151");
  });
});
