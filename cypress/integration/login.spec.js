const loginPage = require('../fixtures/loginModule.json')
const data = require('../fixtures/data.json');
const sidebar = require('../fixtures/sidebar.json');
const navigation = require('../fixtures/navigation.json');
// import login from '../fixtures/loginModule.json'

describe('first cypress block', () => {

	it('visit vivify scrum', () => {
		cy.visit('/', {timeout: 30000});
	});

	it('no username login', () => {
		cy.get(loginPage.passwordInput).clear().type(data.user.password);
		cy.get(loginPage.loginButton).click();
	});

	it('no password login', () => {
		cy.get(loginPage.emailInput).clear().type(data.user.email);
		cy.get(loginPage.passwordInput).clear();
		cy.get(loginPage.loginButton).click();
	});

	it('wrong username login', () => {
		cy.get(loginPage.emailInput).clear().type(data.wrongUser.wrongEmail);
		cy.get(loginPage.passwordInput).clear().type(data.user.password);
		cy.get(loginPage.loginButton).click();
	});

	it('wrong password login', () => {
		cy.get(loginPage.emailInput).clear().type(data.user.email);
		cy.get(loginPage.passwordInput).clear().type(data.wrongUser.wrongPassword);
		cy.get(loginPage.loginButton).click();
	});

	it('invalid user login', () => {
		cy.get(loginPage.emailInput).clear().type(data.invalidUser.invalidUser);
		cy.get(loginPage.passwordInput).clear().type(data.user.password);
		cy.get(loginPage.loginButton).click();
	});

	it('invalid password login', () => {
		cy.get(loginPage.emailInput).clear().type(data.user.email)
		cy.get(loginPage.passwordInput).clear().type(data.invalidUser.invalidPassword);
		cy.get(loginPage.loginButton).click();
	});

	it('valid login', () => {
		cy.get(loginPage.emailInput).clear().type(data.user.email);
		cy.get(loginPage.passwordInput).clear().type(data.user.password);
		cy.get(loginPage.loginButton).click();
	});

	it('log out', () => {
		cy.get(sidebar.account).click();
		cy.get(sidebar.profileSettings).click();
		cy.get(navigation.logoutButton).click();
	});


  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })