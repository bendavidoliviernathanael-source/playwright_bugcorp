import { test, expect } from "@playwright/test";

//Test BDON-32 Virer 1 employé depuis le bandeau pop-up après l'avoir sélectionné dans la liste
test("test BDON 32", async ({ page }) => {
  //Visiter le site https://bugcorp.vercel.app/
  await page.goto("https://bugcorp.vercel.app/");
  //Cliquer sur l'onglet annuaire
  await page.getByTestId("nav-directory").click();
  //Récupérer l'effectif avant licenciement
  const effectifAvantLicenciement = parseInt(
    await page.locator("#stat-total-count").innerText()
  );
  await console.log("Effectif avant licenciement =", effectifAvantLicenciement);
  //Récupérer l'économie avant le licenciement
  const texteEconomieAvantLicenciement = await page
    .locator("#current-savings-value")
    .innerText();
  const economieAvantLicenciement = await parseInt(
    texteEconomieAvantLicenciement.replace(/[^\d]/g, ""),
    10
  );
  await console.log("Economie avant licenciement =", economieAvantLicenciement);
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
  await console.log("Effectif après licenciement =", effectifApresLicenciement);
  //on vérifie que la valeur de l'effectif est plus petite d’une unité par rapport à cette valeur avant le licenciement
  await expect(effectifApresLicenciement).toBe(effectifAvantLicenciement - 1);
  //récupérer l'économie après le licenciement
  const texteEconomieApresLicenciement = await page
    .locator("#current-savings-value")
    .innerText();
  const economieApresLicenciement = await parseInt(
    texteEconomieApresLicenciement.replace(/[^\d]/g, ""),
    10
  );
  await console.log("Economie après licenciement =", economieApresLicenciement);

  //On vérifie que l'employé a bien été licencié: 3 - le licenciement a engendré une économie de 45000 euros
  await expect(economieApresLicenciement).toBe(
    economieAvantLicenciement + 45000
  );
});
