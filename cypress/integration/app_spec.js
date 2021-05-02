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
  // when each input is wrong
  context("invalid Input", () => {
    beforeEach(() => {
      cy.get("@persons").then((persons) => {
        const [person] = persons;
        cy.enterPerson(person)
      })
    })

    afterEach(() => {
      cy.get('[type="submit"]').should("be.disabled")
    })

    const checkErrorMsg = (n, expectedVal) => cy.get(`form > div:nth-child(${n}) > div`).should("have.text", expectedVal)

    context("For email input", () => {
      it("shows error when email input is empty", () => {
        cy.get('[name="email"]')
          .clear()
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })

      it("shows error when email input value length is greater than 254", () => {
        const characters = Array(254).fill("a").join("")
        cy.get('[name="email"]')
          .clear()
          .type(characters + "@gmail.com")
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })

      it("shows error when email input does not include @", () => {
        cy.get('[name="email"]')
          .clear()
          .type("hellogmail.com")
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })

      it("shows error when email input top level domain is less than 2 letters period", () => {
        cy.get('[name="email"]')
          .clear()
          .type("hello@gmail.c")
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })

      it("shows error when email input top level domain includes a special character except period", () => {
        cy.get('[name="email"]')
          .clear()
          .type("hello@gmail.c#om")
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })

      it("shows error when email input domain includes a special character except period", () => {
        cy.get('[name="email"]')
          .clear()
          .type("hello@gma#il.co")
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })

      it("shows error when email input domain includes two @ symbols", () => {
        cy.get('[name="email"]')
          .clear()
          .type("hell@o@gmail.co")
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })

      it("shows error when email input starts with @ symbol", () => {
        cy.get('[name="email"]')
          .clear()
          .type("@gmail.co")
          .blur();
        
        checkErrorMsg(2, "Invalid Email")
      })
    })

    context("For age input", () => {
      it("shows error when age input is empty", () => {
        cy.get('[name="age"]')
          .clear()
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })

      it("shows error when age input is zero", () => {
        cy.get('[name="age"]')
          .clear()
          .type("0")
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })

      it("shows error when age input is less than zero", () => {
        cy.get('[name="age"]')
          .clear()
          .type("-2")
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })

      it("shows error when age input is 200", () => {
        cy.get('[name="age"]')
          .clear()
          .type("200")
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })

      it("shows error when age input is greater than 200", () => {
        cy.get('[name="age"]')
          .clear()
          .type("300")
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })

      it("shows error when a non decimal age input includes a special character except a leading + or -", () => {
        cy.get('[name="age"]')
          .clear()
          .type("30~0")
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })

      it("shows error when age input includes more than one period (.)", () => {
        cy.get('[name="age"]')
          .clear()
          .type("30.0.")
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })

      it("shows error when age input includes a white space", () => {
        cy.get('[name="age"]')
          .clear()
          .type("30.0 ")
          .blur();
        
        checkErrorMsg(3, "Invalid Age")
      })
    })

    context("For password input", () => {
      it("shows error when password input is empty", () => {
        cy.get('[name="password"]')
          .clear()
          .blur();
        
        checkErrorMsg(5, "Weak Password")
      })
      
      it("shows error when password input is less than 8 characters", () => {
        const characters = Array(7).fill("a").join("")
        cy.get('[name="password"]')
          .clear()
          .type(characters)
          .blur();
        
        checkErrorMsg(5, "Weak Password")
      })
      
      it("shows error when password input does not include an upper case letter", () => {
        cy.get('[name="password"]')
          .clear()
          .type("1@qqqww/")
          .blur();
        
        checkErrorMsg(5, "Weak Password")
      })
      
      it("shows error when password input does not include a lower case letter", () => {
        cy.get('[name="password"]')
          .clear()
          .type("1@1111Q1/")
          .blur();
        
        checkErrorMsg(5, "Weak Password")
      })
      
      it("shows error when password input does not include a number", () => {
        cy.get('[name="password"]')
          .clear()
          .type("w@qqqWw/")
          .blur();
        
        checkErrorMsg(5, "Weak Password")
      })
      
      it("shows error when password input does not include a symbol", () => {
        cy.get('[name="password"]')
          .clear()
          .type("11qqqWwW")
          .blur();
        
        checkErrorMsg(5, "Weak Password")
      })
    })
  })
});
