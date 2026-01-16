import { test, expect } from "@playwright/test";

test.describe("Tests de la page contact - contact par mail", () => {
  //Test sur la fonctionnalité CONTACT: contact par mail
  test("test BDON-40", async ({ page }) => {
    await page.goto("https://bugcorp.vercel.app/");
    await page.getByTestId("nav-contact").click();
    // Saisir les champs obligatoires "Nom", "Email" et "Message" avec au moins 10 caractères
    await page.getByRole("textbox", { name: "Votre Nom *" }).click();
    await page.getByRole("textbox", { name: "Votre Nom *" }).fill("PETIT");
    await page.getByRole("textbox", { name: "Votre Nom *" }).press("Tab");
    await page.getByRole("textbox", { name: "Email *" }).fill("test@yahoo.com");
    await page.getByRole("textbox", { name: "Message *" }).click();
    await page
      .getByRole("textbox", { name: "Message *" })
      .fill("Je dois saisir au moins 10 caractères !");
    //Cliquer sur le bouton "Initialiser la transmission"
    await page
      .getByRole("button", { name: "Initialiser la Transmission" })
      .click();
    //Attendre que la page de progression de transmission soit visible
    await page.locator("#status-console-success").waitFor({ state: "visible" });

    //Verifier que la transmission du mail a réussi avec le message "TRANSMISSION REUSSIE" affiché
    await expect(page.locator("#status-console-success")).toContainText(
      "TRANSMISSION RÉUSSIE"
    );
  });
  //Test sur la fonctionnalité CONTACT par mail: le formulaire refuse un message qui contient moins de 10 caractères
  test("test BDON-42", async ({ page }) => {
    await page.goto("https://bugcorp.vercel.app/");
    await page.getByTestId("nav-contact").click();
    await page.getByRole("textbox", { name: "Votre Nom *" }).click();
    await page.getByRole("textbox", { name: "Votre Nom *" }).fill("Bouba");
    await page.getByRole("textbox", { name: "Votre Nom *" }).press("Tab");
    await page.getByRole("textbox", { name: "Email *" }).fill("bouba@yahoo.fr");

    //Le champ sujet a t-il la valeur par défaut "Jai trouvé un bug (impossible)"
    await expect(page.locator("#select-subject")).toHaveValue("bug");

    //Le champ "Message" contient le texte suivant par défaut:"Cher journal, aujourd'hui j'ai tout cassé parce que..."
    console.log(
      await page.locator("#textarea-message").getAttribute("placeholder")
    );
    await expect(page.locator("#textarea-message")).toHaveAttribute(
      "placeholder",
      "Cher journal, aujourd'hui j'ai tout cassé parce que..."
    );

    //Cliquer sur le champ "Message"
    await page.getByRole("textbox", { name: "Message *" }).click();
    //Saisir un message volontairement trop court afin de vérifier l'affichage d'un message d'erreur
    await page.getByRole("textbox", { name: "Message *" }).fill("Salut");
    //Cliquer sur le bouton "Initialiser la transmission"
    await page
      .getByRole("button", { name: "Initialiser la Transmission" })
      .click();
    //Le message "Message envoyé avec succès" ne doit pas apparaître
    await expect(
      page.getByText("Message envoyé avec succès")
    ).not.toBeVisible();
  });
});
