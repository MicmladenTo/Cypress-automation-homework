import loginPage from '../fixtures/loginModule.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';

describe('A suite of login tests', () => {

	before(() => {
		cy.intercept('/api/v2/health-check').as('loginRedirect');
		cy.visit('/', {timeout: 30000});

		// Make sure we have been properly redirected at the beginning of the suite
		cy.wait('@loginRedirect')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})
	});

	beforeEach(() => {
		// Make sure our input fields are empty before every test
		cy.get(loginPage.emailInput).clear().should('have.value', '');
		cy.get(loginPage.passwordInput).clear().should('have.value', '');
	})

	it('no username login', () => {
		// Make sure we are at the correct URL before the first test in the suite
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login')
		cy.get(loginPage.passwordInput).type(data.user.password);
		cy.get(loginPage.loginButton).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('no password login', () => {
		cy.get(loginPage.emailInput).type(data.user.email);
		cy.get(loginPage.loginButton).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(1).should('contain', 'The password field is required');
	});

	it('wrong username login', () => {
		// Intercept the login POST route
		cy.intercept('POST', '/api/v2/login').as('login');
		cy.get(loginPage.emailInput).type(data.wrongUser.wrongEmail);
		cy.get(loginPage.passwordInput).type(data.user.password);
		cy.get(loginPage.loginButton).click();
		//Assert that the error message pertains to mismatched login data
		cy.get(loginPage.loginError).should('contain', 'Oops! Your email/password combination is incorrect');

		// Assert the "unauthorised request" network response
		cy.wait('@login')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(401);
		})
	});

	it('wrong password login', () => {
		// Intercept the login POST route
		cy.intercept('POST', '/api/v2/login').as('login');
		cy.get(loginPage.emailInput).type(data.user.email);
		cy.get(loginPage.passwordInput).type(data.wrongUser.wrongPassword);
		cy.get(loginPage.loginButton).click();
		//Assert that the error message pertains to mismatched login data
		cy.get(loginPage.loginError).should('contain', 'Oops! Your email/password combination is incorrect');

		// Assert the "unauthorised request" network response
		cy.wait('@login')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(401);
		})
	});

	it('invalid user login', () => {
		cy.get(loginPage.emailInput).type(data.invalidUser.invalidUser);
		cy.get(loginPage.passwordInput).type(data.user.password);
		cy.get(loginPage.loginButton).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('invalid password login', () => {
		cy.get(loginPage.emailInput).type(data.user.email)
		cy.get(loginPage.passwordInput).type(data.invalidUser.invalidPassword);
		cy.get(loginPage.loginButton).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(loginPage.errorFields).eq(1).should('contain', 'The password field must be at least 5 characters');
	});

	it.only('Valid login, then logout', () => {
		// Intercept the login, logout and my-organization routes
		cy.intercept('POST', '/api/v2/login').as('login');
		cy.intercept('POST', '/api/v2/logout').as('logout');
		cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');

		cy.get(loginPage.emailInput).type(data.user.email);
		cy.get(loginPage.passwordInput).type(data.user.password);
		cy.get(loginPage.loginButton).click();

		// Assert that login attempt has been authorised
		cy.wait('@login')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})

		// Assert that we have successfully requested organization list upon logging in
		cy.wait('@myOrganizations')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})

		// Make sure that the browser has loaded the correct URL
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');

		// Go to Account settings section and assert that we are at the right place
		cy.get(sidebar.account).click();
		cy.get(sidebar.profileSettings).click();
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/account/settings');

		// Logout and assert that the request is valid
		cy.get(navigation.logoutButton).click();
		cy.wait('@logout')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);
		});

		// Assert that we are back at the right screen
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login');
	});
  })
