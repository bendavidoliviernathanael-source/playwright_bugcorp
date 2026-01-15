import { test, expect } from "@playwright/test";

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

    // Coffee Maker, Prompt Engineer, Scapegoat, Intern, Junior Dev, Senior Dev, Manager, Director, VP, CEO, Galactic Emperor

    // Etape 4
    await promouvoir(page, 1015, "Prompt Engineer");
    // Etape 5
    await promouvoir(page, 1015, "Scapegoat");
    // Etape 6
    await promouvoir(page, 1015, "Intern");

    // Etape 7
    await promouvoir(page, 1015, "Junior Dev");

    // Etape 8
    await promouvoir(page, 1015, "Senior Dev");

    // Etape 9
    await promouvoir(page, 1015, "Manager");

    // Etape 10
    await promouvoir(page, 1015, "Director");

    // Etape 11
    await promouvoir(page, 1015, "VP");

    // Etape 12
    await promouvoir(page, 1015, "CEO");

    // Etape 13
    await promouvoir(page, 1015, "Galactic Emperor");

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
});
