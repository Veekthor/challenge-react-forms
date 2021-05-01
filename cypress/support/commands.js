/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-wait-until';

Cypress.Commands.add("enterPerson", person => {
  cy.get("[name=name]")
    .clear()
    .type(person.name)
    .invoke("val")
    .should("equal", person.name);
  cy.get("[name=email]")
    .clear()
    .type(person.email)
    .invoke("val")
    .should("equal", person.email);
  cy.get("[name=age]")
    .clear()
    .type(person.age)
    .invoke("val")
    .should("equal", person.age);
  cy.get("[name=phoneNumber]")
    .clear()
    .type(person.phoneNumber)
    .invoke("val")
    .should("equal", person.phoneNumber);
  cy.get("[name=password]")
    .clear()
    .type(person.password)
    .invoke("val")
    .should("equal", person.password);
  cy.get("[name=homepage]")
    .clear()
    .type(person.homepage)
    .invoke("val")
    .should("equal", person.homepage);
})