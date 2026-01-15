import { test, expect } from "@playwright/test";

test.describe("Tests de la page annuaire", () => {
  //Test BDON-39 Attendre l'économie optimale en virant le nombre minimum d'employés.
  //Afficher un message stipulant que l'objectif d'économies est atteint.
  test("test BDON-39", async ({ page }) => {
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

    //Déterminer le nombre d’employés à virer afin d’obtenir l’objectif d'économies.
    //Economie à réaliser
    const texteEconomieARealiser = await page
      .locator("#target-savings-value")
      .innerText();
    const economieArealiser = await parseInt(
      texteEconomieARealiser.replace(/[^\d]/g, ""),
      10
    );
    let nombreDeLicenciements = economieArealiser / 45000;
    nombreDeLicenciements = Math.trunc(nombreDeLicenciements);
    nombreDeLicenciements = nombreDeLicenciements + 1;
    console.log("Nombre de licenciements: " + nombreDeLicenciements);
    //Un nombre d’employés à virer permettant d’obtenir l’objectif d'économie est obtenu.
    await expect(Number.isInteger(nombreDeLicenciements)).toBe(true);

    //Virer le nombre d’employés à licencier pour attendre l’objectif d'économie.
    //Récupérer l'effectif avant licenciement
    const effectifAvantLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(
      "Effectif avant licenciement =",
      effectifAvantLicenciement
    );
    //Sélectionner "100" pour le nombre d'items par page
    await page.getByTestId("items-per-page").selectOption("100");
    //sélection du tableau
    const tableBody = page.locator("#table-body");
    //attendre que le tableau soit visible
    await tableBody.waitFor({ state: "visible" });
    //obtention des lignes du tableau
    const lignes = await tableBody.locator("tr").all();
    //collection pour stocker les checkboxes dans les lignes du tableau
    const identifiantsDansLesLignesDuTableau = [];
    for (const ligne of lignes) {
      //Nombre de cellules 'td' à l'intérieur de cette ligne
      const nombreDeCellules = await ligne.locator("td").count();
      if (nombreDeCellules > 6) {
        //récupération de la valeur de la 2eme cellule de la ligne (l'identifiant')
        const valeurCelluleId = await ligne.locator("td").nth(1).textContent();
        //ajout de la valeur de la cellule statut dans la collection pour stocker les statuts dans les lignes du tableau
        identifiantsDansLesLignesDuTableau.push(
          valeurCelluleId?.trim().slice(1)
        );
      } else {
        console.log(
          "Attention, la ligne a " + nombreDeCellules + " cellule(s)."
        );
      }
    }
    console.log(identifiantsDansLesLignesDuTableau);
    let compteur = 0;
    while (compteur < nombreDeLicenciements) {
      await page
        .getByTestId("checkbox-" + identifiantsDansLesLignesDuTableau[compteur])
        .check();
      compteur = compteur + 1;
    }
    //Cliquer sur l'élément "Virer" de la bande pop-up apparue en bas de la page
    await page.getByText("Virer", { exact: true }).click();
    //Cliquer sur le bouton "Continuer" sur la pop-up "Etes-vous sûr ?"
    await page.getByTestId("fire-step1-confirm").click();
    //Cliquer sur l'élément "Je n'ai pas de coeur" sur la pop-up "Ils ont des familles !"
    await page.getByTestId("fire-step2-confirm").press("Tab");
    //Sélectionner le champ "DELETE"
    await page.getByTestId("fire-step2-confirm").click();
    //Saisir "DELETE" dans le champ "DELETE"
    await page.getByTestId("fire-confirm-input").fill("DELETE");
    //Cliquer sur le bouton "Valider"
    await page.getByTestId("fire-step3-confirm").click();
    //L’effectif est diminué du nombre d’employés licenciés.
    const effectifApresLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await expect(effectifApresLicenciement).toBe(
      effectifAvantLicenciement - nombreDeLicenciements
    );
    await console.log(
      "Effectif après licenciement =",
      effectifApresLicenciement
    );
    //L’économie est égale à ce nombre x 45000 euros.
    //Récupérer l'économie après le licenciement global
    const texteEconomieApresLicenciement = await page
      .locator("#current-savings-value")
      .innerText();
    const economieApresLicenciement = await parseInt(
      texteEconomieApresLicenciement.replace(/[^\d]/g, ""),
      10
    );
    await console.log(
      "Economie après licenciement =",
      economieApresLicenciement
    );
    await expect(economieApresLicenciement).toBe(nombreDeLicenciements * 45000);

    //Observer qu’un message indiquant que l’objectif d'économie atteint est présent.
    await expect(
      page.getByText("Objectif Atteint ! Bonus débloqué")
    ).toBeVisible();
    //Un message indiquant que l’objectif d'économie atteint est présent.
    await expect(page.locator("#goal-reached-badge")).toContainText(
      "Objectif Atteint ! Bonus débloqué."
    );
  });
});
