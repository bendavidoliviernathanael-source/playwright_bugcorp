import { test, expect } from "@playwright/test";

test.describe("Changer le rôle d'un employé: promouvoir", () => {
  // test BDON-30
  test("test BDON-30", async ({ page }) => {
    // Etape 1
    // Visiter le site
    await page.goto("https://bugcorp.vercel.app/");
    //Dans le bandeau de gauche, "Accueil" apparaît sur un fond bleu
    await expect(page.getByTestId("nav-home")).toBeVisible();
    // la page affiche "Bienvenue chez BugCorp"
    await page.getByRole("heading", { name: "Bienvenue chez BugCorp" }).click();

    // Coffee Maker, Prompt Engineer, Scapegoat, Intern, Junior Dev, Senior Dev, Manager, Director, VP, CEO, Galactic Emperor

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
    await expect(page.locator("#target-savings-value")).toContainText("€");

    // Etape 3
    // Placer la souris au croisement de la ligne correspondant à l’ID de l'employé sélectionné et de la colonne "actions".
    // ID à tester: #1015 Alan Turing - rôle de base: Coffee maker
    // pour atteindre l'employé sur lequel porte le test => taper "Alan" dans la barre de recherche
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("Alan");
    // la liste doit afficher l'employé à tester et son rôle
    await expect(page.locator("#cell-name-1015")).toContainText("Alan Turing");
    await expect(page.locator("#cell-role-1015")).toContainText("Coffee Maker");
    // au survol avec la souris, le bouton "promouvoir" doit apparaître
    await page.getByTestId("promote-btn-1015").hover();
    await expect(page.getByTestId("promote-btn-1015")).toBeVisible();
    // BUGS doit être égal à -44
    await expect(page.getByText("-44")).toBeVisible();
    // L’encart  objectif d'économie indique: OBJECTIF D’ECONOMIES = 0€ / "objectif d'économie défini"
    await page.getByText("0 €", { exact: true }).click();

    // Etape 4
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    //Le nom du rôle situé sous l’identité de l’employé change pour devenir: Prompt Engineer
    await expect(page.locator("#cell-role-1015")).toContainText(
      "Prompt Engineer"
    );
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-44");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié (diminué de 15000€)
    await expect(page.locator("#current-savings-value")).toContainText(
      "-15 000 €"
    );

    // Etape 5
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Scapegoat
    await expect(page.locator("#cell-role-1015")).toContainText("Scapegoat");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-54");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-30 000 €"
    );

    // Etape 6
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Intern
    await expect(page.locator("#cell-role-1015")).toContainText("Intern");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-64");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-45 000 €"
    );

    // Etape 7
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Junior Dev
    await expect(page.locator("#cell-role-1015")).toContainText("Junior Dev");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-74");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-60 000 €"
    );

    // Etape 8
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Senior Dev
    await expect(page.locator("#cell-role-1015")).toContainText("Senior Dev");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-84");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-75 000 €"
    );

    // Etape 9
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Manager
    await expect(page.locator("#cell-role-1015")).toContainText("Manager");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-94");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-90 000 €"
    );

    // Etape 10
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Director
    await expect(page.locator("#cell-role-1015")).toContainText("Director");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-104");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-105 000 €"
    );

    // Etape 11
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: VP
    await expect(page.locator("#cell-role-1015")).toContainText("VP");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-114");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-120 000 €"
    );

    // Etape 12
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: CEO
    await expect(page.locator("#cell-role-1015")).toContainText("CEO");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-124");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-135 000 €"
    );

    // Etape 13
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Galactic Emperor
    await expect(page.locator("#cell-role-1015")).toContainText(
      "Galactic Emperor"
    );
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-134");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-150 000 €"
    );

    // Etape 14
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Galactic Emperor
    await expect(page.locator("#cell-role-1015")).toContainText(
      "Galactic Emperor"
    );
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).toHaveText("-144");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-150 000 €"
    );
  });

  test("test BDON-37", async ({ page }) => {
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
    await expect(page.locator("#target-savings-value")).toContainText("€");

    // Etape 3
    // Placer la souris au croisement de la ligne correspondant à l’ID de l'employé sélectionné et de la colonne "actions".
    // la liste doit afficher l'employé à tester et son rôle
    // ID à tester: #1010 Ellen Ripley - rôle de base: Galactic Emperor
    await expect(page.locator("#cell-name-1010")).toContainText("Ellen Ripley");
    await expect(page.locator("#cell-role-1010")).toContainText(
      "Galactic Emperor"
    );
    // au survol avec la souris, le bouton "Rétrograder" doit apparaître
    await page.getByTestId("demote-btn-1010").hover();
    await expect(page.getByTestId("demote-btn-1010")).toBeVisible();
    // récupérer le nombre de BUGS affiché
    const bugsLocator = page.locator("#cell-bugs-1010");

    const initialText = await bugsLocator.textContent();
    let bugCount = Number(initialText); // ex: +128 => 128
    console.log("initialText", initialText)
    console.log("nb de bugs: ", bugCount);
    // vérifier que le nombre de bug attendu correspond à ce que l'on récupère
    expect(Number(initialText)).toBe(bugCount);

    // L’encart  objectif d'économie indique: OBJECTIF D’ECONOMIES = 0€ / "objectif d'économie défini"
    // Localiser l'élément
    const savingsLocator = page.locator("#current-savings-value");

    // Récupérer le texte
    const text = await savingsLocator.textContent(); // "0 €" (note: le &nbsp; devient un vrai espace)

    // Extraire le nombre
    let savings = Number(text?.replace(/[^\d.-]/g, ""));

    console.log("OBJECTIF D’ECONOMIES", savings); // 0

    await page.getByText("0 €", { exact: true }).click();



    // Etape 4
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le bas.
       await page.getByTestId('demote-btn-1010').click();
    
   // Le nom du rôle situé sous l’identité de l’employé change pour devenir:  CEO
     await expect(page.locator("#cell-role-1010")).toContainText("CEO");

//le nombre de bugs a augmenté de 10 (note: donc 128+10=138)
bugCount += 10;
 await expect(bugsLocator).toHaveValue(bugCount);

 console.log("nb de bugs: ", bugCount);


//le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    
  });
});
