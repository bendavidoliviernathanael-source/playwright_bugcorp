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

  //test BDON-33
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
