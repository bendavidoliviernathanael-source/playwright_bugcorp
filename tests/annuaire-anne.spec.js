import { test, expect } from "@playwright/test";

//const rolesReversed = roles.reverse();

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

test.describe("Changer le rôle d'un employé", () => {
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
});
