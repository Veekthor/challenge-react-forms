/// <reference types="cypress"/>
describe("Sign Up", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("persons.json").as("persons");
  });

  it("Checks if page loaded properly", () => {
    cy.contains("Sign Up").should("exist");
    cy.contains("People").should("exist");
    const checkInputs = (n, label, name, placeholder) => {
      cy.get(`form > div:nth-child(${n})`)
        .should("exist")
        .should("include.text", label);
      cy.get(`form > div:nth-child(${n}) input[name="${name}"]`)
        .invoke("attr", "placeholder")
        .should("equal", placeholder);
      cy.get(`form > div:nth-child(${n}) .red`).should("exist");
    };

    checkInputs(1, "Name", "name", "Pat Smith");
    checkInputs(2, "Email", "email", "pat@smith.com");
    checkInputs(3, "Age", "age", "33");
    checkInputs(4, "Phone Number", "phoneNumber", "800-555-1212");
    checkInputs(5, "Password", "password", "Str0ngP@ssword~");
    checkInputs(6, "Homepage", "homepage", "https://smith.com/pat");

    cy.get('[type="submit"')
      .should("be.disabled")
      .invoke("val")
      .should("equal", "Submit");

    cy.contains("People").should("exist");
    const checkTableHeaders = (n, value) => cy.get(`#people-table > thead > tr > th:nth-child(${n})`).should("have.text", value);
    checkTableHeaders(1, "Name")
    checkTableHeaders(2, "Email")
    checkTableHeaders(3, "Age")
    checkTableHeaders(4, "Phone")
    checkTableHeaders(5, "Homepage")

    cy.get("#people-table > tbody").should("not.be.visible")
  });

  it("Adds a person to the list", () => {
    cy.get("@persons").then((persons) => {
      const [person] = persons;
      cy.enterPerson(person);

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
