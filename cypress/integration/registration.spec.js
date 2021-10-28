import loginPage from '../fixtures/loginModule.json';
import registration from '../fixtures/registration.json';
import pricingPage from '../fixtures/pricingPage.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';
// isto sto i:
// import login from '../fixtures/loginModule.json'

describe('Registration suite', () => { 

	it.only('Go to registration page', () => {
		cy.intercept('/api/v2/health-check').as('loginRedirect');
		cy.visit('/', {timeout: 30000});
		// Make sure we have been properly redirected on visiting the homepage
		cy.wait('@loginRedirect')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})
		cy.get(loginPage.linktoSignup).click();
		// Make sure we are at the Pricing page
		cy.url().should('eq', 'https://cypress-api.vivifyscrum-stage.com/pricing')
	});

	it.only('Sign up for a starter account', () => {
		cy.intercept('/api/v2/pricing-plans/1').as('registrationForm');

		cy.get(pricingPage.monthlySwitch).click({force:true});
		// Assert that we see four packages
		cy.get(pricingPage.visiblePackages).should('be.visible').and('have.length', 4);
		cy.get(pricingPage.annualPackages.starterSignup).click({force:true});

		// Wait for the registration form and assert that the status code of the request is correct
		cy.wait('@registrationForm')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})
	});

	it('Attempt registration without email', () => {
		cy.get(registration.password, { timeout: 10000 }).type(data.user.password);
		cy.get(registration.numberOfUsers).type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(registration.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('Attempt registration without the @ in email', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noAtSymbol);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(registration.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('Attempt registration without domain in the email', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noDomain);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(registration.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('Attempt registration without top-level domain in the email', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noTopLevel);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(registration.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('Attempt registration with an invalid second-level domain name', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.invalidSecondLevel);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(registration.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('Attempt registration without an email username', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noUsername);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(registration.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('Attempt registration with special characters in email username', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.specialChar);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to an invalid email message
		cy.get(registration.errorFields).eq(0).should('contain', 'The email field must be a valid email');
	});

	it('Attempt registration without a password', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear();
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to the lack of pasword
		cy.get(registration.errorFields).eq(1).should('contain', 'The password field is required');
	});

	// it('Attempt registration with an invalid password', () => {
	// 	cy.get(registration.email).clear().type(data.user.email);
	// 	cy.get(registration.password).clear().type(data.invalidPassword.invalidChars);
	// 	cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
	// 	cy.get(registration.submit).click();
	// });

	it('Attempt registration with too short a password', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.invalidPassword.tooShort);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to password length
		cy.get(registration.errorFields).eq(1).should('contain', 'The password field must be at least 5 characters');
	});

	it('Attempt registration without a number of users', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear();
		cy.get(registration.submit).click();
		// Assert that the error message pertains to the required "number of users" value
		cy.get(registration.errorFields).eq(2).should('contain', 'The number of users field is required');
	});

	it('Attempt registration with no users', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.tooFew);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to the inadequate number of users
		cy.get(registration.errorFields).eq(2).should('contain', 'The number of users must be between 1 and 10');
	});

	it('Attempt registration with more users than allowed', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.tooMany);
		cy.get(registration.submit).click();
		// Assert that the error message pertains to the inadequate number of users
		cy.get(registration.errorFields).eq(2).should('contain', 'The number of users must be between 1 and 10');
	});

	it.only('Register successfully', () => {
		cy.intercept('POST', '/api/v2/register').as('register');
		cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();

		// Assert that registration POST request was successful
		cy.wait('@register')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})

		// Assert that "My organizations" have been requested
		cy.wait('@myOrganizations')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})

		// Make sure that the browser has loaded the correct URL
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');
	});

	it.only('Add account details and log out', () => {
		cy.intercept('POST', '/api/v2/logout').as('logout');

		// Go to Account section and assert that we are at the expected page
		cy.get(sidebar.account).click();

		// Add account details and assert that the correct values have been put in the modal
		cy
		.get(registration.accountDetailsModal.firstName)
		.type(data.accountDetails.firstName)
		.should('have.value', data.accountDetails.firstName);
		cy
		.get(registration.accountDetailsModal.lastName)
		.type(data.accountDetails.lastName)
		.should('have.value', data.accountDetails.lastName);;
		cy
		.get(registration.accountDetailsModal.companyName)
		.type(data.accountDetails.companyName)
		.should('have.value', data.accountDetails.companyName);;
		cy
		.get(registration.accountDetailsModal.organisationName)
		.type(data.accountDetails.organisationName)
		.should('have.value', data.accountDetails.organisationName);;
		cy.get(registration.accountDetailsModal.submitButton).click();

		// Assert that the modal is no longer visible
		cy.get(registration.accountDetailsModal).should("not.be.visible");

		// If explicit wait is not used, the same modal reappears during automated testing
		cy.wait(2000);

		// Go to Account settings section and assert that we are at the right place
		cy.get(sidebar.profileSettings).click();
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/account/settings');

		// Logout and assert that the request is valid
		cy.get(navigation.logoutButton).click();
		cy.wait('@logout')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);
		});

		// Assert that we are back at the login screen
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login');

		// Log back in
		// cy.get(loginPage.emailInput).type(data.user.email);
		// cy.get(loginPage.passwordInput).type(data.user.password);
		// cy.get(loginPage.loginButton).eq(0).click();
	});
  })
