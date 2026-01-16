import { test, expect } from "@playwright/test";

// CHANGER LE ROLE D'UN EMPLOYE => promouvoir - rétrograder

export async function promouvoir(page, id, role) {
  const btnPrefix = "promote-btn-";
  const rolePrefix = "#cell-role-";
  const bugPrefix = "#cell-bugs-";

  const button = btnPrefix + id;
  const bugCell = bugPrefix + id;
  const roleCell = rolePrefix + id;

  // Extraire le texte qui donne la valeur des économies réalisées
  const savingText = await page.locator("#current-savings-value").textContent();
  // Extraire uniquement les chiffres, en conservant le signe positif ou négatif
  const savingValue = parseFloat(savingText.replace(/[^\d-]/g, ""));
  console.log("savingValue:", savingValue);

  // Extraire le texte contenu dans la cellule qui contient le nb de bugs dans le tableau des employés
  const bugText = await page.locator(bugCell).textContent();
  // Extraire uniquement les chiffres, en conservant le signe positif ou négatif
  const bugValue = parseFloat(bugText.replace(/[^\d-]/g, ""));

  // Cliquer sur le bouton promotion sur la ligne de l'employé concerné
  await page.getByTestId(button).click();
  //Le nom du rôle situé sous l’identité de l’employé change pour devenir le rôle supérieur
  await expect(page.locator(roleCell)).toContainText(role);

  // le nombre de bugs diminue de 10
  const newBugCount = bugValue - 10;
  // on vérifie que le nombre de bugs affiché a bien pris en compte la nouvelle valeur et on la transforme en string pour coller au typage de la valeur bug que playwright trouve sur le site
  await expect(page.locator(bugCell)).toHaveText(newBugCount.toString());

  // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié (diminué de 15000€)
  const newSavingText = await page
    .locator("#current-savings-value")
    .textContent();
  // on transforme la valeur en nombre tout en conservant le signe positif ou négatif
  const newSavingValue = parseFloat(newSavingText.replace(/[^\d-]/g, ""));
  // valeur attendue d'économies
  const expectedSaving = savingValue - 15000;
  // on vérifie que la valeur que l'on doit obtenir correspond à celle que l'on récupère sur le site
  expect(newSavingValue).toBe(expectedSaving);
}
export async function promouvoirTousLesRoles(page, id) {
  const roles = [
    "Prompt Engineer",
    "Scapegoat",
    "Intern",
    "Junior Dev",
    "Senior Dev",
    "Manager",
    "Director",
    "VP",
    "CEO",
    "Galactic Emperor",
  ];
  for (const role of roles) {
    await promouvoir(page, id, role);
  }
}

// fonction rétrograder
export async function retrograder(page, id, role) {
  const btnPrefix = "demote-btn-";
  const rolePrefix = "#cell-role-";
  const bugPrefix = "#cell-bugs-";

  const button = btnPrefix + id;
  const bugCell = bugPrefix + id;
  const roleCell = rolePrefix + id;

  // Extraire le texte qui donne la valeur des économies réalisées
  const savingText = await page.locator("#current-savings-value").textContent();
  // Extraire uniquement les chiffres, en conservant le signe positif ou négatif
  const savingValue = parseFloat(savingText.replace(/[^\d-]/g, ""));
  console.log("savingValue:", savingValue);

  // Extraire le texte contenu dans la cellule qui contient le nb de bugs dans le tableau des employés
  const bugText = await page.locator(bugCell).textContent();
  // Extraire uniquement les chiffres, en conservant le signe positif ou négatif
  const bugValue = parseFloat(bugText.replace(/[^\d-]/g, ""));

  // Cliquer sur le bouton promotion sur la ligne de l'employé concerné
  await page.getByTestId(button).click();
  //Le nom du rôle situé sous l’identité de l’employé change pour devenir le rôle inférieur
  await expect(page.locator(roleCell)).toContainText(role);

  // le nombre de bugs diminue de 10
  const newBugCount = bugValue + 10;
  // on vérifie que le nombre de bugs affiché a bien pris en compte la nouvelle valeur et on la transforme en string pour coller au typage de la valeur bug que playwright trouve sur le site

  await expect(page.locator(bugCell)).toHaveText(
    new RegExp(`^\\+${newBugCount}$`)
  );

  // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié (augmenté de 12000€)
  const newSavingText = await page
    .locator("#current-savings-value")
    .textContent();
  // on transforme la valeur en nombre tout en conservant le signe positif ou négatif
  const newSavingValue = parseFloat(newSavingText.replace(/[^\d-]/g, ""));
  // valeur attendue d'économies
  const expectedSaving = savingValue + 12000;
  // on vérifie que la valeur que l'on doit obtenir correspond à celle que l'on récupère sur le site
  expect(newSavingValue).toBe(expectedSaving);
}

export async function retrograderTousLesRoles(page, id) {
  const rolesReversed = [
    "CEO",
    "VP",
    "Director",
    "Manager",
    "Senior Dev",
    "Junior Dev",
    "Intern",
    "Scapegoat",
    "Prompt Engineer",
    "Coffee Maker",
  ];
  for (const role of rolesReversed) {
    await retrograder(page, id, role);
  }
}

test.describe("Suite de tests Annuaire - Anne -Changer le rôle d'un employé", () => {
  // test BDON-30 promouvoir
  test("test BDON-30 promouvoir ", async ({ page }) => {
    // Etape 1
    // Visiter le site
    await page.goto("https://bugcorp.vercel.app/");
    //Dans le bandeau de gauche, "Accueil" apparaît sur un fond bleu
    await expect(page.getByTestId("nav-home")).toBeVisible();
    // la page affiche "Bienvenue chez BugCorp"
    await page.getByRole("heading", { name: "Bienvenue chez BugCorp" }).click();

    // Etape 2
    //Cliquer sur "L’Annuaire" sur le bandeau de gauche.
    await page.getByTestId("nav-directory").click();
    // La page ayant pour titre "L’annuaire Enterprise" s’affiche.
    await expect(
      page.getByRole("heading", { name: "L'Annuaire Enterprise" })
    ).toBeVisible();
    //  Elle contient :un encart nommé "Objectif d'économies (restructuration)
    await expect(
      page.getByRole("heading", { name: "Objectif d'Économies (" })
    ).toBeVisible();
    //avec en dessous, un objectif d'économies en euro
    await expect(page.locator("#current-savings-value")).toContainText("€");

    // Etape 3
    // Placer la souris au croisement de la ligne correspondant à l’ID de l'employé sélectionné et de la colonne "actions".
    // ID à tester: #1015 Alan Turing - rôle de base: Coffee maker
    // pour atteindre l'employé sur lequel porte le test => taper "Alan" dans la barre de recherche
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("Alan");
    // la liste doit afficher l'employé à tester et son rôle id doit correspondre au role Coffee Maker
    await expect(page.locator("#cell-name-1015")).toContainText("Alan Turing");
    await expect(page.locator("#cell-role-1015")).toContainText("Coffee Maker");

    // roles: Coffee Maker, Prompt Engineer, Scapegoat, Intern, Junior Dev, Senior Dev, Manager, Director, VP, CEO, Galactic Emperor
    // Utilisation de la fonction promouvoir avec une boucle sur les rôles
    await promouvoirTousLesRoles(page, 1015);

    // Etape 14
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé reste à Galactic Emperor (role le pus élevé)
    await expect(page.locator("#cell-role-1015")).toContainText(
      "Galactic Emperor"
    );
    // le nombre de bugs ne change plus
    await expect(page.locator("#cell-bugs-1015")).toHaveText("-144");
    // le  montant inscrit sous objectif d'économie selon le montant prévu reste identique
    await expect(page.locator("#current-savings-value")).toContainText(
      "-150 000 €"
    );
  });

  // test BDON-37 rétrograder
  test("test BDON-37 rétrograder", async ({ page }) => {
    // Etape 1
    // Visiter le site
    await page.goto("https://bugcorp.vercel.app/");
    //Dans le bandeau de gauche, "Accueil" apparaît sur un fond bleu
    await expect(page.getByTestId("nav-home")).toBeVisible();
    // la page affiche "Bienvenue chez BugCorp"
    await page.getByRole("heading", { name: "Bienvenue chez BugCorp" }).click();

    // Etape 2
    //Cliquer sur "L’Annuaire" sur le bandeau de gauche.
    await page.getByTestId("nav-directory").click();
    // La page ayant pour titre "L’annuaire Enterprise" s’affiche.
    await expect(
      page.getByRole("heading", { name: "L'Annuaire Enterprise" })
    ).toBeVisible();
    //  Elle contient :un encart nommé "Objectif d'économies (restructuration)
    await expect(
      page.getByRole("heading", { name: "Objectif d'Économies (" })
    ).toBeVisible();
    //avec en dessous, un montant en euro
    await expect(page.locator("#current-savings-value")).toContainText("€");

    // Etape 3
    // Placer la souris au croisement de la ligne correspondant à l’ID de l'employé sélectionné et de la colonne "actions".
    // la liste doit afficher l'employé à tester et son rôle
    // ID à tester: #1010 Ellen Ripley - rôle de base: Galactic Emperor
    await expect(page.locator("#cell-name-1010")).toContainText("Ellen Ripley");
    await expect(page.locator("#cell-role-1010")).toContainText(
      "Galactic Emperor"
    );

    // APPEL DE LA FONCTION
    await retrograderTousLesRoles(page, 1010);

    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le bas.
    await page.getByTestId("demote-btn-1010").click();
    // Le nom du rôle situé sous l’identité de l’employé reste à Coffee Maker
    await expect(page.locator("#cell-role-1010")).toContainText("Coffee Maker");
    // le nombre de bugs ne change plus
    await expect(page.locator("#cell-bugs-1010")).toHaveText("+228");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "120 000 €"
    );
  });

  // FIN CHANGER LE ROLE D'UN EMPLOYE => promouvoir - rétrograder
});

test.describe("Suite de tests Annuaire - Juliette - Virer un employé", () => {
  //Test BDON-32 Virer 1 employé depuis le bandeau pop-up après l'avoir sélectionné dans la liste
  // Test BDON-32 Virer 1 employé par le bandeau pop-up
  test("test BDON 32", async ({ page }) => {
    //Visiter le site https://bugcorp.vercel.app/
    await page.goto("https://bugcorp.vercel.app/");
    //Cliquer sur l'onglet annuaire
    await page.getByTestId("nav-directory").click();
    //Récupérer l'effectif avant licenciement
    const effectifAvantLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(
      "Effectif avant licenciement =",
      effectifAvantLicenciement
    );
    //Récupérer l'économie avant le licenciement
    const texteEconomieAvantLicenciement = await page
      .locator("#current-savings-value")
      .innerText();
    const economieAvantLicenciement = await parseInt(
      texteEconomieAvantLicenciement.replace(/[^\d]/g, ""),
      10
    );
    await console.log(
      "Economie avant licenciement =",
      economieAvantLicenciement
    );
    //Sélectionner l'employé #1001
    await page.getByTestId("checkbox-1001").check();
    //Cliquer sur l'élément "virer" du bandeau situé en bas de la page
    await page.getByText("Virer", { exact: true }).click();
    //Pop-up "Etes-vous sûr? Cette action va virer l'utilisateur. C'est assez définitif."
    await page.getByTestId("fire-step1-confirm").click();
    //Pop-up "Il a une famille ! Cet utilisateeur a 3 enfants et un crédit sur sa maison. Voulez-vous vraiment le mettre à la porte ?"
    await page.getByTestId("fire-step2-confirm").click();
    //Pop-up "Confirmation ultime. Pour confirmer le licenciement, veuillez taper DELETE ci-dessous."
    await page.getByTestId("fire-confirm-input").click();
    //Sélectionner le champ "DELETE"
    await page.getByTestId("fire-confirm-input").fill("DELETE");
    //Taper DELETE dans le champ DELETE
    await page.getByTestId("fire-step3-confirm").click();
    //On vérifie que l'employé a bien été licencié: 1 - Le tableau des employés ne doit pas contenir le nom de l'employé Denis Ritchie
    await expect(page.locator("#table-employees")).not.toContainText(
      "Dennis Ritchie"
    );
    //On vérifie que l'employé a bien été licencié: 2 - L'effectif de l'entreprise doit avoir diminué de 1
    const effectifApresLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(
      "Effectif après licenciement =",
      effectifApresLicenciement
    );
    //on vérifie que la valeur de l'effectif est plus petite d’une unité par rapport à cette valeur avant le licenciement
    await expect(effectifApresLicenciement).toBe(effectifAvantLicenciement - 1);
    //Récupérer l'économie après le licenciement
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

    //On vérifie que l'employé a bien été licencié: 3 - le licenciement a engendré une économie de 45000 euros
    await expect(economieApresLicenciement).toBe(
      economieAvantLicenciement + 45000
    );
  });

  //Test BDON-34 Virer 1 employé depuis la ligne d'information de l'employé
  // Virer 1 employé de l'annuaire à partir de sa ligne
  test("test BDON-34", async ({ page }) => {
    //Visiter le site https://bugcorp.vercel.app/
    await page.goto("https://bugcorp.vercel.app/");
    //Cliquer sur l'onglet annuaire
    await page.getByTestId("nav-directory").click();
    //Récupérer l'effectif avant licenciement
    const effectifAvantLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(
      "Effectif avant licenciement =",
      effectifAvantLicenciement
    );
    //Récupérer l'économie avant le licenciement
    const texteEconomieAvantLicenciement = await page
      .locator("#current-savings-value")
      .innerText();
    const economieAvantLicenciement = await parseInt(
      texteEconomieAvantLicenciement.replace(/[^\d]/g, ""),
      10
    );
    await console.log(
      "Economie avant licenciement =",
      economieAvantLicenciement
    );
    //Premier pop-up de confirmation
    await page.getByTestId("fire-btn-1001").click();
    //Second pop-up de confirmation
    await page.getByTestId("fire-step1-confirm").click();
    //Pop-up DELETE
    await page.getByTestId("fire-step2-confirm").click();
    //Sélection du champ DELETE
    await page.getByTestId("fire-confirm-input").click();
    //Taper DELETE dans le champ DELETE
    await page.getByTestId("fire-confirm-input").fill("DELETE");
    //Valider le licenciement
    await page.getByTestId("fire-step3-confirm").click();
    //On vérifie que l'employé a bien été licencié: 1 - Le tableau des employés ne doit pas contenir le nom de l'employé Denis Ritchie
    await expect(page.locator("#table-employees")).not.toContainText(
      "Dennis Ritchie"
    );
    //On vérifie que l'employé a bien été licencié: 2 - L'effectif de l'entreprise doit avoir diminué de 1
    const effectifApresLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(
      "Effectif après licenciement =",
      effectifApresLicenciement
    );
    //On vérifie que la valeur de l'effectif est plus petite d’une unité par rapport à cette valeur avant le licenciement
    await expect(effectifApresLicenciement).toBe(effectifAvantLicenciement - 1);
    //Récupérer l'économie après le licenciement
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

    //On vérifie que l'employé a bien été licencié: 3 - le licenciement a engendré une économie de 45000 euros
    await expect(economieApresLicenciement).toBe(
      economieAvantLicenciement + 45000
    );
  });

  //Test BDON-36 Virer 3 employés à partir de la bande du pop-up
  // Virer plusieurs employés en même temps: 3 employés de BugCorp
  test("test BDON-36", async ({ page }) => {
    await page.goto("https://bugcorp.vercel.app/");
    //Cliquer sur l'onglet "Annuaire"
    await page.getByTestId("nav-directory").click();
    //Récupérer l'effectif avant licenciement
    const effectifAvantLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(
      "Effectif avant licenciement =",
      effectifAvantLicenciement
    );
    //Récupérer l'économie actuelle avant le licenciement
    const texteEconomieAvantLicenciement = await page
      .locator("#current-savings-value")
      .innerText();
    const economieAvantLicenciement = await parseInt(
      texteEconomieAvantLicenciement.replace(/[^\d]/g, ""),
      10
    );
    await console.log(
      "Economie avant licenciement =",
      economieAvantLicenciement
    );
    //Sélection des employés à licencier: Denis Ritchie, Otto Mobile et Mehdi Cament
    await page.getByTestId("checkbox-1001").check();
    await page.getByTestId("checkbox-1002").check();
    await page.getByTestId("checkbox-1003").check();
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
    //On vérifie que les employés ont bien été licenciés:
    // 1 - Le tableau des employés ne doit pas contenir le nom des employés Denis Ritchie, Otto Mobile et Mehdi Cament
    await expect(page.locator("#table-employees")).not.toContainText([
      "Denis Ritchie",
      "Otto Mobile",
      "Mehdi Cament",
    ]);
    //On vérifie que les employés ont bien été licenciés:
    // 2 - L'effectif de l'entreprise doit avoir diminué de 3 après le licenciement
    const effectifApresLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await expect(effectifApresLicenciement).toBe(effectifAvantLicenciement - 3);
    await console.log(
      "Effectif après licenciement =",
      effectifApresLicenciement
    );
    //Récupérer l'économie après le licenciement
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
    //On vérifie que les employés ont bien été licenciés:
    // 3 - le licenciement a engendré une économie de 3*45000 euros soit 135000 euros
    await expect(economieApresLicenciement).toBe(
      economieAvantLicenciement + 3 * 45000
    );
  });

  //Test BDON-38 Virer tous les employés de BugCorp à partir de la bande du pop-up
  // Virer tous les employés de l'Annuaire Enterprise de BugCorp
  test("test BDON-38", async ({ page }) => {
    await page.goto("https://bugcorp.vercel.app/");
    //Cliquer sur l'onglet annuaire
    await page.getByTestId("nav-directory").click();
    //Récupérer l'effectif avant licenciement
    const effectifAvantLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await console.log(
      "Effectif avant licenciement =",
      effectifAvantLicenciement
    );
    //Récupérer l'économie actuelle avant le licenciement
    const texteEconomieAvantLicenciement = await page
      .locator("#current-savings-value")
      .innerText();
    const economieAvantLicenciement = await parseInt(
      texteEconomieAvantLicenciement.replace(/[^\d]/g, ""),
      10
    );
    await console.log(
      "Economie avant licenciement =",
      economieAvantLicenciement
    );
    //Sélectionner "100" pour le nombre d'items par page
    await page.getByTestId("items-per-page").selectOption("100");
    //Sélectionner tous les ID des employés de la page affichée
    await page.getByTestId("select-all-checkbox").check();
    //Cliquer sur "Virer" sur le bandeau du bas de la page
    await page.getByText("Virer", { exact: true }).click();
    //Cliquer sur "Continuer" sur le pop-up "Etes-vous sûr ?"
    await page.getByTestId("fire-step1-confirm").click();
    //Cliquer sur "Je n'ai pass de coeur, continuer" sur le pop-up "Il a une famille !"
    await page.getByTestId("fire-step2-confirm").click();
    //Taper DELETE dans le champ "DELETE" de la pop-up
    await page.getByTestId("fire-confirm-input").fill("DELETE");
    //Cliquer sur valider dans la pop-up DELETE
    await page.getByTestId("fire-step3-confirm").click();
    //Sélectionner tous les ID des employés de la page affichée
    await page.getByTestId("select-all-checkbox").check();
    //Cliquer sur "Virer" sur le bandeau du bas de la page
    await page.getByText("Virer", { exact: true }).click();
    //Cliquer sur "Continuer" sur le pop-up "Etes-vous sûr ?"
    await page.getByTestId("fire-step1-confirm").click();
    //Cliquer sur "Je n'ai pass de coeur, continuer" sur le pop-up "Il a une famille !"
    await page.getByTestId("fire-step2-confirm").click();
    //Taper DELETE dans le champ "DELETE" de la pop-up
    await page.getByTestId("fire-confirm-input").fill("DELETE");
    //Cliquer sur valider dans la pop-up DELETE
    await page.getByTestId("fire-step3-confirm").click();

    //On vérifie que les employés ont bien été licenciés:
    // 1 - La page affiche un message "Succès Déverrouillé : Solopreneur"
    await expect(page.locator("#empty-state-title")).toContainText(
      "Succès Déverrouillé : Solopreneur"
    );
    //La page affiche l'économie totale réalisée
    await expect(page.locator("#final-savings-display")).toContainText(
      "Economies réalisées : 6 795 000 €"
    );
    //On vérifie que les employés ont bien été licenciés:
    // 2 - L'effectif de l'entreprise doit avoir diminué de 151 après le licenciement
    const effectifApresLicenciement = parseInt(
      await page.locator("#stat-total-count").innerText()
    );
    await expect(effectifApresLicenciement).toBe(
      effectifAvantLicenciement - 151
    );
    await console.log(
      "Effectif après licenciement =",
      effectifApresLicenciement
    );

    //Récupérer l'économie après le licenciement
    await console.log(
      "economieApresLicenciement =",
      economieAvantLicenciement + effectifAvantLicenciement * 45000
    );
  });
});

test.describe("Suite de tests Annuaire - Olivier-Nathanaël-Anne-Juliette - Economiser", () => {
  //Test BDON-39 Attendre l'économie optimale en virant le nombre minimum d'employés.
  //Vérifier qu'un message est obtenu lorsque l'objectif d'économies est atteint
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

test.describe("Suite de tests Annuaire - Olivier-Nathanaël - Economiser", () => {
  //Autre version sur le même test
  //Test BDON-39 autre version Attendre l'économie optimale en virant le nombre minimum d'employés.
  //Vérifier qu'un message est obtenu lorsque l'objectif d'économies est atteint
  //Afficher un message stipulant que l'objectif d'économies est atteint.
  test("test BDON-39 autre version", async ({ page }) => {
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
    let compteur = 0;
    while (compteur < nombreDeLicenciements) {
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
          const valeurCelluleId = await ligne
            .locator("td")
            .nth(1)
            .textContent();
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
      await page
        .getByTestId("checkbox-" + identifiantsDansLesLignesDuTableau[0])
        .check();
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
      compteur = compteur + 1;
    }
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

test.describe("Suite de tests Annuaire - Olivier-Nathanaël - Réinitialiser / Rechercher / Filtrer", () => {
  //test BDON-31
  //Vérifier que la réinitialisation de l'annuaire enterprise à son état d'origine permet d'obtenir différents effets après un licenciement et une promotion
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

  //test BDON-33
  //Vérifier que des recherches permettent d'obtenir les résultats attendus
  test("test BDON-33", async ({ page }) => {
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

    //Cliquer sur la zone de saisie "Rechercher"
    await page.getByTestId("search-input").click();
    //Un curseur est présent dans la zone de saisie
    await expect(page.locator("#input-search")).toBeFocused();

    //Saisir Dennis dans la zone de saisie
    await page.getByTestId("search-input").fill("Dennis");
    //Le tableau contient une ligne relative à l'identifiant #1001 et le nombre d'éléments filtrés est 1
    await expect(page.locator("#cell-name-1001")).toContainText("Dennis");
    await expect(page.getByTestId("filtered-count")).toContainText("1");

    //Saisir Dennis2 dans la zone de saisie
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("Dennis2");
    //Le tableau ne contient pas de lignes et le nombre d'éléments filtrés est 0
    await expect(
      page.getByTestId("employee-table").getByRole("paragraph")
    ).toContainText("Aucun employé trouvé. Essayez d'embaucher quelqu'un ?");
    await expect(page.getByTestId("filtered-count")).toContainText("0");
  });

  //test BDON-35
  //Vérifier que des utilisations de filtres permettent d'obtenir des résultats attendus
  test("test BDON-35", async ({ page }) => {
    //liste des éléments du filtre département
    const departements = [
      "all",
      "Ingénierie",
      "Ventes",
      "Marketing",
      "RH",
      "Juridique",
      "Crise Existentielle",
      "Mèmes",
    ];
    //liste des éléments du filtre statut
    const statuts = ["all", "Actif", "Absent", "Sur la sellette"];
    //compteur pour parcourir la collection departements
    let cpt1 = 0;

    while (cpt1 < departements.length) {
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

      //Faire en sorte d’avoir le filtre département avec l'élément ${département}
      await page.getByTestId("dept-filter").selectOption(departements[cpt1]);
      //L'élément ${département} est affiché sur le filtre département
      await expect(page.getByTestId("dept-filter")).toHaveValue(
        departements[cpt1]
      );

      //compteur pour parcourir la collection statuts
      let cpt2 = 0;
      while (cpt2 < statuts.length) {
        //Faire en sorte d’avoir le filtre statut avec l'élément ${statut}
        await page.getByTestId("status-filter").selectOption(statuts[cpt2]);
        //L'élément ${statut}  est affiché sur le filtre statut
        await expect(page.getByTestId("status-filter")).toHaveValue(
          statuts[cpt2]
        );

        //affichage de la configuration de filtres dans la console
        await console.log(
          "département : " +
            departements[cpt1] +
            "\n" +
            "statut : " +
            statuts[cpt2]
        );

        //sélection du tableau
        const tableBody = page.locator("#table-body");
        //attendre que le tableau soit visible
        await tableBody.waitFor({ state: "visible" });
        //obtention des lignes du tableau
        const lignes = await tableBody.locator("tr").all();
        //collection pour stocker les départements dans les lignes du tableau
        const departementsDansLesLignesDuTableau = [];
        //collection pour stocker les statuts dans les lignes du tableau
        const statutsDansLesLignesDuTableau = [];
        for (const ligne of lignes) {
          //Nombre de cellules 'td' à l'intérieur de cette ligne
          const nombreDeCellules = await ligne.locator("td").count();
          if (nombreDeCellules > 6) {
            //récupération de la valeur de la 4ieme cellule de la ligne (le département)
            const valeurCelluleDepartement = await ligne
              .locator("td")
              .nth(3)
              .textContent();
            //ajout de la valeur de la cellule département dans la collection pour stocker les départements dans les lignes du tableau
            await departementsDansLesLignesDuTableau.push(
              valeurCelluleDepartement?.trim()
            );
            //récupération de la valeur de la 7eme cellule de la ligne (le département)
            const valeurCelluleStatut = await ligne
              .locator("td")
              .nth(6)
              .textContent();
            //ajout de la valeur de la cellule statut dans la collection pour stocker les statuts dans les lignes du tableau
            statutsDansLesLignesDuTableau.push(valeurCelluleStatut?.trim());
          } else {
            console.log(
              "Attention, la ligne a " + nombreDeCellules + " cellule(s)."
            );
          }
        }

        console.log(
          "departementsDansLesLignesDuTableau : " +
            departementsDansLesLignesDuTableau
        );
        console.log(
          "statutsDansLesLignesDuTableau : " + statutsDansLesLignesDuTableau
        );

        /*Si le filtre du département est "Département: Tous" observer que deux employés sont associés à des départements différents
Sinon observer que le tableau contient que des employés du département ${Département}  */
        if (departements[cpt1] === "all") {
          let res = false;
          let val = departementsDansLesLignesDuTableau[0];
          for (const dep of departementsDansLesLignesDuTableau) {
            if (dep != val) {
              res = true;
            }
          }
          await expect(res).toBe(true);
        } else {
          if (departementsDansLesLignesDuTableau.length > 0) {
            let res = true;
            let val = departementsDansLesLignesDuTableau[0];
            for (const dep of departementsDansLesLignesDuTableau) {
              if (dep != val) {
                res = false;
              }
            }
            await expect(res).toBe(true);
          }
        }

        /*Si le filtre du département est "Statut: Tous" observer que deux employés sont associés à des statuts différents
Sinon observer que le tableau contient que des employés avec le statut ${statut}*/
        if (statuts[cpt2] === "all") {
          let res = false;
          let val = statutsDansLesLignesDuTableau[0];
          for (const stat of statutsDansLesLignesDuTableau) {
            if (stat != val) {
              res = true;
            }
          }
          await expect(res).toBe(true);
        } else {
          if (statutsDansLesLignesDuTableau.length > 0) {
            let res = true;
            let val = statutsDansLesLignesDuTableau[0];
            for (const stat of statutsDansLesLignesDuTableau) {
              if (stat != val) {
                res = false;
              }
            }
            await expect(res).toBe(true);
          }
        }

        //augmentation de une unité de la valeur de la variable cpt2
        cpt2 = cpt2 + 1;
      }

      //augmentation de une unité de la valeur de la variable cpt1
      cpt1 = cpt1 + 1;
    }
  });

  //test BDON-35 autre version
  //Vérifier que des utilisations de filtres permettent d'obtenir des résultats attendus
  test("test BDON-35 autre version", async ({ page }) => {
    //changer le timeout du test
    test.setTimeout(40_000);
    //liste des éléments du filtre département
    const departements = [
      "all",
      "Ingénierie",
      "Ventes",
      "Marketing",
      "RH",
      "Juridique",
      "Crise Existentielle",
      "Mèmes",
    ];
    //liste des éléments du filtre statut
    const statuts = ["all", "Actif", "Absent", "Sur la sellette"];
    //compteur pour parcourir la collection departements
    let cpt1 = 0;

    while (cpt1 < departements.length) {
      //compteur pour parcourir la collection statuts
      let cpt2 = 0;
      while (cpt2 < statuts.length) {
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

        //Faire en sorte d’avoir le filtre département avec l'élément ${département}
        await page.getByTestId("dept-filter").selectOption(departements[cpt1]);
        //L'élément ${département} est affiché sur le filtre département
        await expect(page.getByTestId("dept-filter")).toHaveValue(
          departements[cpt1]
        );

        //Faire en sorte d’avoir le filtre statut avec l'élément ${statut}
        await page.getByTestId("status-filter").selectOption(statuts[cpt2]);
        //L'élément ${statut}  est affiché sur le filtre statut
        await expect(page.getByTestId("status-filter")).toHaveValue(
          statuts[cpt2]
        );

        //affichage de la configuration de filtres dans la console
        await console.log(
          "département : " +
            departements[cpt1] +
            "\n" +
            "statut : " +
            statuts[cpt2]
        );

        //sélection du tableau
        const tableBody = page.locator("#table-body");
        //attendre que le tableau soit visible
        await tableBody.waitFor({ state: "visible" });
        //obtention des lignes du tableau
        const lignes = await tableBody.locator("tr").all();
        //collection pour stocker les départements dans les lignes du tableau
        const departementsDansLesLignesDuTableau = [];
        //collection pour stocker les statuts dans les lignes du tableau
        const statutsDansLesLignesDuTableau = [];
        for (const ligne of lignes) {
          //Nombre de cellules 'td' à l'intérieur de cette ligne
          const nombreDeCellules = await ligne.locator("td").count();
          if (nombreDeCellules > 6) {
            //récupération de la valeur de la 4ieme cellule de la ligne (le département)
            const valeurCelluleDepartement = await ligne
              .locator("td")
              .nth(3)
              .textContent();
            //ajout de la valeur de la cellule département dans la collection pour stocker les départements dans les lignes du tableau
            await departementsDansLesLignesDuTableau.push(
              valeurCelluleDepartement?.trim()
            );
            //récupération de la valeur de la 7eme cellule de la ligne (le département)
            const valeurCelluleStatut = await ligne
              .locator("td")
              .nth(6)
              .textContent();
            //ajout de la valeur de la cellule statut dans la collection pour stocker les statuts dans les lignes du tableau
            statutsDansLesLignesDuTableau.push(valeurCelluleStatut?.trim());
          } else {
            console.log(
              "Attention, la ligne a " + nombreDeCellules + " cellule(s)."
            );
          }
        }

        console.log(
          "departementsDansLesLignesDuTableau : " +
            departementsDansLesLignesDuTableau
        );
        console.log(
          "statutsDansLesLignesDuTableau : " + statutsDansLesLignesDuTableau
        );

        /*Si le filtre du département est "Département: Tous" observer que deux employés sont associés à des départements différents
Sinon observer que le tableau contient que des employés du département ${Département}  */
        if (departements[cpt1] === "all") {
          let res = false;
          let val = departementsDansLesLignesDuTableau[0];
          for (const dep of departementsDansLesLignesDuTableau) {
            if (dep != val) {
              res = true;
            }
          }
          await expect(res).toBe(true);
        } else {
          if (departementsDansLesLignesDuTableau.length > 0) {
            let res = true;
            let val = departementsDansLesLignesDuTableau[0];
            for (const dep of departementsDansLesLignesDuTableau) {
              if (dep != val) {
                res = false;
              }
            }
            await expect(res).toBe(true);
          }
        }

        /*Si le filtre du département est "Statut: Tous" observer que deux employés sont associés à des statuts différents
Sinon observer que le tableau contient que des employés avec le statut ${statut}*/
        if (statuts[cpt2] === "all") {
          let res = false;
          let val = statutsDansLesLignesDuTableau[0];
          for (const stat of statutsDansLesLignesDuTableau) {
            if (stat != val) {
              res = true;
            }
          }
          await expect(res).toBe(true);
        } else {
          if (statutsDansLesLignesDuTableau.length > 0) {
            let res = true;
            let val = statutsDansLesLignesDuTableau[0];
            for (const stat of statutsDansLesLignesDuTableau) {
              if (stat != val) {
                res = false;
              }
            }
            await expect(res).toBe(true);
          }
        }

        //augmentation de une unité de la valeur de la variable cpt2
        cpt2 = cpt2 + 1;
      }

      //augmentation de une unité de la valeur de la variable cpt1
      cpt1 = cpt1 + 1;
    }
  });
});
