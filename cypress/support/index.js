import './commands'
import authModule from '../models/authModule';
import data from '../fixtures/data.json';
import sidebar from '../models/sidebarModule';
import navigationModule from '../models/navigationModule';
import registrationModule from '../models/registrationModule';
import boardModule from '../models/boardModule';
import organisationModule from '../models/organisationModule';

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  }),

Cypress.Commands.add('login', ({ email = data.user.email, password = data.user.password }) => {
  // (username = Cypress.env('username'), password = Cypress.env('password'))
// Ako funkciji prosledimo objekat, ona ne mora da radi sa egzaktnim podacima, nego objekat može biti i prazan
  if (email !== "") {
    authModule.emailInput.type(email);
  }
  if (password !== "") {
    authModule.passwordInput.type(password);
  } 
  cy.intercept("POST", "**/api/v2/login").as("login");
  authModule.loginButton.click();
  if (email == data.user.email && password == data.user.password) {
    cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');
    // Assert that login attempt has been authorised
		cy.assertStatusCode('@login', 200);

    // Assert that we have successfully requested organization list upon logging in
		cy.assertStatusCode('@myOrganizations', 200);
  }
}),

Cypress.Commands.add('logout', () => {
  cy.intercept('POST', '**api/v2/logout').as('logout');
		sidebar.myAccountButton.click();
		sidebar.profileSettings.click();
		// Assert that we are at the "Settings" page
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/account/settings');
		navigationModule.logoutButton.should('be.visible').click();
    cy.assertStatusCode('@logout', 201);

		// Assert that we are back at the right screen
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login');
}),

Cypress.Commands.add('register', ({ 
  email = data.user.email, 
  password = data.user.password,
  numberOfUsers = data.numberOfUsers.validNumber
}) => {
  registrationModule.emailField.clear();
  registrationModule.passwordField.clear();
  registrationModule.numberOfUsers.clear();

  if (email !== "") {
    registrationModule.emailField.type(email);
  }
  if (password !== "") {
    registrationModule.passwordField.type(password);
  }
  if (numberOfUsers !== "") {
    registrationModule.numberOfUsers.type(numberOfUsers);
  }
  registrationModule.submitButton.click();

  if (email == data.user.email &&
    password == data.user.password &&
    numberOfUsers == data.numberOfUsers.validNumber) {
      cy.intercept('POST', '/api/v2/register').as('register');
      cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');

      // Assert that registration POST request was successful
      cy.assertStatusCode('@register', 200);

      // Assert that "My organizations" have been requested
      cy.assertStatusCode('@myOrganizations', 200);

      // Make sure that the browser has loaded the correct URL
      cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');
    }
}),

Cypress.Commands.add('configureAndAssertABoard', ({boardTitle = data.boardTitle}) => {
  cy.intercept('POST', '/api/v2/boards').as('postABoard');

  boardModule.addBoardFromPanel.click();
  boardModule.newBoardTitle.type(boardTitle);
  boardModule.nextButton.click();
  boardModule.boardTypeScrum.click();
  boardModule.nextButton.click();
  boardModule.nextButton.click();
  boardModule.nextButton.click();
  
  // Assert a successful post request and verify board name and URL from the response
  cy.wait('@postABoard')
  .its('response')
  .then((res) => {
  expect(res.statusCode).to.eq(201);
  expect(res.body.name).to.eq(boardTitle);
  cy.url().should('eq', `${Cypress.config().baseUrl}boards/${res.body.id}`);
  })
}),

Cypress.Commands.add('configureAndAssertNewOrg', (
  {organisationName = data.accountDetails.organisationName}
) => {
  cy.intercept('POST', '/api/v2/organizations').as('addOrganization');

  organisationModule.navigateOrgName.should('be.visible').type(organisationName);
  organisationModule.navigateNextButton.click();
  organisationModule.navigateNextButton.click();

  organisationModule.confirmBoardsModal.click();

  cy.wait('@addOrganization')
  .its('response')
  .then((res) => {
  expect(res.statusCode).to.eq(200);
  expect(res.body.name).to.eq(organisationName);
  cy.url().should('eq', `${Cypress.config().baseUrl}organizations/${res.body.id}/boards`);
  })
}),

Cypress.Commands.add('editOrgName', (
  {organisationName = data.accountDetails.organisationName}
) => {
  cy.intercept('PUT', '/api/v2/organizations/*').as('rename');

  organisationModule.organisationNameHeader.eq(0).click();
  if (organisationName != "") {
    organisationModule.editOrganisation.clear().type(organisationName);
  }
  organisationModule.confirmOrgNameChange.click();
}),

Cypress.Commands.add('assertStatusCode', (intercept, code) => {
  cy.wait(intercept).its('response').then((res) => {
    expect(res.statusCode).to.eq(code);
    });
}),

Cypress.Commands.add('assertStatusCodeAndBody', (intercept, code, message) => {
  cy.wait(intercept).its('response').then((res) => {
  expect(res.statusCode).to.eq(code);
  expect(res.body.name).to.eq(message);
  })
})

Cypress.Commands.add('assertStatusCodeAndError', (intercept, code, message) => {
  cy.wait(intercept).its('response').then((res) => {
  expect(res.statusCode).to.eq(code);
  expect(res.body.errors[0]).to.eq(message);
  })
})