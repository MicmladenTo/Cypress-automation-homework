import loginPage from '../fixtures/loginModule.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';
import authModule from '../models/authModule';
import faker from "faker";

describe('A suite of login tests', () => {

	before(() => {
		cy.intercept('/api/v2/health-check').as('loginRedirect');
		cy.visit('/', {timeout: 30000});

		// Make sure we have been properly redirected at the beginning of the suite
		cy.assertStatusCode('@loginRedirect', 200);
	});

	beforeEach(() => {
		// Make sure our input fields are empty before every test
		cy.get(loginPage.emailInput).clear().should('have.value', '');
		cy.get(loginPage.passwordInput).clear().should('have.value', '');
	})

	it('no username login', () => {
		// Make sure we are at the correct URL before the first test in the suite
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login')
		
		cy.login({email: ""})

		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('no password login', () => {
		cy.login({password: ""})

		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(1).should('contain', 'The password field is required');
	});

	it('wrong username login', () => {
		// Intercept the login POST route
		cy.intercept('POST', '/api/v2/login').as('login');
		// Ako hoćemo da prosledimo 1/2 vrednosti iz objekta, možemo pisati { password : dsdsadsa}
		// Mora se navesti koji element objekta upisujemo da ne bi pukla funkcija
		// Prednost je u tome što ovako možemo samo neke elemente da izostavimo
		// Umesto svojih vrednosti, možemo uvoditi i elemente iz JSON-a

		cy.login({ email: faker.internet.email()  });
		
		//Assert that the error message pertains to mismatched login data
		cy.get(loginPage.loginError).should('contain', 'Oops! Your email/password combination is incorrect');

		// Assert the "unauthorised request" network response
		cy.assertStatusCode('@login', 401);
		
	});

	it('wrong password login', () => {
		// Intercept the login POST route
		cy.intercept('POST', '/api/v2/login').as('login');
		cy.login({password: data.wrongUser.wrongPassword});
		

		//Assert that the error message pertains to mismatched login data
		cy.get(loginPage.loginError).should('contain', 'Oops! Your email/password combination is incorrect');

		// Assert the "unauthorised request" network response
		cy.assertStatusCode('@login', 401);
	});

	it('invalid user login', () => {
		cy.login({email: data.invalidUser.invalidUser});
		
		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('invalid password login', () => {
		cy.login({password: data.invalidUser.invalidPassword});

		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(1).should('contain', 'The password field must be at least 5 characters');
	});

	it('Valid login, then logout', () => {
		cy.login({});
		cy.logout();
	});
  })
