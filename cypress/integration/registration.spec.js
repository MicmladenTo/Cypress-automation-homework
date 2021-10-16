import loginPage from '../fixtures/loginModule.json';
import registration from '../fixtures/registration.json';
import pricingPage from '../fixtures/pricingPage.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';
// isto sto i:
// import login from '../fixtures/loginModule.json'

describe('Registration suite', () => { 

	it('Go to registration page', () => {
		cy.visit('/', {timeout: 30000});
		cy.get(loginPage.linktoSignup).click();
	});

	it('Sign up for a starter account', () => {
		cy.get(pricingPage.monthlySwitch).click({force:true});
		cy.get(pricingPage.annualPackages.starterSignup).click({force:true});
	});

	it('Attempt registration without email', () => {
		cy.get(registration.password, { timeout: 10000 }).type(data.user.password);
		cy.get(registration.numberOfUsers).type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Attempt registration without the @ in email', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noAtSymbol);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Attempt registration without domain in the email', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noDomain);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Attempt registration without top-level domain in the email', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noTopLevel);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Attempt registration with an invalid second-level domain name', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.invalidSecondLevel);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Attempt registration without an email username', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.noUsername);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Attempt registration with special characters in email username', () => {
		cy.get(registration.email).clear().type(data.invalidEmail.specialChar);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Attempt registration without a password', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear();
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
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
	});

	it('Attempt registration without a number of users', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear();
		cy.get(registration.submit).click();
	});

	it('Attempt registration with no users', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.tooFew);
		cy.get(registration.submit).click();
	});

	it('Attempt registration with more users than allowed', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.tooMany);
		cy.get(registration.submit).click();
	});

	it('Register successfully', () => {
		cy.get(registration.email).clear().type(data.user.email);
		cy.get(registration.password).clear().type(data.user.password);
		cy.get(registration.numberOfUsers).clear().type(data.numberOfUsers.validNumber);
		cy.get(registration.submit).click();
	});

	it('Log in again and add account details', () => {
		// Log out
		cy.get(sidebar.account).click();
		cy.get(sidebar.profileSettings).click();
		cy.get(navigation.logoutButton).click();
		// Log back in
		cy.get(loginPage.emailInput).type(data.user.email);
		cy.get(loginPage.passwordInput).type(data.user.password);
		cy.get(loginPage.loginButton).click();
		cy.wait(4000);
		// Add account details
		cy.get(registration.accountDetailsModal.firstName).type(data.accountDetails.firstName);
		cy.get(registration.accountDetailsModal.lastName).type(data.accountDetails.lastName);
		cy.get(registration.accountDetailsModal.companyName).type(data.accountDetails.companyName);
		cy.get(registration.accountDetailsModal.organisationName).type(data.accountDetails.organisationName);
		cy.get(registration.accountDetailsModal.submitButton).click();
		cy.wait(2000);
	});
  })
