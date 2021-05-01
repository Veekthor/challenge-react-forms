/// <reference types="cypress"/>
describe("Sign Up", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("persons.json").as("persons");
  });
  it("Adds a person to the list", () => {
    cy.get("@persons").then((persons) => {
      const [person] = persons;
      cy.enterPerson(person)

      cy.get("[type=submit]")
        .should("not.be.disabled")
        .click()
        .invoke("val")
        .should("include", "Saving");

      cy.waitUntil(() =>
        cy.get('input[type="submit"]').invoke("val").should("equal", "Saved!")
      );

      // check table values
      const checkTableValue = (personEmail, value, column) =>
        cy
          .get(
            `#people-table > tbody > tr[data-email="${personEmail}"] > td:nth-child(${
              column + 1
            })${column === 3 || column === 4 ? " > a" : ""}`
          )
          .should("have.text", value);
      checkTableValue(person.email, person.name, 0);
      checkTableValue(person.email, person.email, 1);
      checkTableValue(person.email, person.age, 2);
      checkTableValue(person.email, person.phoneNumber, 3);
      checkTableValue(person.email, person.homepage, 4);
    });
  });
});
